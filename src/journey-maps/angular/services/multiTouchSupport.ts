import { Map as MaplibreMap } from 'maplibre-gl';

// https://www.npmjs.com/package/mapbox-gl-multitouch
// https://github.com/mapbox/mapbox-gl-js/issues/2618
// https://github.com/Pitbi/mapbox-gl-multitouch
export class SbbMultiTouchSupport {
  private _state = { panStart: { x: 0, y: 0 }, distanceStart: 0 };
  private _map: MaplibreMap | undefined;
  private _container: HTMLDivElement | undefined;
  private _touchZoomFactor = 0.2; // zoom sensibility
  private _touchZoomThreshold = 0.01; // zoom activation

  constructor() {
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
  }

  touchStart(event: TouchEvent): void {
    if (event.touches.length !== 2) {
      return;
    }

    let x = 0;
    let y = 0;

    [].forEach.call(event.touches, (touch: Touch) => {
      x += touch.screenX;
      y += touch.screenY;
    });

    this._state.distanceStart = this.distance(event.touches[0], event.touches[1]);

    this._state.panStart.x = x / event.touches.length;
    this._state.panStart.y = y / event.touches.length;
  }

  touchMove(event: TouchEvent): void {
    if (event.touches.length !== 2) {
      return;
    }

    this._handleTouchPan(event);
    this._handleTouchZoom(event);
  }

  private _handleTouchZoom(event: TouchEvent): void {
    const lastDistance = this._state.distanceStart;
    const actualDistance = this.distance(event.touches[0], event.touches[1]);
    this._state.distanceStart = actualDistance;

    let distanceRatio = actualDistance / lastDistance;
    distanceRatio = Math.min(Math.max(distanceRatio, 0.000001), 1.999999); // keep ratio in ]0;2[

    if (distanceRatio > 1 + this._touchZoomThreshold) {
      // zoom in
      distanceRatio = (distanceRatio - 1) * this._touchZoomFactor + 1;
    } else if (distanceRatio < 1 - this._touchZoomThreshold) {
      // zoom out
      distanceRatio = 1 - (1 - distanceRatio) * this._touchZoomFactor;
    } else {
      // no zoom
      distanceRatio = 1;
    }

    this._map?.setZoom(this._map.getZoom() * distanceRatio);
  }

  private _handleTouchPan(event: TouchEvent): void {
    let x = 0;
    let y = 0;

    [].forEach.call(event.touches, (touch: Touch) => {
      x += touch.screenX;
      y += touch.screenY;
    });

    const movex = x / event.touches.length - this._state.panStart.x;
    const movey = y / event.touches.length - this._state.panStart.y;

    this._state.panStart.x = x / event.touches.length;
    this._state.panStart.y = y / event.touches.length;

    this._map?.panBy([movex / -1, movey / -1], { animate: false });
  }

  onAdd(map: MaplibreMap): HTMLDivElement {
    this._map = map;
    this._container = document.createElement('div');
    this._map.getContainer().addEventListener('touchstart', this.touchStart, false);
    this._map.getContainer().addEventListener('touchmove', this.touchMove, false);
    return this._container;
  }

  onRemove(): void {
    this._map?.getContainer().removeEventListener('touchstart', this.touchStart);
    this._map?.getContainer().removeEventListener('touchmove', this.touchMove);
    this._map = undefined;
  }

  distance(pointOne: Touch, pointTwo: Touch): number {
    const x1 = pointOne.screenX;
    const y1 = pointOne.screenY;
    const x2 = pointTwo.screenX;
    const y2 = pointTwo.screenY;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  midpoint(pointOne: Touch, pointTwo: Touch): number[] {
    const x1 = pointOne.screenX;
    const y1 = pointOne.screenY;
    const x2 = pointTwo.screenX;
    const y2 = pointTwo.screenY;
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  }
}
