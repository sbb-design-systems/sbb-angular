import { Migration, parse5, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';
import type { DefaultTreeDocument, DefaultTreeElement } from 'parse5';

const parse: typeof import('parse5') = parse5;

/**
 * Migration for the sbb-usermenu:
 * - Replaces sbbIcon with *sbbIcon
 * - Removes <sbb-dropdown> tag
 * - Replaces sbbDropdownItem with sbb-usermenu-item directive
 */
export class UsermenuMigration extends Migration<null> {
  enabled = this.targetVersion === TargetVersion.V11;
  migrateSbbIcon = false;
  migrateDropdown = false;
  migrateDropdownItems = false;

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    const document = parse.parseFragment(template.content, {
      sourceCodeLocationInfo: true,
    }) as DefaultTreeDocument;
    const sbbIconElements: DefaultTreeElement[] = [];
    const sbbDropdownElements: DefaultTreeElement[] = [];
    const sbbDropdownItemElements: DefaultTreeElement[] = [];

    const visitNodes = (nodes: any[]) => {
      nodes.forEach((node: DefaultTreeElement) => {
        if (node.childNodes) {
          visitNodes(node.childNodes);
        }

        if (!this._isInUsermenu(node)) {
          return;
        }

        if (!this._isInSbbDropdown(node) && this._hasSbbIconDirective(node)) {
          sbbIconElements.push(node);
        }

        if (this._isSbbDropdown(node)) {
          sbbDropdownElements.push(node);
        }

        if (this._hasSbbDropdownItemDirective(node)) {
          sbbDropdownItemElements.push(node);
        }
      });
    };

    visitNodes(document.childNodes);

    const recorder = this.fileSystem.edit(template.filePath);

    if (sbbIconElements.length) {
      this.migrateSbbIcon = true;
      for (const element of sbbIconElements) {
        const sbbIconLocation = element.sourceCodeLocation!.attrs['sbbicon'];
        if (!sbbIconLocation) {
          break;
        }

        // add * before sbbIcon -> *sbbIcon
        recorder.insertLeft(template.start + sbbIconLocation.startOffset, '*');
      }
    }

    if (sbbDropdownElements.length) {
      this.migrateDropdown = false;
      for (const sbbDropdownElement of sbbDropdownElements) {
        const sbbDropdownLocationStart = sbbDropdownElement.sourceCodeLocation?.startTag;
        const sbbDropdownLocationEnd = sbbDropdownElement.sourceCodeLocation?.endTag;

        // remove sbb-dropdown start tag
        recorder.remove(
          template.start + sbbDropdownLocationStart!.startOffset,
          sbbDropdownLocationStart!.endOffset - sbbDropdownLocationStart!.startOffset
        );

        // remove sbb-dropdown end tag
        recorder.remove(
          template.start + sbbDropdownLocationEnd!.startOffset,
          sbbDropdownLocationEnd!.endOffset - sbbDropdownLocationEnd!.startOffset
        );
      }
    }

    if (sbbDropdownItemElements.length) {
      this.migrateDropdownItems = true;
      for (const sbbDropdownItemElement of sbbDropdownItemElements) {
        const sbbDropdownItemLocation = sbbDropdownItemElement.sourceCodeLocation!.attrs[
          'sbbdropdownitem'
        ];
        if (!sbbDropdownItemLocation) {
          break;
        }

        // remove sbbDropdownItem attribute
        recorder.remove(
          template.start + sbbDropdownItemLocation.startOffset,
          sbbDropdownItemLocation.endOffset - sbbDropdownItemLocation.startOffset
        );

        // add sbb-usermenu-item attribute
        recorder.insertRight(
          template.start + sbbDropdownItemLocation.startOffset,
          'sbb-usermenu-item'
        );
      }
    }
  }

  postAnalysis() {
    if (this.migrateSbbIcon) {
      this.logger.info('Replace sbbIcon with *sbbIcon inside sbb-usermenu');
    }
    if (this.migrateDropdown) {
      this.logger.info('Remove sbb-dropdown inside sbb-usermenu');
    }
    if (this.migrateDropdownItems) {
      this.logger.info(
        'Convert sbbDropdownItem to sbb-usermenu-item directive inside sbb-usermenu'
      );
    }
  }

  private _isUsermenu(node: DefaultTreeElement) {
    return node.nodeName.toLocaleLowerCase() === 'sbb-usermenu';
  }

  private _isSbbDropdown(node: DefaultTreeElement) {
    return node.nodeName.toLowerCase() === 'sbb-dropdown';
  }

  private _hasSbbIconDirective(node: DefaultTreeElement) {
    return node.attrs && node.attrs.some((a) => a.name.toLowerCase() === 'sbbicon');
  }

  private _hasSbbDropdownItemDirective(node: DefaultTreeElement) {
    return node.attrs && node.attrs.some((a) => a.name.toLowerCase() === 'sbbdropdownitem');
  }

  private _isInSbbDropdown(node: DefaultTreeElement) {
    let parent = node.parentNode as DefaultTreeElement;
    while (parent) {
      if (this._isSbbDropdown(parent)) {
        return true;
      }
      parent = parent.parentNode as DefaultTreeElement;
    }
    return false;
  }

  private _isInUsermenu(node: DefaultTreeElement) {
    let parent = node.parentNode as DefaultTreeElement;
    while (parent) {
      if (this._isUsermenu(parent)) {
        return true;
      }
      parent = parent.parentNode as DefaultTreeElement;
    }
    return false;
  }
}
