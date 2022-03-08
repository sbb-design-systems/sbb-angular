import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LngLatBoundsLike,
  LngLatLike,
  Map as MaplibreMap,
  MapboxOptions,
  Style,
} from 'maplibre-gl';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { MultiTouchSupport } from '../multiTouchSupport';

@Injectable({
  providedIn: 'root',
})
export class MapInitService {
  public static minZoom: number = 1;
  public static maxZoom: number = 23; /* same as in mobile-clients */

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
    mapNativeElement: any,
    language: string,
    styleUrl: string,
    scrollZoom: boolean,
    zoomLevel?: number,
    mapCenter?: LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number,
    oneFingerPan?: boolean
  ): Observable<MaplibreMap> {
    const maplibreMap = new MaplibreMap(
      this._createOptions(
        mapNativeElement,
        scrollZoom,
        zoomLevel,
        mapCenter,
        boundingBox,
        boundingBoxPadding
      )
    );

    this._translateControlLabels(maplibreMap, language);
    this._addControls(maplibreMap, oneFingerPan);

    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    maplibreMap.dragRotate.disable();
    maplibreMap.touchPitch.disable();

    return this.fetchStyle(styleUrl).pipe(
      tap((style) => maplibreMap.setStyle(style)),
      map(() => maplibreMap)
    );
  }

  private _createOptions(
    container: any,
    scrollZoom: boolean,
    zoomLevel?: number,
    mapCenter?: LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number
  ): MapboxOptions {
    const options: MapboxOptions = {
      container,
      minZoom: MapInitService.minZoom,
      maxZoom: MapInitService.maxZoom,
      scrollZoom,
      dragRotate: false,
      fadeDuration: 10,
    };

    if (zoomLevel || mapCenter) {
      options.zoom = zoomLevel ?? this._defaultZoom;
      options.center = mapCenter ?? this._defaultMapCenter;
    } else if (boundingBox) {
      options.bounds = boundingBox;
      options.fitBoundsOptions = { padding: boundingBoxPadding };
    } else {
      options.bounds = this._defaultBoundingBox;
    }

    return options;
  }

  public getDefaultBoundingBox() {
    return this._defaultBoundingBox;
  }

  public fetchStyle(styleUrl: string): Observable<Style> {
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
      maplibreMap.addControl(new MultiTouchSupport());
    }
  }
}
