import {Injectable} from '@angular/core';
import {Map as MaplibreMap} from 'maplibre-gl';


@Injectable({
  providedIn: 'root'
})
export class MapLayerFilterService {

  private map: MaplibreMap;
  private knownLayerTypes = ['fill', 'fill-extrusion', 'line', 'symbol'];
  private knownLvlLayerIds: string[] = [];

  constructor() {
  }

  setMap(map: MaplibreMap): void {
    this.map = map;
    this.collectLvlLayers();
  }

  /*
  ["all",["==",["case",["has","level"],["get","level"],0],0],["==",["geometry-type"],"Polygon"]]
  ["==", "floor", 0]
  ["!=", "floor", 0] (It's a compound predicate because of NOT)
   */
  setLevelFilter(level: number): void {
    this.knownLvlLayerIds.forEach(layerId => {
      try {
        const oldFilter = this.map.getFilter(layerId);
        const newFilter = this.calculateLayerFilter(oldFilter, level);
        this.map.setFilter(layerId, newFilter);
      } catch (e) {
        console.error('Failed to set new layer filter', layerId, e);
      }
    });

    this.setLayerVisibility('rokas_background_mask', level < 0);
  }

  private calculateLayerFilter(oldFilter: any[], level: number): any[] {
    if (oldFilter == null || oldFilter.length < 1) {
      return oldFilter;
    }

    const newFilter = [];
    newFilter.push(oldFilter[0]);
    let floorFound = false;
    oldFilter.slice(1).forEach(part => {
      if (this.isString(part) && this.isFloorFilter(part)) {
        // "floor" in "rokas_indoor" and "geojson_walk" layers
        floorFound = true;
        newFilter.push(part);
      } else if (this.isArray(part)) {
        let levelFound = false;
        const newInnerPart = [part[0]];
        part.slice(1).forEach(innerPart => {
          const innerPartString = JSON.stringify(innerPart);
          if (this.isCaseLvlFilter(innerPartString)) {
            levelFound = true;
            newInnerPart.push(innerPart);
          } else if (this.isFloorFilter(innerPartString)) {
            levelFound = true;
            // when filter: ['==', ['get','floor'], 0]
            floorFound = true;
            newInnerPart.push(innerPart);
          } else if (levelFound) {
            levelFound = false;
            newInnerPart.push(level);
          } else {
            newInnerPart.push(innerPart);
          }
        });
        newFilter.push(newInnerPart);
      } else if (floorFound) {
        floorFound = false;
        newFilter.push(level);
      } else {
        newFilter.push(part);
      }
    });
    return newFilter;
  }

  private isCaseLvlFilter(innerPartString: string): boolean {
    return innerPartString.startsWith('["case",["has","level"],["get","level"]');
  }

  private isFloorFilter(innerPartString: string): boolean {
    return innerPartString.indexOf('floor') !== -1;
  }

  collectLvlLayers(): void {
    this.knownLvlLayerIds = [];

    this.map.getStyle().layers.forEach(layer => {
      if (this.knownLayerTypes.includes(layer.type) &&
        (layer.id.endsWith('-lvl')
          || layer.id.startsWith('rokas_indoor')
          || layer.id.startsWith('geojson_walk'))
      ) {
        this.knownLvlLayerIds.push(layer.id);
      }
    });
  }

  private isString(value: any): boolean {
    return Object.prototype.toString.call(value) === '[object String]';
  }

  private isArray(value: any): boolean {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  private setLayerVisibility(layerIdPrefix: string, show: boolean): void {
    this.map.getStyle().layers.forEach(layer => {
      if (layer.id.startsWith(layerIdPrefix)) {
        try {
          (this.map.getLayer(layer.id) as any).visibility = show ? 'visible' : 'none';
        } catch (e) {
          console.error('Failed to set layer visibility', layer.id, e);
        }
      }
    });
  }
}
