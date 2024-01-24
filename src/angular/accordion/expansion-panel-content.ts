import { Directive, Inject, Optional, TemplateRef } from '@angular/core';

import { SbbExpansionPanelBase, SBB_EXPANSION_PANEL } from './expansion-panel-base';

/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
@Directive({
  selector: 'ng-template[sbbExpansionPanelContent]',
  standalone: true,
})
export class SbbExpansionPanelContent {
  constructor(
    public _template: TemplateRef<any>,
    @Inject(SBB_EXPANSION_PANEL) @Optional() public _expansionPanel?: SbbExpansionPanelBase,
  ) {}
}
