import {Injectable} from '@angular/core';
import {Map as MaplibreMap} from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class QueryMapFeaturesService {
  static readonly SERVICE_POINT_SOURCE_ID = 'service_points';
  private readonly levelsFeaturePropertyName = 'floor_liststring';

  getVisibleLevels(map: MaplibreMap): number[] {
    if (!map.getStyle().sources[QueryMapFeaturesService.SERVICE_POINT_SOURCE_ID]) {
      console.error(`source '${QueryMapFeaturesService.SERVICE_POINT_SOURCE_ID}' not found in map style.`);
      return [];
    }
    const servicePoints = map.querySourceFeatures(QueryMapFeaturesService.SERVICE_POINT_SOURCE_ID);
    // merge levels, when multiple stations found:
    const allLevels = servicePoints.map(servicePoint => this.extractLevels(servicePoint.properties));

    // Seems like a king of bug in javascript. Even if it's a list of numbers,
    // the default sort doesn't work as expected and an arrow fn must be provided.
    // Check the unit test 'getVisibleLevels should merge level lists if multiple features were found'.
    return this.flatten(allLevels).sort((a, b) => a - b).reverse();
  }

  private extractLevels(properties: any): number[] {
    if (!!properties && !!properties[this.levelsFeaturePropertyName]) {
      return properties[this.levelsFeaturePropertyName].split(',').map(f => Number(f));
    } else {
      return [];
    }
  }

  private flatten(arrayOfArrays: number[][]): number[] {
    return Array.from(new Set([].concat(...arrayOfArrays)));
  }
}
