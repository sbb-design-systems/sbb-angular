import { Injectable } from '@angular/core';
import { FeatureCollection, Geometry, Point } from 'geojson';
import { FlyToOptions, LngLat, LngLatLike, Map as MaplibreMap } from 'maplibre-gl';

import { SbbViewportDimensions } from '../../journey-maps.interfaces';
import { isSbbMapCenterOptions } from '../../util/typeguard';

import { toFeatureCollection } from './util/feature-collection-util';

export const SBB_EMPTY_FEATURE_COLLECTION: FeatureCollection = toFeatureCollection([]);

@Injectable({ providedIn: 'root' })
export class SbbMapService {
  moveMap(map: MaplibreMap, viewportDimensions: SbbViewportDimensions): void {
    if (isSbbMapCenterOptions(viewportDimensions)) {
      this._centerMap(map, viewportDimensions.mapCenter, viewportDimensions.zoomLevel);
    } else {
      map.fitBounds(viewportDimensions.boundingBox, { padding: viewportDimensions.padding });
    }
  }

  /**
   * Emulate moving the map with the keyboard's arrow keys
   */
  pan(map: MaplibreMap, dir: SbbDirection): void {
    const directionMap = { west: [1, 0], east: [-1, 0], north: [0, 1], south: [0, -1] };
    const [xDir, yDir] = directionMap[dir];

    // same default values as KeyboardHandler.keydown() in mapbox's keyboard.js
    const panStep = 100; // pixels
    const duration = 300; // pixels

    map.panBy([-xDir * panStep, -yDir * panStep], { duration });
  }

  convertToLngLatLike(geometry: Geometry): LngLatLike {
    return (geometry as Point).coordinates as LngLatLike;
  }

  addMissingImage(map: MaplibreMap, name: string, icon: string): void {
    map
      .loadImage(icon)
      .then(({ data: image }) => {
        map.addImage(name, image, { pixelRatio: 2 });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  verifySources(map: MaplibreMap, sourceIds: string[]): void {
    for (const id of sourceIds) {
      const source = map.getSource(id);
      if (!source) {
        throw new Error(`${source} was not found in style definition!`);
      }
    }
  }

  private _centerMap(
    map: MaplibreMap,
    center: LngLatLike | undefined,
    zoomLevel: number | undefined,
  ): void {
    const options: FlyToOptions = {};
    if (zoomLevel && map.getZoom() !== zoomLevel) {
      options.zoom = zoomLevel;
    }
    if (center) {
      const oldCenter = map.getCenter();
      const newCenter = LngLat.convert(center);
      const distance = oldCenter.distanceTo(newCenter);
      if (distance > 1) {
        options.center = newCenter;
      }
    }
    if (Object.keys(options).length) {
      map.flyTo(options);
    }
  }
}

type SbbDirection = 'north' | 'east' | 'south' | 'west';
