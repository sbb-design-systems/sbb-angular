import {Map as MaplibreMap} from 'maplibre-gl';

// https://www.npmjs.com/package/mapbox-gl-multitouch
// https://github.com/mapbox/mapbox-gl-js/issues/2618
// https://github.com/Pitbi/mapbox-gl-multitouch
export class MultiTouchSupport {

  private state: any;
  private map: MaplibreMap;
  private container: any;
  private TOUCH_ZOOM_FACTOR = 0.2; // zoom sensibility
  private TOUCH_ZOOM_THRESHOLD = 0.01; // zoom activation

  constructor() {
    this.state = {
      panStart: { x: 0, y: 0 },
      distanceStart: 0,
    };
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
  }

  touchStart(event): void {
    if (event.touches.length !== 2) { return; }

    let x = 0;
    let y = 0;

    [].forEach.call(event.touches, (touch) => {
      x += touch.screenX;
      y += touch.screenY;
    });

    this.state.distanceStart = this.distance(event.touches[0], event.touches[1]);

    this.state.panStart.x = x / event.touches.length;
    this.state.panStart.y = y / event.touches.length;
  }

  touchMove(event): void {
    if (event.touches.length !== 2) { return; }

    this.handleTouchPan(event);
    this.handleTouchZoom(event);
  }

  private handleTouchZoom(event): void {
    const lastDistance = this.state.distanceStart;
    const actualDistance = this.distance(event.touches[0], event.touches[1]);
    this.state.distanceStart = actualDistance;

    let distanceRatio = actualDistance / lastDistance;
    distanceRatio = Math.min(Math.max(distanceRatio, 0.000001), 1.999999); // keep ratio in ]0;2[

    if (distanceRatio > 1 + this.TOUCH_ZOOM_THRESHOLD) { // zoom in
      distanceRatio = ((distanceRatio - 1) * this.TOUCH_ZOOM_FACTOR) + 1;
    } else if (distanceRatio < 1 - this.TOUCH_ZOOM_THRESHOLD) { // zoom out
      distanceRatio = 1 - ((1 - distanceRatio) * this.TOUCH_ZOOM_FACTOR);
    } else { // no zoom
      distanceRatio = 1;
    }

    this.map.setZoom(this.map.getZoom() * distanceRatio);
  }

  private handleTouchPan(event): void {
    let x = 0;
    let y = 0;

    [].forEach.call(event.touches, (touch) => {
      x += touch.screenX;
      y += touch.screenY;
    });

    const movex = (x / event.touches.length) - this.state.panStart.x;
    const movey = (y / event.touches.length) - this.state.panStart.y;

    this.state.panStart.x = x / event.touches.length;
    this.state.panStart.y = y / event.touches.length;

    this.map.panBy([movex / -1, movey / -1], {animate: false});
  }

  onAdd(map): HTMLDivElement {
    this.map = map;
    this.container = document.createElement('div');
    this.map.getContainer().addEventListener('touchstart', this.touchStart, false);
    this.map.getContainer().addEventListener('touchmove', this.touchMove, false);
    return this.container;
  }

  onRemove(): void {
    this.map.getContainer().removeEventListener('touchstart', this.touchStart);
    this.map.getContainer().removeEventListener('touchmove', this.touchMove);
    this.map = undefined;
  }

  distance(pointOne, pointTwo): number {
    const x1 = pointOne.screenX;
    const y1 = pointOne.screenY;
    const x2 = pointTwo.screenX;
    const y2 = pointTwo.screenY;
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) );
  }

  midpoint(pointOne, pointTwo): number[] {
    const x1 = pointOne.screenX;
    const y1 = pointOne.screenY;
    const x2 = pointTwo.screenX;
    const y2 = pointTwo.screenY;
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  }
}
