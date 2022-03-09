import { Injectable } from '@angular/core';
import { AnyLayer, GeoJSONSource, Map as MaplibreMap } from 'maplibre-gl';

@Injectable({ providedIn: 'root' })
export class MapStationService {
  static readonly STATION_LAYER = 'rokas-station-hover';
  static readonly STATION_SOURCE = 'rokas-station-hover-source';

  private _stationLayers: string[];
  private _listener: () => void;

  registerStationUpdater(map: MaplibreMap): void {
    this._stationLayers = this._stationLayers ?? this._extractStationLayers(map);

    if (map.loaded()) {
      this._updateStationSource(map);
    } else {
      map.once('idle', () => this._updateStationSource(map));
    }

    this._listener = () => map.once('idle', () => this._updateStationSource(map));
    map.on('moveend', this._listener);
  }

  deregisterStationUpdater(map: MaplibreMap): void {
    if (this._listener) {
      map.off('moveend', this._listener);
    }
  }

  private _updateStationSource(map: MaplibreMap): void {
    const features = map
      .queryRenderedFeatures(undefined, { layers: this._stationLayers })
      .map((f) => ({ type: f.type, properties: f.properties, geometry: f.geometry }));

    map.removeFeatureState({ source: MapStationService.STATION_SOURCE });
    const source = map.getSource(MapStationService.STATION_SOURCE) as GeoJSONSource;
    source.setData({ type: 'FeatureCollection', features });
  }

  private _extractStationLayers(map: MaplibreMap): string[] | undefined {
    return map
      .getStyle()
      .layers?.filter((layer: AnyLayer) => {
        const sourceLayer = 'source-layer' in layer ? layer['source-layer'] : undefined;
        const id = layer.id;

        return (
          sourceLayer &&
          ((sourceLayer === 'osm_points' && id !== 'osm_points') ||
            (sourceLayer === 'poi' && id.startsWith('station_ship')))
        );
      })
      .map((layer: AnyLayer) => layer.id);
  }
}
