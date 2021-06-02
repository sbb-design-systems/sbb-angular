export * from './icon.module';

// To avoid colliding name exports in bundles, don't use star export here
export { SbbIcon, SBB_ICON_LOCATION, SBB_ICON_LOCATION_FACTORY, SbbIconLocation } from './icon';
export * from './icon-registry';
