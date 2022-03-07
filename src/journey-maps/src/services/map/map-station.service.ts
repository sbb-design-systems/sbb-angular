import {Injectable} from '@angular/core';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';

@Injectable({providedIn: 'root'})
export class MapStationService {

  static readonly STATION_LAYER = 'rokas-station-hover';
  static readonly STATION_SOURCE = 'rokas-station-hover-source';

  private stationLayers: string[];
  private listener: () => void;

  registerStationUpdater(map: MaplibreMap): void {
    this.stationLayers = this.stationLayers ?? this.extractStationLayers(map);

    if (map.loaded()) {
      this.updateStationSource(map);
    } else {
      map.once('idle', () => this.updateStationSource(map));
    }

    this.listener = () => map.once('idle', () => this.updateStationSource(map));
    map.on('moveend', this.listener);
  }

  deregisterStationUpdater(map: MaplibreMap): void {
    if (this.listener) {
      map.off('moveend', this.listener);
    }
  }

  private updateStationSource(map: MaplibreMap): void {
    const features = map.queryRenderedFeatures(null, {layers: this.stationLayers})
      .map(f => ({type: f.type, properties: f.properties, geometry: f.geometry}));

    map.removeFeatureState({source: MapStationService.STATION_SOURCE});
    const source = map.getSource(MapStationService.STATION_SOURCE) as GeoJSONSource;
    source.setData({type: 'FeatureCollection', features});
  }

  private extractStationLayers(map: MaplibreMap): string[] {
    return map.getStyle().layers
      .filter((layer) => {
        const sourceLayer = layer['source-layer'];
        const id = layer.id;

        return sourceLayer === 'osm_points' && id !== 'osm_points'
          || sourceLayer === 'poi' && id.startsWith('station_ship');
      })
      .map((layer) => layer.id);
  }
}
