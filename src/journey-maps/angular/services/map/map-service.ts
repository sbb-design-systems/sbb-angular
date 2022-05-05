import { Injectable } from '@angular/core';
import { Geometry, Point } from 'geojson';
import {
  FlyToOptions,
  LngLat,
  LngLatBoundsLike,
  LngLatLike,
  Map as MaplibreMap,
} from 'maplibre-gl';

import { SbbPointsOfInterestOptions } from '../../journey-maps.interfaces';
import { SBB_POI_LAYER } from '../constants';

export const SBB_EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

@Injectable({ providedIn: 'root' })
export class SbbMapService {
  moveMap(
    map: MaplibreMap,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number,
    zoomLevel?: number,
    center?: LngLatLike
  ): void {
    if (zoomLevel || center) {
      this._centerMap(map, center, zoomLevel);
    } else if (boundingBox) {
      map.fitBounds(boundingBox, { padding: boundingBoxPadding });
    }
  }

  /**
   * Emulate moving the map with the keyboard's arrow keys
   */
  pan(map: MaplibreMap, dir: SbbDirection): void {
    const xDir = dir === 'west' ? 1 : dir === 'east' ? -1 : 0;
    const yDir = dir === 'north' ? 1 : dir === 'south' ? -1 : 0;

    // same default values as KeyboardHandler.keydown() in mapbox's keyboard.js
    const panStep = 100; // pixels
    const duration = 300; // pixels

    map.panBy([-xDir * panStep, -yDir * panStep], { duration });
  }

  convertToLngLatLike(geometry: Geometry): LngLatLike {
    return (geometry as Point).coordinates as LngLatLike;
  }

  addMissingImage(map: MaplibreMap, name: string, icon: string): void {
    map.loadImage(icon, (error: any, image: any) =>
      this._imageLoadedCallback(map, name, error, image)
    );
  }

  verifySources(map: MaplibreMap, sourceIds: string[]): void {
    for (const id of sourceIds) {
      const source = map.getSource(id);
      if (!source) {
        throw new Error(`${source} was not found in style definition!`);
      }
    }
  }

  updatePoiVisibility(map: MaplibreMap, poiOptions?: SbbPointsOfInterestOptions) {
    const sbbPoisLayerList = [SBB_POI_LAYER, 'journey-pois-hover', 'journey-pois-selected'];

    const hasAnyPois = poiOptions?.categories?.length;
    if (hasAnyPois) {
      sbbPoisLayerList.forEach((layerId) => {
        map.setFilter(layerId, ['in', 'subCategory', ...poiOptions.categories]);
      });
    }

    sbbPoisLayerList.forEach((layerId) => {
      map.setLayoutProperty(layerId, 'visibility', hasAnyPois ? 'visible' : 'none');
    });
  }

  private _imageLoadedCallback(map: MaplibreMap, name: string, error: any, image: any): void {
    if (error) {
      console.error(error);
    } else {
      map.addImage(name, image, { pixelRatio: 2 });
    }
  }

  private _centerMap(
    map: MaplibreMap,
    center: LngLatLike | undefined,
    zoomLevel: number | undefined
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
