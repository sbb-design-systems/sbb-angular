import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SBB_BOUNDING_BOX,
  SBB_DEFAULT_MAP_CENTER,
  SBB_DEFAULT_ZOOM,
  SBB_MAX_ZOOM,
  SBB_MIN_ZOOM,
} from '@sbb-esta/journey-maps/angular/services/constants';
import {
  LngLatBoundsLike,
  LngLatLike,
  Map as MaplibreMap,
  MapboxOptions,
  Style,
} from 'maplibre-gl';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SbbMultiTouchSupport } from '../multiTouchSupport';

@Injectable({
  providedIn: 'root',
})
export class SbbMapInitService {
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
    maplibreMap.keyboard.disableRotation();
    maplibreMap.touchZoomRotate.disableRotation();

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
      minZoom: SBB_MIN_ZOOM,
      maxZoom: SBB_MAX_ZOOM,
      scrollZoom,
      dragRotate: false,
      touchPitch: false,
      fadeDuration: 10,
    };

    if (zoomLevel || mapCenter) {
      options.zoom = zoomLevel ?? SBB_DEFAULT_ZOOM;
      options.center = mapCenter ?? SBB_DEFAULT_MAP_CENTER;
    } else if (boundingBox) {
      options.bounds = boundingBox;
      options.fitBoundsOptions = { padding: boundingBoxPadding };
    } else {
      options.bounds = SBB_BOUNDING_BOX;
    }

    return options;
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
