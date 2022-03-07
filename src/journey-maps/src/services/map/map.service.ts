import {Injectable} from '@angular/core';
import {Geometry, Point} from 'geojson';
import {FlyToOptions, LngLat, LngLatLike, Map as MaplibreMap} from 'maplibre-gl';

export const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: []
};

@Injectable({providedIn: 'root'})
export class MapService {

  moveMap(
    map: maplibregl.Map,
    boundingBox?: maplibregl.LngLatBoundsLike,
    boundingBoxPadding?: number,
    zoomLevel?: number,
    center?: maplibregl.LngLatLike
  ): void {
    if (zoomLevel || center) {
      this.centerMap(map, center, zoomLevel);
    } else if (boundingBox) {
      map.fitBounds(boundingBox, {padding: boundingBoxPadding});
    }
  }

  /**
   * Emulate moving the map with the keyboard's arrow keys
   */
  pan(map: MaplibreMap, dir: Direction): void {
    const {NORTH, EAST, SOUTH, WEST} = Direction;
    const xDir = dir === WEST ? 1 : dir === EAST ? -1 : 0;
    const yDir = dir === NORTH ? 1 : dir === SOUTH ? -1 : 0;

    // same default values as KeyboardHandler.keydown() in mapbox's keyboard.js
    const panStep = 100; // pixels
    const duration = 300; // pixels

    map.panBy(
      [-xDir * panStep, -yDir * panStep],
      {duration}
    );
  }

  convertToLngLatLike(geometry: Geometry): LngLatLike {
    return (geometry as Point).coordinates as LngLatLike;
  }

  addMissingImage(map: MaplibreMap, name: string, icon: string): void {
    map.loadImage(icon, (error, image) => this.imageLoadedCallback(map, name, error, image));
  }

  verifySources(map: MaplibreMap, sourceIds: string[]): void {
    for (const id of sourceIds) {
      const source = map.getSource(id);
      if (!source) {
        throw new Error(`${source} was not found in style definition!`);
      }
    }
  }

  private imageLoadedCallback(map: MaplibreMap, name: string, error: any, image: any): void {
    if (error) {
      console.error(error);
    } else {
      map.addImage(name, image, {pixelRatio: 2});
    }
  }

  private centerMap(map: MaplibreMap, center: LngLatLike, zoomLevel: number): void {
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

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST
}
