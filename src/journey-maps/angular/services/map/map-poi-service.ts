import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbPointsOfInterestOptions } from '../../journey-maps.interfaces';
import {
  SBB_POI_FIRST_HOVER_LAYER,
  SBB_POI_FIRST_LAYER,
  SBB_POI_HOVER_LAYER,
  SBB_POI_LAYER,
  SBB_POI_SECOND_2D_HOVER_LAYER,
  SBB_POI_SECOND_2D_LAYER,
  SBB_POI_SECOND_3D_HOVER_LAYER,
  SBB_POI_SECOND_3D_LAYER,
  SBB_POI_SELECTED_LAYER,
} from '../constants';

import { isV3Style } from './util/style-version-lookup';

type PoiStyleLayerType = {
  [key in 'PIN' | 'SQUARE' | 'LEGACY']: {
    defaultLayer: string[];
    interactiveLayer?: string[];
  };
};

const poiStyleLayerMap: PoiStyleLayerType = {
  PIN: {
    defaultLayer: [SBB_POI_FIRST_LAYER],
    interactiveLayer: [SBB_POI_FIRST_HOVER_LAYER],
  },
  SQUARE: {
    defaultLayer: [SBB_POI_SECOND_2D_LAYER, SBB_POI_SECOND_3D_LAYER],
    interactiveLayer: [SBB_POI_SECOND_2D_HOVER_LAYER, SBB_POI_SECOND_3D_HOVER_LAYER],
  },
  LEGACY: {
    defaultLayer: [SBB_POI_LAYER],
    interactiveLayer: [SBB_POI_HOVER_LAYER, SBB_POI_SELECTED_LAYER],
  },
};

/** This class provides methods to handles all points of interest map styles: ki, ki_2 and journey_maps. */
@Injectable({ providedIn: 'root' })
export class SbbMapPoiService {
  updatePoiVisibility(map: MaplibreMap, poiOptions?: SbbPointsOfInterestOptions): void {
    if (!isV3Style(map)) {
      [
        ...poiStyleLayerMap.LEGACY.defaultLayer,
        ...(poiStyleLayerMap.LEGACY.interactiveLayer ?? []),
      ].forEach((layerId) => {
        this.updatePoiLayerFilter(map, layerId, poiOptions);
        this.updatePoiLayerVisibility(map, layerId, !!poiOptions?.categories?.length);
      });
    } else {
      [
        ...poiStyleLayerMap.PIN.defaultLayer,
        ...(poiStyleLayerMap.PIN.interactiveLayer ?? []),
      ].forEach((layerId) => {
        this.updatePoiLayerFilter(map, layerId, poiOptions);
        this.updatePoiLayerVisibility(map, layerId, !!poiOptions?.categories?.length);
      });
      [
        ...poiStyleLayerMap.SQUARE.defaultLayer,
        ...(poiStyleLayerMap.SQUARE.interactiveLayer ?? []),
      ].forEach((layerId) => {
        this.updatePoiLayerFilter(map, layerId, poiOptions, true);
      });
    }
  }

  getPoiLayerIds(map: MaplibreMap): string[] {
    return isV3Style(map)
      ? [...poiStyleLayerMap.PIN.defaultLayer, ...poiStyleLayerMap.SQUARE.defaultLayer]
      : poiStyleLayerMap.LEGACY.defaultLayer;
  }

  private updatePoiLayerFilter(
    map: MaplibreMap,
    poiLayerId: string,
    poiOptions?: SbbPointsOfInterestOptions,
    exclude?: boolean,
  ): void {
    map.setFilter(
      poiLayerId,
      poiOptions?.categories
        ? [exclude ? '!in' : 'in', 'subCategory', ...poiOptions.categories]
        : false,
    );
  }

  private updatePoiLayerVisibility(map: MaplibreMap, poiLayerId: string, isVisible: boolean): void {
    map.setLayoutProperty(poiLayerId, 'visibility', isVisible ? 'visible' : 'none');
  }
}
