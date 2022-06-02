import {
  SbbBoundingBoxOptions,
  SbbMapCenterOptions,
} from '@sbb-esta/journey-maps/angular/journey-maps.interfaces';

export const isSbbMapCenterOptions = (
  obj: SbbBoundingBoxOptions | SbbMapCenterOptions
): obj is SbbMapCenterOptions => {
  return 'mapCenter' in obj && 'zoomLevel' in obj;
};
