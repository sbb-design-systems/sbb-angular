import { Map as MaplibreMap } from 'maplibre-gl';

import { SBB_POI_FIRST_LAYER, SBB_ROKAS_WALK_SOURCE } from '../../constants';

export const isV1Style = (map: MaplibreMap): boolean => {
  return !!map.getStyle().sources[SBB_ROKAS_WALK_SOURCE];
};

export const isV3Style = (map: MaplibreMap): boolean => {
  return !!map.getStyle().layers.find((ly) => ly.id === SBB_POI_FIRST_LAYER);
};
