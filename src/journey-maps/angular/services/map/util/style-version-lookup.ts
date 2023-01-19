import { Map as MaplibreMap } from 'maplibre-gl';

import { SBB_ROKAS_WALK_SOURCE } from '../../constants';

export const isV1Style = (map: MaplibreMap): boolean => {
  return !!map.getStyle().sources[SBB_ROKAS_WALK_SOURCE];
};
