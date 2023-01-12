import { Map as MaplibreMap } from 'maplibre-gl';

import { ROKAS_WALK_SOURCE } from '../../constants';

export const isV1Style = (map: MaplibreMap): boolean => {
  return !!map.getStyle().sources[ROKAS_WALK_SOURCE];
};
