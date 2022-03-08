import { Map as MapLibreMap } from 'maplibre-gl';

interface EventInfo {
  _layerId: string;
  callbackFn: any;
}

export class MaplibreMapMock {
  private readonly _callbackFnCache = new Map<String, EventInfo[] | any[]>();
  private readonly _canvasStyle = { style: { cursor: '' } };

  get(): MapLibreMap {
    return this as unknown as MapLibreMap;
  }

  /* Public MaplibreMap functions */

  /**
   * on-function mock. Use raise(eventName) to simulate an event.
   */
  on(eventName: string | String, ...args: (string | EventInfo)[]) {
    let callbackList = this._callbackFnCache.get(eventName);
    if (!callbackList) {
      this._callbackFnCache.set(eventName, []);
      callbackList = this._callbackFnCache.get(eventName);
    }

    if (args.length > 1) {
      // layerId and
      callbackList?.push({ _layerId: args[0] as string, callbackFn: args[1] });
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
        (item) => item._layerId === args[0] && item.callbackFn === args[1]
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

  /* End of any Public MaplibreMap functions */

  raise(eventName: string) {
    const callbackList = this._callbackFnCache.get(eventName);
    if (!callbackList) {
      throw new Error(`Event ${eventName} was not registered.`);
    }
    for (const callback of callbackList) {
      if (callback._layerId) {
        const info = callback as EventInfo;
        MaplibreMapMock._callbackWithEventArgs(eventName, info.callbackFn);
      } else {
        MaplibreMapMock._callbackWithEventArgs(eventName, callback);
      }
    }
  }

  private static _callbackWithEventArgs(eventName: string, callback: any) {
    switch (eventName) {
      case 'mousemove':
      case 'click': {
        callback({
          point: { x: 150, y: 100 },
          lngLat: { lng: 7.265078, lat: 46.565312 },
        });
        break;
      }
      default:
        callback();
        break;
    }
  }
}
