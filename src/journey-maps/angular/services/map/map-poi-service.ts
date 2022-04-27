import { Injectable } from '@angular/core';
import { GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

import { SbbPointsOfInterestOptions } from '../../journey-maps.interfaces';

export const SBB_POIS_LAYER = 'journey-pois';
export const SBB_POIS_INTERACTION_LAYERS = ['journey-pois-hover', 'journey-pois-selected'];
export const SBB_POIS_INTERACTION_SOURCE = 'journey-pois-interaction-source';

@Injectable({ providedIn: 'root' })
export class SbbMapPoisService {
  configurePoiOptions(map: MaplibreMap, poiOptions: SbbPointsOfInterestOptions): void {
    if (poiOptions.categories?.length) {
      map.setFilter(SBB_POIS_LAYER, ['in', 'subCategory', ...poiOptions.categories]);
      map.setLayoutProperty(SBB_POIS_LAYER, 'visibility', 'visible');
    }
  }

  registerPoiUpdater(map: MaplibreMap): { listener: () => void } | undefined {
    this._removeFeatureState(map);

    if (map.loaded()) {
      this._updatePoiInteractionSource(map, [SBB_POIS_LAYER]);
    } else {
      map.once('idle', () => this._updatePoiInteractionSource(map, [SBB_POIS_LAYER]));
    }

    const listener = () =>
      map.once('idle', () => this._updatePoiInteractionSource(map, [SBB_POIS_LAYER]));
    map.on('moveend', listener);
    return { listener };
  }

  deregisterPoiUpdater(map: MaplibreMap, registration?: { listener: () => void }): void {
    if (registration?.listener) {
      map.off('moveend', registration.listener);
      this._removeFeatureState(map);
    }
  }

  private _updatePoiInteractionSource(map: MaplibreMap, poiLayers: string[]): void {
    const features = map
      .queryRenderedFeatures(undefined, { layers: poiLayers })
      .map((f) => ({ type: f.type, properties: f.properties, geometry: f.geometry }));

    const source = map.getSource(SBB_POIS_INTERACTION_SOURCE) as GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features });
  }

  private _removeFeatureState(map: MaplibreMap) {
    map.removeFeatureState({ source: SBB_POIS_INTERACTION_SOURCE });
  }
}
