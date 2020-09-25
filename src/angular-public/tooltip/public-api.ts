export * from './tooltip.module';
export * from './tooltip/tooltip.component';
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
export { SbbTooltipComponent as TooltipComponent } from './tooltip/tooltip.component';
