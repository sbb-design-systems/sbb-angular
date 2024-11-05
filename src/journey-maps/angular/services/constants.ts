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

export const SBB_JOURNEY_POIS_SOURCE = 'journey-pois-source';
export const SBB_ROKAS_MARKER_SOURCE = 'rokas-marker-source';
export const SBB_ROKAS_ROUTE_SOURCE = 'rokas-route-source';
export const SBB_ROKAS_STATION_HOVER_SOURCE = 'rokas-station-hover-source';
export const SBB_ROKAS_STOPOVER_SOURCE = 'rokas-stopover-source';
export const SBB_ROKAS_WALK_SOURCE = 'rokas-walk-source';
export const SBB_ROKAS_ZONE_SOURCE = 'rokas-zone-source';
export const SBB_SERVICE_POINT_SOURCE = 'service_points';

export const SBB_POI_LAYER = 'journey-pois';
export const SBB_POI_HOVER_LAYER = 'journey-pois-hover';
export const SBB_POI_SELECTED_LAYER = 'journey-pois-selected';
export const SBB_POI_FIRST_LAYER = 'journey-pois-first';
export const SBB_POI_FIRST_HOVER_LAYER = 'journey-pois-first-hover';
export const SBB_POI_SECOND_2D_LAYER = 'journey-pois-second-2d';
export const SBB_POI_SECOND_2D_HOVER_LAYER = 'journey-pois-second-hover-2d';
export const SBB_POI_SECOND_3D_LAYER = 'journey-pois-second-lvl';
export const SBB_POI_SECOND_3D_HOVER_LAYER = 'journey-pois-second-hover-lvl';
export const SBB_POI_THIRD_2D_LAYER = 'journey-pois-third-2d';
export const SBB_POI_THIRD_3D_LAYER = 'journey-pois-third-lvl';
export const SBB_POI_ID_PROPERTY = 'sbbId';
export const SBB_CLUSTER_LAYER = 'rokas-marker-cluster';
export const SBB_MARKER_LAYER = 'sbb-marker';
export const SBB_MARKER_LAYER_SELECTED = 'sbb-marker-selected';

export const SBB_METADATA_MAPPINGS = 'rokas:markerCategoryMapping';
