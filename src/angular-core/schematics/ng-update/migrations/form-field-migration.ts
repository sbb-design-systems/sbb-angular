import { Migration, parse5, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';
import { UpdateRecorder } from '@angular/cdk/schematics/update-tool/update-recorder';
import type { DefaultTreeDocument, DefaultTreeElement, Location } from 'parse5';
import * as ts from 'typescript';

const parse: typeof import('parse5') = parse5;

const LEGACY_FIELD_ENTRY_POINTS = [
  '@sbb-esta/angular-public/field',
  '@sbb-esta/angular-business/field',
];

/**
 * Migration for the sbb-form-field:
 * - updates imports from field to form-field.
 *   (e.g. @sbb-esta/angular-public/field => @sbb-esta/angular-public/form-field)
 * - renames sbb-field to sbb-form-field
 * - replaces mode with css classes
 * - removes for on sbb-label
 */
export class FormFieldMigration extends Migration<null> {
  enabled = this.targetVersion === TargetVersion.V11;
  modeReplacements = {
    short: 'sbb-form-field-short',
    medium: 'sbb-form-field-medium',
    long: 'sbb-form-field-long',
  };
  modeVariants = Object.keys(this.modeReplacements);
  migrateFormFieldMode = false;
  migrateSbbInput = false;
  migrateSbbField = false;
  migrateLabelFor = false;

  visitNode(declaration: ts.Node): void {
    // Only look at import declarations.
    if (
      !ts.isImportDeclaration(declaration) ||
      !ts.isStringLiteralLike(declaration.moduleSpecifier)
    ) {
      return;
    }

    const importLocation = declaration.moduleSpecifier.text;
    // If the import module is not @angular/material, skip the check.
    if (!LEGACY_FIELD_ENTRY_POINTS.includes(importLocation)) {
      return;
    }

    const filePath = this.fileSystem.resolve(declaration.moduleSpecifier.getSourceFile().fileName);
    const recorder = this.fileSystem.edit(filePath);

    // Perform the replacement that switches the primary entry-point import to
    // the individual secondary entry-point imports.
    recorder.remove(declaration.moduleSpecifier.getStart(), declaration.moduleSpecifier.getWidth());
    recorder.insertRight(
      declaration.moduleSpecifier.getStart(),
      declaration.moduleSpecifier.getText().replace('field', 'form-field')
    );
  }

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    const document = parse.parseFragment(template.content, {
      sourceCodeLocationInfo: true,
    }) as DefaultTreeDocument;
    const fieldElements: DefaultTreeElement[] = [];
    const formFieldWithModesElements: DefaultTreeElement[] = [];
    const missingInputElements: DefaultTreeElement[] = [];
    const sbbLabelWithForElements: DefaultTreeElement[] = [];

    const visitNodes = (nodes: any[]) => {
      nodes.forEach((node: DefaultTreeElement) => {
        if (node.childNodes) {
          visitNodes(node.childNodes);
        }

        if (node.nodeName.toLowerCase() === 'sbb-field') {
          fieldElements.push(node);
        }

        if (this._isFormField(node) && this._hasModeInput(node)) {
          formFieldWithModesElements.push(node);
        } else if (
          ['input', 'select', 'textarea'].includes(node.nodeName.toLowerCase()) &&
          this._isInFormField(node) &&
          !this._hasInputDirective(node)
        ) {
          missingInputElements.push(node);
        } else if (this._isSbbLabelWithFor(node)) {
          sbbLabelWithForElements.push(node);
        }
      });
    };

    visitNodes(document.childNodes);

    const recorder = this.fileSystem.edit(template.filePath);
    if (formFieldWithModesElements.length) {
      this.migrateFormFieldMode = true;
      for (const element of formFieldWithModesElements) {
        this._replaceMode(element, recorder, template.start);
      }
    }

    if (missingInputElements.length) {
      this.migrateSbbInput = true;
      for (const element of missingInputElements) {
        const start =
          template.start + element.sourceCodeLocation!.startOffset + element.nodeName.length + 1;
        recorder.insertRight(start, ' sbbInput');
      }
    }

    if (fieldElements.length) {
      this.migrateSbbField = true;
      for (const element of fieldElements) {
        const startTagStart = template.start + element.sourceCodeLocation!.startTag.startOffset + 4;
        recorder.insertRight(startTagStart, '-form');
        const endTagStart = template.start + element.sourceCodeLocation!.endTag.startOffset + 5;
        recorder.insertRight(endTagStart, '-form');
      }
    }

    if (sbbLabelWithForElements.length) {
      this.migrateLabelFor = true;
      for (const element of sbbLabelWithForElements) {
        const forLocation =
          element.sourceCodeLocation!.attrs['for'] || element.sourceCodeLocation!.attrs['[for]'];
        recorder.remove(
          template.start + forLocation.startOffset - 1,
          forLocation.endOffset - forLocation.startOffset + 1
        );
      }
    }
  }

  postAnalysis() {
    if (this.migrateFormFieldMode) {
      this.logger.info('Attempting to replace deprecated sbb-form-field[mode]');
    }
    if (this.migrateSbbInput) {
      this.logger.info(
        'Attempting to add required sbbInput to native input, select and textarea elements inside sbb-form-field'
      );
    }
    if (this.migrateSbbField) {
      this.logger.info('Changing sbb-field to sbb-form-field');
    }
    if (this.migrateLabelFor) {
      this.logger.info('Removing for attributes for sbb-label, as this is handled internally now');
    }
  }

  private _isInFormField(node: DefaultTreeElement) {
    let parent = node.parentNode as DefaultTreeElement;
    while (parent) {
      if (this._isFormField(parent)) {
        return true;
      }

      parent = parent.parentNode as DefaultTreeElement;
    }

    return false;
  }

  private _isFormField(node: DefaultTreeElement) {
    return ['sbb-field', 'sbb-form-field'].includes(node.nodeName.toLowerCase());
  }

  private _hasInputDirective(node: DefaultTreeElement) {
    return node.attrs.some((a) => a.name.toLowerCase() === 'sbbinput');
  }

  private _hasModeInput(node: DefaultTreeElement) {
    return node.attrs.some((a) => ['mode', '[mode]'].includes(a.name.toLowerCase()));
  }

  private _isSbbLabelWithFor(node: DefaultTreeElement) {
    return (
      node.nodeName.toLowerCase() === 'sbb-label' &&
      node.attrs.some((a) => ['for', '[for]'].includes(a.name.toLowerCase()))
    );
  }

  private _replaceMode(node: DefaultTreeElement, recorder: UpdateRecorder, templateStart: number) {
    if ('mode' in node.sourceCodeLocation!.attrs) {
      this._replaceAttributeMode(node, recorder, templateStart, 'mode');
    } else if ('[mode]' in node.sourceCodeLocation!.attrs) {
      this._replaceAttributeMode(node, recorder, templateStart, '[mode]');
    }
  }

  private _replaceAttributeMode(
    node: DefaultTreeElement,
    recorder: UpdateRecorder,
    templateStart: number,
    attribute: string
  ) {
    const mode = node.attrs.find((a) => a.name === attribute);
    const modeLocation = node.sourceCodeLocation!.attrs[attribute];
    if (!mode || !modeLocation) {
      return;
    }
    const value = mode.value.replace(/^["']/, '').replace(/["']$/, '');
    if (value === 'default') {
      this._removeMode(modeLocation, recorder, templateStart);
    } else if (this.modeVariants.includes(value)) {
      this._removeMode(modeLocation, recorder, templateStart);
      this._insertModeClass(node, recorder, templateStart, value);
    }
  }

  /**
   * Remove the mode, including preceding space. (e.g. ` mode="long"` => ``)
   */
  private _removeMode(modeLocation: Location, recorder: UpdateRecorder, templateStart: number) {
    recorder.remove(
      templateStart + modeLocation.startOffset - 1,
      modeLocation.endOffset - modeLocation.startOffset + 1
    );
  }

  private _insertModeClass(
    node: DefaultTreeElement,
    recorder: UpdateRecorder,
    templateStart: number,
    mode: string
  ) {
    const clazz = node.attrs.find((a) => a.name === 'class');
    if (clazz) {
      const clazzLocation = node.sourceCodeLocation!.attrs['class'];
      const start = templateStart + clazzLocation.endOffset - 1;
      recorder.insertRight(start, ` sbb-form-field-${mode}`);
    } else {
      const start = templateStart + node.sourceCodeLocation!.startOffset + node.nodeName.length + 1;
      recorder.insertRight(start, ` class="sbb-form-field-${mode}"`);
    }
  }
}
