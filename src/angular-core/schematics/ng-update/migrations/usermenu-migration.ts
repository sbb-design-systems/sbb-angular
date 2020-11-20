import { Migration, parse5, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';
import type { DefaultTreeDocument, DefaultTreeElement } from 'parse5';

const parse: typeof import('parse5') = parse5;

/**
 * Migration for the sbb-usermenu:
 * - replaces sbbIcon with *sbbIcon
 * - removes <sbb-dropdown> tag
 * - replaces sbbDropdownItem with sbb-usermenu-item directive
 */
export class UsermenuMigration extends Migration<null> {
  enabled = this.targetVersion === TargetVersion.V11;

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    const document = parse.parseFragment(template.content, {
      sourceCodeLocationInfo: true,
    }) as DefaultTreeDocument;
    const sbbUsermenuElements: DefaultTreeElement[] = [];
    const sbbIconElements: DefaultTreeElement[] = [];
    const sbbDropdownElements: DefaultTreeElement[] = [];
    const sbbDropdownItemElements: DefaultTreeElement[] = [];

    const visitNodes = (nodes: any[]) => {
      nodes.forEach((node: DefaultTreeElement) => {
        if (node.childNodes) {
          visitNodes(node.childNodes);
        }

        if (node.nodeName.toLowerCase() === 'sbb-usermenu') {
          sbbUsermenuElements.push(node);
        }

        if (this._hasSbbIconDirective(node)) {
          sbbIconElements.push(node);
        }

        if (node.nodeName.toLowerCase() === 'sbb-dropdown') {
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
      this.logger.info('replace sbbIcon with *sbbIcon');
      for (const element of sbbIconElements) {
        const sbbIconLocation = element.sourceCodeLocation!.attrs['sbbicon'];
        if (!sbbIconLocation || !this._isDirectDescendant(element, sbbUsermenuElements)) {
          break;
        }

        // add *before sbbIcon -> *sbbIcon
        recorder.insertLeft(template.start + sbbIconLocation.startOffset, '*');
      }
    }

    if (sbbDropdownElements.length) {
      this.logger.info('remove sbb-dropdown tag');
      this.logger.info('replace sbbDropdownItem by sbb-usermenu-item directive');

      for (const sbbDropdownElement of sbbDropdownElements) {
        const sbbDropdownLocationStart = sbbDropdownElement.sourceCodeLocation?.startTag;
        const sbbDropdownLocationEnd = sbbDropdownElement.sourceCodeLocation?.endTag;
        if (
          !sbbDropdownLocationStart ||
          !sbbDropdownLocationEnd ||
          !this._isDirectDescendant(sbbDropdownElement, sbbUsermenuElements)
        ) {
          break;
        }

        // remove sbb-dropdown start tag
        recorder.remove(
          template.start + sbbDropdownLocationStart.startOffset,
          sbbDropdownLocationStart.endOffset - sbbDropdownLocationStart.startOffset
        );

        // remove sbb-dropdown end tag
        recorder.remove(
          template.start + sbbDropdownLocationEnd.startOffset,
          sbbDropdownLocationEnd.endOffset - sbbDropdownLocationEnd.startOffset
        );

        for (const sbbDropdownItemElement of sbbDropdownItemElements) {
          const sbbDropdownItemLocation = sbbDropdownItemElement.sourceCodeLocation!.attrs[
            'sbbdropdownitem'
          ];
          if (
            !sbbDropdownItemLocation ||
            !this._isDirectDescendant(sbbDropdownItemElement, [sbbDropdownElement])
          ) {
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
  }

  private _hasSbbIconDirective(node: DefaultTreeElement) {
    return node.attrs && node.attrs.some((a) => a.name.toLowerCase() === 'sbbicon');
  }

  private _hasSbbDropdownItemDirective(node: DefaultTreeElement) {
    return node.attrs && node.attrs.some((a) => a.name.toLowerCase() === 'sbbdropdownitem');
  }

  private _isDirectDescendant(node: DefaultTreeElement, elements: DefaultTreeElement[]) {
    return (elements || []).some((element) => {
      return element.childNodes && element.childNodes.length && element.childNodes.includes(node);
    });
  }
}
