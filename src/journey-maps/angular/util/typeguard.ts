import {
  SbbMapCenterOptions,
  SbbViewportDimensions,
} from '@sbb-esta/journey-maps/angular/journey-maps.interfaces';

export function isSbbMapCenterOptions(
  viewportDimensions: SbbViewportDimensions
): viewportDimensions is SbbMapCenterOptions {
  return 'mapCenter' in viewportDimensions && 'zoomLevel' in viewportDimensions;
}
