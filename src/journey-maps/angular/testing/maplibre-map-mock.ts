import type PointType from '@mapbox/point-geometry';
import { Map as MapLibreMap, MapGeoJSONFeature, Point, PointLike } from 'maplibre-gl';

interface EventInfo {
  _layerId: string;
  callbackFn: any;
}

export class SbbMaplibreMapMock {
  static readonly EVENT_POINT: PointType = new Point(150, 100);

  private readonly _callbackFnCache = new Map<String, EventInfo[] | any[]>();
  private readonly _canvasStyle = { style: { cursor: '' } };

  private readonly _featureData = new Map<
    string,
    { layers: string[]; features: MapGeoJSONFeature[] }
  >();

  get(): MapLibreMap {
    return this as unknown as MapLibreMap;
  }

  /* Public MaplibreMap functions */

  /**
   * on-function mock. Use raise(eventName) to simulate an event.
   */
  on(eventName: string | String, ...args: any[]) {
    let callbackList = this._callbackFnCache.get(eventName);
    if (!callbackList) {
      this._callbackFnCache.set(eventName, []);
      callbackList = this._callbackFnCache.get(eventName);
    }

    if (args.length > 1) {
      // layerId and
      callbackList?.push({ _layerId: String(args[0]), callbackFn: args[1] } as EventInfo);
    } else {
      callbackList?.push(args[0] as EventInfo);
    }
  }

  off(eventName: String, ...args: any[]) {
    const callbackList = this._callbackFnCache.get(eventName);
    if (!callbackList) {
      return;
    }

    let idx: number;
    if (args.length > 1) {
      // layerId and
      idx = callbackList.findIndex(
        (item) => item._layerId === args[0] && item.callbackFn === args[1],
      );
    } else {
      idx = callbackList.findIndex((item) => item === args[0]);
    }

    if (idx >= 0) {
      callbackList.splice(idx, 1);
    }
  }

  getCanvas = () => this._canvasStyle;

  getFeatureState = () => new Object();

  setFeatureState = () => void 0;

  queryRenderedFeatures(
    point: PointLike,
    options?: { layers?: string[] },
  ): MapGeoJSONFeature[] | null {
    const data = this._featureData.get(SbbMaplibreMapMock._stringify(point));
    if (
      data &&
      (!options?.layers?.length || data.layers.some((l) => options.layers?.includes(l)))
    ) {
      return data.features;
    }

    return null;
  }

  /* End of any Public MaplibreMap functions */

  raise(eventName: string) {
    const callbackList = this._callbackFnCache.get(eventName);
    if (!callbackList) {
      throw new Error(`Event ${eventName} was not registered.`);
    }
    for (const callback of callbackList) {
      if (callback._layerId) {
        const info = callback as EventInfo;
        SbbMaplibreMapMock._callbackWithEventArgs(eventName, info.callbackFn);
      } else {
        SbbMaplibreMapMock._callbackWithEventArgs(eventName, callback);
      }
    }
  }

  addFeatureData(point: PointLike, layers: string[], features: MapGeoJSONFeature[]) {
    this._featureData.set(SbbMaplibreMapMock._stringify(point), { layers, features });
  }

  private static _callbackWithEventArgs(eventName: string, callback: any) {
    switch (eventName) {
      case 'mousemove':
      case 'mouseenter':
      case 'mouseleave':
      case 'click': {
        callback({
          point: SbbMaplibreMapMock.EVENT_POINT,
          lngLat: { lng: 7.265078, lat: 46.565312 },
        });
        break;
      }
      default:
        callback();
        break;
    }
  }

  private static _stringify(point: PointLike): string {
    return Array.isArray(point) ? JSON.stringify(point) : JSON.stringify([point.x, point.y]);
  }
}
