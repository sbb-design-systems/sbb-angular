import type Point from '@mapbox/point-geometry';
import { Map as MaplibreMap, MapMouseEvent } from 'maplibre-gl';
import { Subject, Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

const SBB_CURSOR_STYLE_DELAY = 25;

export class SbbMapCursorStyleEvent {
  private _subject = new Subject<Point>();
  private _subscription: Subscription;
  private _mouseEventListener: (event: MapMouseEvent) => void;

  constructor(private _mapInstance: MaplibreMap, private _layerIds: string[]) {
    if (!this._layerIds.length) {
      return;
    }

    this._subscription = this._subject
      .pipe(sampleTime(SBB_CURSOR_STYLE_DELAY))
      .subscribe((point) => this._updateCursorStyle(point));

    this._mouseEventListener = (e: MapMouseEvent) => this._subject.next(e.point.clone());

    this._layerIds.forEach((layerId) => {
      this._mapInstance.on('mouseenter', layerId, this._mouseEventListener);
      this._mapInstance.on('mouseleave', layerId, this._mouseEventListener);
    });
  }

  complete(): void {
    this._subject.complete();
    this._subscription?.unsubscribe();

    this._layerIds.forEach((layerId) => {
      this._mapInstance.off('mouseenter', layerId, this._mouseEventListener);
      this._mapInstance.off('mouseleave', layerId, this._mouseEventListener);
    });
  }

  private _updateCursorStyle(point: Point): void {
    const features = this._mapInstance.queryRenderedFeatures(point, { layers: this._layerIds });
    const hover = features?.length;

    this._mapInstance.getCanvas().style.cursor = hover ? 'pointer' : '';
  }
}
