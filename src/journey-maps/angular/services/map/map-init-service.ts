import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LngLatBounds,
  LngLatBoundsLike,
  LngLatLike,
  Map as MaplibreMap,
  MapboxOptions,
  Style,
} from 'maplibre-gl';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SbbInteractionOptions, SbbViewportOptions } from '../../journey-maps.interfaces';
import { SBB_MARKER_BOUNDS_PADDING } from '../constants';
import { SbbMultiTouchSupport } from '../multiTouchSupport';

@Injectable({
  providedIn: 'root',
})
export class SbbMapInitService {
  private readonly _defaultZoom = 7.5;
  private readonly _defaultMapCenter: LngLatLike = [7.299265, 47.07212];
  private readonly _defaultBoundingBox: LngLatBoundsLike = [
    [5.7349, 47.9163],
    [10.6677, 45.6755],
  ]; // CH bounds;
  private readonly _controlLabels: any = {
    de: {
      'NavigationControl.ZoomIn': 'Hineinzoomen',
      'NavigationControl.ZoomOut': 'Rauszoomen',
    },
    fr: {
      'NavigationControl.ZoomIn': 'Zoom avant',
      'NavigationControl.ZoomOut': 'Dézoomer',
    },
    it: {
      'NavigationControl.ZoomIn': 'Ingrandire',
      'NavigationControl.ZoomOut': 'Rimpicciolire',
    },
    en: {
      'NavigationControl.ZoomIn': 'Zoom in',
      'NavigationControl.ZoomOut': 'Zoom out',
    },
  };

  constructor(private _http: HttpClient) {}

  initializeMap(
    mapNativeElement: HTMLElement,
    language: string,
    styleUrl: string,
    interactionOptions: SbbInteractionOptions,
    viewportOptions: SbbViewportOptions,
    markerBounds?: LngLatBounds
  ): Observable<MaplibreMap> {
    const maplibreMap = new MaplibreMap(
      this._createOptions(mapNativeElement, interactionOptions, viewportOptions, markerBounds)
    );

    this._translateControlLabels(maplibreMap, language);
    this._addControls(maplibreMap, interactionOptions.oneFingerPan);

    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    maplibreMap.dragRotate.disable();
    maplibreMap.touchPitch.disable();

    return this.fetchStyle(styleUrl).pipe(
      tap((style) => maplibreMap.setStyle(style)),
      map(() => maplibreMap)
    );
  }

  private _createOptions(
    container: HTMLElement,
    interactionOptions: SbbInteractionOptions,
    viewportOptions: SbbViewportOptions,
    markerBounds?: LngLatBounds
  ): MapboxOptions {
    const options: MapboxOptions = {
      container,
      minZoom: viewportOptions.minZoomLevel,
      maxZoom: viewportOptions.maxZoomLevel,
      maxBounds: viewportOptions.maxBounds,
      scrollZoom: interactionOptions.scrollZoom,
      dragRotate: false,
      fadeDuration: 10,
    };

    const boundingBox = viewportOptions.boundingBox ?? markerBounds;

    if (viewportOptions.zoomLevel || viewportOptions.mapCenter) {
      options.zoom = viewportOptions.zoomLevel ?? this._defaultZoom;
      options.center = viewportOptions.mapCenter ?? this._defaultMapCenter;
    } else if (boundingBox) {
      options.bounds = boundingBox;
      options.fitBoundsOptions = {
        padding: viewportOptions.boundingBox
          ? viewportOptions.boundingBoxPadding
          : SBB_MARKER_BOUNDS_PADDING,
      };
    } else {
      options.bounds = this._defaultBoundingBox;
    }

    return options;
  }

  getDefaultBoundingBox() {
    return this._defaultBoundingBox;
  }

  fetchStyle(styleUrl: string): Observable<Style> {
    return this._http.get(styleUrl).pipe(map((style) => style as Style));
  }

  private _translateControlLabels(maplibreMap: MaplibreMap, language: string): void {
    (maplibreMap as any)._locale = Object.assign(
      {},
      (maplibreMap as any)._locale,
      this._controlLabels[language]
    );
  }

  private _addControls(maplibreMap: MaplibreMap, oneFingerPan?: boolean): void {
    if (!oneFingerPan) {
      maplibreMap.addControl(new SbbMultiTouchSupport());
    }
  }
}
