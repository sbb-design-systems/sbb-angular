import { Directive, inject, TemplateRef } from '@angular/core';

import { SbbExpansionPanelBase, SBB_EXPANSION_PANEL } from './expansion-panel-base';

/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
@Directive({
  selector: 'ng-template[sbbExpansionPanelContent]',
})
export class SbbExpansionPanelContent {
  _template: TemplateRef<any> = inject<TemplateRef<any>>(TemplateRef);
  _expansionPanel: SbbExpansionPanelBase | null = inject<SbbExpansionPanelBase>(
    SBB_EXPANSION_PANEL,
    { optional: true },
  );

  constructor(...args: unknown[]);
  constructor() {}
}
