export * from './tooltip.module';
export * from './tooltip/tooltip.component';
export * from './tooltip/tooltip';
export * from './tooltip/tooltip-container.component';
export * from './tooltip/tooltip-animations';
export {
  SbbTooltipBase,
  SbbTooltipRegistryService,
  SbbTooltipChangeEvent,
  SBB_TOOLTIP_SCROLL_STRATEGY,
  SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY,
} from '@sbb-esta/angular-core/base/tooltip';
/** @deprecated Remove with v12 */
export { SbbTooltipModule as TooltipModule } from './tooltip.module';
/** @deprecated Remove with v12 */
export {
  SbbTooltipVisibility as TooltipVisibility,
  SbbTooltipContainer as TooltipContainerComponent,
} from './tooltip/tooltip-container.component';
/** @deprecated Remove with v12 */
export { SbbTooltipComponent as TooltipComponent } from './tooltip/tooltip.component';
/** @deprecated Remove with v12 */
export {
  SbbTooltipTouchGestures as TooltipTouchGestures,
  SBB_TOOLTIP_PANEL_CLASS as TOOLTIP_PANEL_CLASS,
  SbbTooltip as Tooltip,
} from './tooltip/tooltip';
