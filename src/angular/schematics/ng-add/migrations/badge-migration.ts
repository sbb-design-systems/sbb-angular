import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry, nodeCheck } from '../../utils';

/**
 * Migration that updates replaces <sbb-badge> instances with <span sbbBadge="">.
 */
export class BadgeMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _badges = new MigrationRecorderRegistry(this);

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-badge')) {
        this._badges.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._badges.empty) {
      this.logger.info('Migrating sbb-badge usages');
      this._badges.forEach((e) => this._handleBadge(e));
    }
  }

  private _handleBadge(element: MigrationElement) {
    const ariaLabel = element.findProperty('aria-label');
    ariaLabel?.rename('sbbBadgeDescription');
    const active = element.findProperty('active');
    if (active) {
      active.replace(`[matBadgeDisabled]="!${active.nativeValue}"`);
    }

    const start = element.resource.start;
    const { startTag, endTag } = element.location;
    const content = element.innerHtml().trim();
    element.recorder.remove(start + endTag.startOffset + 2, 9);
    element.recorder.insertRight(start + endTag.startOffset + 2, 'span');
    element.recorder.remove(start + startTag.endOffset, endTag.startOffset - startTag.endOffset);
    const badge =
      content.startsWith('{{') && content.endsWith('}}')
        ? `[sbbBadge]="${content.substr(2, content.length - 4).trim()}"`
        : `sbbBadge="${content}"`;
    element.recorder.remove(start + startTag.startOffset + 1, 9);
    element.recorder.insertRight(start + startTag.startOffset + 1, `span ${badge}`);
  }
}
