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
    const sbbIconElements: DefaultTreeElement[] = [];
    const sbbDropdownElements: DefaultTreeElement[] = [];
    const sbbDropdownItemElements: DefaultTreeElement[] = [];

    const visitNodes = (nodes: any[]) => {
      nodes.forEach((node: DefaultTreeElement) => {
        if (node.childNodes) {
          visitNodes(node.childNodes);
        }

        if (this._isDirectDescendantOf('sbb-usermenu', node) && this._hasSbbIconDirective(node)) {
          sbbIconElements.push(node);
        }

        if (
          this._isDirectDescendantOf('sbb-usermenu', node) &&
          node.nodeName.toLowerCase() === 'sbb-dropdown'
        ) {
          sbbDropdownElements.push(node);
        }

        if (
          this._isDirectDescendantOf('sbb-usermenu', node.parentNode as DefaultTreeElement) &&
          this._isDirectDescendantOf('sbb-dropdown', node) &&
          this._hasSbbDropdownItemDirective(node)
        ) {
          sbbDropdownItemElements.push(node);
        }
      });
    };

    visitNodes(document.childNodes);

    const recorder = this.fileSystem.edit(template.filePath);

    if (sbbIconElements.length) {
      this.logger.info('Replace sbbIcon with *sbbIcon inside sbb-usermenu');

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
      this.logger.info('Remove sbb-dropdown inside sbb-usermenu');

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
      this.logger.info(
        'Convert sbbDropdownItem to sbb-usermenu-item directive inside sbb-usermenu'
      );

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

  private _hasSbbIconDirective(node: DefaultTreeElement) {
    return node.attrs && node.attrs.some((a) => a.name.toLowerCase() === 'sbbicon');
  }

  private _hasSbbDropdownItemDirective(node: DefaultTreeElement) {
    return node.attrs && node.attrs.some((a) => a.name.toLowerCase() === 'sbbdropdownitem');
  }

  private _isDirectDescendantOf(tagName: string, node: DefaultTreeElement) {
    const parent = node.parentNode as DefaultTreeElement;

    if (!parent) {
      return false;
    }
    return parent.nodeName.toLocaleLowerCase() === tagName;
  }
}
