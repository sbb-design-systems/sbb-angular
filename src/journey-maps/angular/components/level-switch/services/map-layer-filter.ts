import { Injectable } from '@angular/core';
import { FilterSpecification, Map as MaplibreMap } from 'maplibre-gl';

@Injectable()
export class SbbMapLayerFilter {
  private _map: MaplibreMap;
  private _knownLayerTypes = ['fill', 'fill-extrusion', 'line', 'symbol'];
  private _knownLvlLayerIds: string[] = [];

  setMap(map: MaplibreMap): void {
    this._map = map;
    this.collectLvlLayers();
  }

  /*
  ["all",["==",["case",["has","level"],["get","level"],0],0],["==",["geometry-type"],"Polygon"]]
  ["==", "floor", 0]
  ["!=", "floor", 0] (It's a compound predicate because of NOT)
   */
  setLevelFilter(level: number): void {
    this._knownLvlLayerIds.forEach((layerId) => {
      try {
        const oldFilter = this._map.getFilter(layerId) ?? undefined;
        const newFilter = this._calculateLayerFilter(oldFilter, level);
        this._map.setFilter(layerId, newFilter);
      } catch (e) {
        console.error('Failed to set new layer filter', layerId, e);
      }
    });

    this._setLayerVisibility('rokas_background_mask', level < 0);
  }

  private _calculateLayerFilter(
    oldFilter: FilterSpecification | undefined,
    level: number | undefined,
  ): FilterSpecification | null {
    if (!Array.isArray(oldFilter) || oldFilter.length < 1) {
      return null;
    }

    const newFilter = [];
    newFilter.push(oldFilter[0]);
    let floorFound = false;
    oldFilter.slice(1).forEach((part) => {
      if (typeof part === 'string' && this._isFloorFilter(part)) {
        // "floor" in "rokas_indoor" and "geojson_walk" layers
        floorFound = true;
        newFilter.push(part);
      } else if (Array.isArray(part)) {
        let levelFound = false;
        const newInnerPart = [part[0]];
        part.slice(1).forEach((innerPart: any) => {
          const innerPartString = JSON.stringify(innerPart);
          if (this._isCaseLvlFilter(innerPartString)) {
            levelFound = true;
            newInnerPart.push(innerPart);
          } else if (this._isFloorFilter(innerPartString)) {
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
    return newFilter as FilterSpecification;
  }

  private _isCaseLvlFilter(innerPartString: string): boolean {
    return innerPartString.startsWith('["case",["has","level"],["get","level"]');
  }

  private _isFloorFilter(innerPartString: string): boolean {
    return innerPartString.indexOf('floor') !== -1;
  }

  collectLvlLayers(): void {
    this._knownLvlLayerIds = [];

    this._map.getStyle().layers?.forEach((layer) => {
      if (
        this._knownLayerTypes.includes(layer.type) &&
        (layer.id.endsWith('-lvl') ||
          layer.id.startsWith('rokas_indoor') ||
          layer.id.startsWith('geojson_walk') ||
          layer.id.startsWith('rokas-walk'))
      ) {
        this._knownLvlLayerIds.push(layer.id);
      }
    });
  }

  private _setLayerVisibility(layerIdPrefix: string, show: boolean): void {
    this._map.getStyle().layers?.forEach((layer) => {
      if (layer.id.startsWith(layerIdPrefix)) {
        try {
          (this._map.getLayer(layer.id) as any).visibility = show ? 'visible' : 'none';
        } catch (e) {
          console.error('Failed to set layer visibility', layer.id, e);
        }
      }
    });
  }
}
