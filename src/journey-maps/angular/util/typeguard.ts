import {
  SbbBoundingBoxOptions,
  SbbMapCenterOptions,
  SbbViewportDimensions,
} from '../journey-maps.interfaces';

export function isSbbMapCenterOptions(
  viewportDimensions?: SbbViewportDimensions
): viewportDimensions is SbbMapCenterOptions {
  return (
    !!viewportDimensions && 'mapCenter' in viewportDimensions && 'zoomLevel' in viewportDimensions
  );
}

export function isSbbBoundingBoxOptions(
  viewportDimensions?: SbbViewportDimensions
): viewportDimensions is SbbBoundingBoxOptions {
  return !!viewportDimensions && 'boundingBox' in viewportDimensions;
}
