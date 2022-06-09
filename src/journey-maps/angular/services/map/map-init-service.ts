import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LngLatBounds, Map as MaplibreMap, MapboxOptions, Style } from 'maplibre-gl';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  SbbInteractionOptions,
  SbbViewportBounds,
  SbbViewportDimensions,
} from '../../journey-maps.interfaces';
import { isSbbBoundingBoxOptions, isSbbMapCenterOptions } from '../../util/typeguard';
import { SBB_BOUNDING_BOX } from '../constants';
import { SBB_MARKER_BOUNDS_PADDING, SBB_MAX_ZOOM, SBB_MIN_ZOOM } from '../constants';
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
    mapNativeElement: HTMLElement,
    language: string,
    styleUrl: string,
    interactionOptions: SbbInteractionOptions,
    viewportDimensions?: SbbViewportDimensions,
    viewportBounds?: SbbViewportBounds,
    markerBounds?: LngLatBounds
  ): Observable<MaplibreMap> {
    const maplibreMap = new MaplibreMap(
      this._createOptions(
        mapNativeElement,
        interactionOptions,
        viewportDimensions,
        viewportBounds,
        markerBounds
      )
    );

    this._translateControlLabels(maplibreMap, language);
    this._addControls(maplibreMap, interactionOptions.oneFingerPan);

    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    maplibreMap.keyboard.disableRotation();
    maplibreMap.touchZoomRotate.disableRotation();

    return this.fetchStyle(styleUrl).pipe(
      tap((style) => maplibreMap.setStyle(style)),
      map(() => maplibreMap)
    );
  }

  private _createOptions(
    container: HTMLElement,
    interactionOptions: SbbInteractionOptions,
    viewportDimensions?: SbbViewportDimensions,
    viewportBounds?: SbbViewportBounds,
    markerBounds?: LngLatBounds
  ): MapboxOptions {
    const options: MapboxOptions = {
      container,
      minZoom: viewportBounds?.minZoomLevel ?? SBB_MIN_ZOOM,
      maxZoom: viewportBounds?.maxZoomLevel ?? SBB_MAX_ZOOM,
      maxBounds: viewportBounds?.maxBounds,
      scrollZoom: interactionOptions.scrollZoom,
      dragRotate: false,
      touchPitch: false,
      fadeDuration: 10,
    };

    if (isSbbMapCenterOptions(viewportDimensions)) {
      options.center = viewportDimensions.mapCenter;
      options.zoom = viewportDimensions.zoomLevel;
    } else {
      let bounds, padding;
      if (isSbbBoundingBoxOptions(viewportDimensions)) {
        bounds = viewportDimensions.boundingBox;
        padding = viewportDimensions.padding;
      } else if (markerBounds) {
        bounds = markerBounds;
        padding = SBB_MARKER_BOUNDS_PADDING;
      } else {
        bounds = SBB_BOUNDING_BOX;
        padding = 0;
      }
      options.bounds = bounds;
      options.fitBoundsOptions = {
        padding,
      };
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
