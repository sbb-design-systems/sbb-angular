import { LngLatBoundsLike } from 'maplibre-gl';

export const SBB_CLUSTER_RADIUS = 50;
export const SBB_MARKER_BOUNDS_PADDING = 40;

export const SBB_MIN_ZOOM = 1;
export const SBB_MAX_ZOOM = 23; /* same as in mobile-clients */
export const SBB_BOUNDING_BOX: LngLatBoundsLike = [
  // CH bounds;
  [5.7349, 45.6755],
  [10.6677, 47.9163],
];

export const JOURNEY_POIS_SOURCE = 'journey-pois-source';
export const ROKAS_MARKER_SOURCE = 'rokas-marker-source';
export const ROKAS_ROUTE_SOURCE = 'rokas-route-source';
export const ROKAS_STATION_HOVER_SOURCE = 'rokas-station-hover-source'; // TODO cdi ROKAS-1204 where is this source used ?
export const ROKAS_STOPOVER_SOURCE = 'rokas-stopover-source';
export const ROKAS_WALK_SOURCE = 'rokas-walk-source';
export const ROKAS_ZONE_SOURCE = 'rokas-zone-source';

export const SBB_POI_LAYER = 'journey-pois';
export const SBB_CLUSTER_LAYER = 'rokas-marker-cluster';
export const SBB_MARKER_LAYER = 'sbb-marker';
export const SBB_MARKER_LAYER_SELECTED = 'sbb-marker-selected';

export const SBB_METADATA_MAPPINGS = 'rokas:markerCategoryMapping';
