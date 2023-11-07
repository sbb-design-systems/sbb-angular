// To avoid colliding name exports in bundles, don't use star export here
export { SbbTabsModule } from './tabs-module';
export * from './tab-group';
export { SbbTabBody, SbbTabBodyPositionState, SbbTabBodyPortal } from './tab-body';
export { SbbTabHeader } from './tab-header';
export { SbbTabLabelWrapper } from './tab-label-wrapper';
export { SbbTab, SBB_TAB_GROUP } from './tab';
export { SbbTabLabel, SBB_TAB } from './tab-label';
export {
  SbbTabNav,
  SbbTabLink,
  _SbbTabNavBase,
  _SbbTabLinkBase,
  SbbTabNavPanel,
} from './tab-nav-bar';
export { SbbTabContent } from './tab-content';
export { ScrollDirection } from './paginated-tab-header';
export * from './tabs-animations';
export { SBB_TABS_CONFIG, SbbTabsConfig } from './tab-config';
