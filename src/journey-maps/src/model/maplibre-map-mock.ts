import {Map as MapLibreMap} from 'maplibre-gl';

interface EventInfo {
  _layerId: string,
  callbackFn: any
}

export class MaplibreMapMock {
  private readonly callbackFnCache = new Map<String, EventInfo[] | any[]>();
  private readonly canvasStyle = {style: {cursor: ''}};

  get(): MapLibreMap {
    return this as unknown as MapLibreMap;
  }

  /* Public MaplibreMap functions */

  /**
   * on-function mock. Use raise(eventName) to simulate an event.
   */
  on(eventName, ...args) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      this.callbackFnCache.set(eventName, []);
      callbackList = this.callbackFnCache.get(eventName);
    }

    if (args.length > 1) {
      // layerId and
      callbackList.push({_layerId: args[0], callbackFn: args[1]});
    } else {
      callbackList.push(args[0]);
    }
  }

  off(eventName, ...args) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      return;
    }

    let idx: number;
    if (args.length > 1) {
      // layerId and
      idx = callbackList.findIndex(item => item._layerId === args[0] && item.callbackFn === args[1]);
    } else {
      idx = callbackList.findIndex(item => item === args[0]);
    }

    if (idx >= 0) {
      callbackList.splice(idx, 1);
    }
  }

  getCanvas = () => this.canvasStyle;

  getFeatureState = () => new Object();

  setFeatureState = () => void (0);

  /* End of any Public MaplibreMap functions */

  raise(eventName: string) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      throw new Error(`Event ${eventName} was not registered.`);
    }
    for (let callback of callbackList) {
      if (callback._layerId) {
        const info = callback as EventInfo;
        MaplibreMapMock.callbackWithEventArgs(eventName, info.callbackFn);
      } else {
        MaplibreMapMock.callbackWithEventArgs(eventName, callback);
      }
    }
  }

  private static callbackWithEventArgs(eventName: string, callback: any) {
    switch (eventName) {
      case 'mousemove':
      case 'click': {
        callback({
          point: {x: 150, y: 100},
          lngLat: {lng: 7.265078, lat: 46.565312}
        });
        break;
      }
      default:
        callback();
        break;
    }
  }
}
