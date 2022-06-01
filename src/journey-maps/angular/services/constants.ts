import { LngLatBoundsLike } from 'maplibre-gl';

export const SBB_CLUSTER_RADIUS = 50;
export const SBB_MARKER_BOUNDS_PADDING = 40;

export const SBB_BOUNDING_BOX: LngLatBoundsLike = [
  // CH bounds;
  [5.7349, 47.9163],
  [10.6677, 45.6755],
];

export const SBB_MARKER_SOURCE = 'rokas-marker-source';
export const SBB_ROUTE_SOURCE = 'rokas-route-source';
export const SBB_WALK_SOURCE = 'rokas-walk-source';
export const SBB_ZONE_SOURCE = 'rokas-zone-source';

export const SBB_POI_LAYER = 'journey-pois';
export const SBB_CLUSTER_LAYER = 'rokas-marker-cluster';
export const SBB_MARKER_LAYER = 'sbb-marker';
export const SBB_MARKER_LAYER_SELECTED = 'sbb-marker-selected';

export const SBB_METADATA_MAPPINGS = 'rokas:markerCategoryMapping';
