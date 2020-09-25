export * from './accordion.module';
export {
  SbbAccordion,
  /**
   * @deprecated use AccordionDirective
   */
  SbbAccordion as AccordionComponent,
} from './accordion/accordion.directive';
export * from './accordion/accordion-token';
export * from './expansion-panel/expansion-panel.component';
export * from './expansion-panel-header/expansion-panel-header.component';
export * from './expansion-panel/expansion-panel-content';
export * from './accordion/accordion-animations';
/** @deprecated Remove with v12 */
export { SbbAccordionModule as AccordionModule } from './accordion.module';
/** @deprecated Remove with v12 */
export { SBB_EXPANSION_PANEL_ANIMATION_TIMING as EXPANSION_PANEL_ANIMATION_TIMING } from './accordion/accordion-animations';
/** @deprecated Remove with v12 */
export { SbbAccordion as AccordionDirective } from './accordion/accordion.directive';
/** @deprecated Remove with v12 */
export { SbbExpansionPanelContent as ExpansionPanelContentDirective } from './expansion-panel/expansion-panel-content';
/** @deprecated Remove with v12 */
export {
  SbbExpansionPanelState as ExpansionPanelState,
  SbbExpansionPanel as ExpansionPanelComponent,
} from './expansion-panel/expansion-panel.component';
/** @deprecated Remove with v12 */
export { SbbExpansionPanelHeader as ExpansionPanelHeaderComponent } from './expansion-panel-header/expansion-panel-header.component';
