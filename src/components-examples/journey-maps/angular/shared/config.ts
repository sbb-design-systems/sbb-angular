import { LngLatBoundsLike } from 'maplibre-gl';

export const RAIL_COLORS = [
  { label: 'default' },
  { label: 'hide', value: 'transparent' },
  {
    label: 'silver',
    value: 'rgba(220,220,220,1)',
  },
  { label: 'blue', value: 'rgba(45,50,125,1)' },
  { label: 'lemon', value: 'rgba(255,222,21,1)' },
  {
    label: 'violet',
    value: 'rgba(111,34,130,1)',
  },
];

export const STYLE_IDS = {
  v2: {
    brightId: 'base_bright_v2_ki_v2',
    darkId: 'base_dark_v2_ki_v2',
    aerialId: 'aerial_sbb_ki_v2',
  },
  v3: {
    brightId: 'journey_maps_bright_v1',
    darkId: 'journey_maps_dark_v1',
    aerialId: 'journey_maps_aerial_v1',
  },
};

export const CH_BOUNDS: LngLatBoundsLike = [
  [5.7349, 45.6755],
  [10.6677, 47.9163],
];

export const POI_CATEGORIES = [
  'park_rail',
  'car_sharing',
  'p2p_car_sharing',
  'bike_parking',
  'bike_sharing',
  'on_demand',
];
