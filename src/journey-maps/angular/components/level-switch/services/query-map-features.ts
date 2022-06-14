import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class SbbQueryMapFeatures {
  static readonly SERVICE_POINT_SOURCE_ID = 'service_points';
  private readonly _levelsFeaturePropertyName = 'floor_liststring';

  getVisibleLevels(map: MaplibreMap): number[] {
    const mapSources = map.getStyle().sources;
    if (!mapSources || !mapSources[SbbQueryMapFeatures.SERVICE_POINT_SOURCE_ID]) {
      console.error(
        `source '${SbbQueryMapFeatures.SERVICE_POINT_SOURCE_ID}' not found in map style.`
      );
      return [];
    }
    const servicePoints = map.querySourceFeatures(SbbQueryMapFeatures.SERVICE_POINT_SOURCE_ID);
    // merge levels, when multiple stations found:
    const allLevels = servicePoints.map((servicePoint) =>
      this._extractLevels(servicePoint.properties)
    );

    // Seems like a king of bug in javascript. Even if it's a list of numbers,
    // the default sort doesn't work as expected and an arrow fn must be provided.
    // Check the unit test 'getVisibleLevels should merge level lists if multiple features were found'.
    return this._flatten(allLevels).sort((a, b) => b - a);
  }

  private _extractLevels(properties: any): number[] {
    if (!!properties && !!properties[this._levelsFeaturePropertyName]) {
      return properties[this._levelsFeaturePropertyName]
        .split(',')
        .map((level: string) => Number(level));
    } else {
      return [];
    }
  }

  private _flatten(arrayOfArrays: any): number[] {
    return Array.from(new Set<number>([].concat(...arrayOfArrays)));
  }
}
