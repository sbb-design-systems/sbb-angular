import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LngLatBounds,
  Map as MaplibreMap,
  MapOptions,
  StyleSpecification,
  VectorTileSource,
} from 'maplibre-gl';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  SbbInteractionOptions,
  SbbPointsOfInterestEnvironmentType,
  SbbViewportBounds,
  SbbViewportDimensions,
} from '../../journey-maps.interfaces';
import { isSbbBoundingBoxOptions, isSbbMapCenterOptions } from '../../util/typeguard';
import { SBB_BOUNDING_BOX } from '../constants';
import { SBB_MARKER_BOUNDS_PADDING, SBB_MAX_ZOOM, SBB_MIN_ZOOM } from '../constants';
import { SbbMultiTouchSupport } from '../multiTouchSupport';

import { SbbMapUrlService } from './map-url-service';

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

  constructor(private _http: HttpClient, private _urlService: SbbMapUrlService) {}

  initializeMap(
    mapNativeElement: HTMLElement,
    language: string,
    styleUrl: string,
    interactionOptions: SbbInteractionOptions,
    viewportDimensions?: SbbViewportDimensions,
    viewportBounds?: SbbViewportBounds,
    markerBounds?: LngLatBounds,
    poiEnvironment?: SbbPointsOfInterestEnvironmentType
  ): Observable<MaplibreMap> {
    return this.fetchStyle(styleUrl, poiEnvironment).pipe(
      map((style) =>
        this._createMap(
          style,
          mapNativeElement,
          interactionOptions,
          language,
          viewportDimensions,
          viewportBounds,
          markerBounds
        )
      )
    );
  }

  private _createMap(
    style: StyleSpecification,
    mapNativeElement: HTMLElement,
    interactionOptions: SbbInteractionOptions,
    language: string,
    viewportDimensions?: SbbViewportDimensions,
    viewportBounds?: SbbViewportBounds,
    markerBounds?: LngLatBounds
  ): MaplibreMap {
    const maplibreMap = new MaplibreMap(
      this._createOptions(
        style,
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

    return maplibreMap;
  }

  private _createOptions(
    style: StyleSpecification,
    container: HTMLElement,
    interactionOptions: SbbInteractionOptions,
    viewportDimensions?: SbbViewportDimensions,
    viewportBounds?: SbbViewportBounds,
    markerBounds?: LngLatBounds
  ): MapOptions {
    const options: MapOptions = {
      style,
      container,
      minZoom: viewportBounds?.minZoomLevel ?? SBB_MIN_ZOOM,
      maxZoom: viewportBounds?.maxZoomLevel ?? SBB_MAX_ZOOM,
      maxBounds: viewportBounds?.maxBounds,
      scrollZoom: interactionOptions.scrollZoom,
      dragRotate: false,
      touchPitch: false,
      fadeDuration: 10,
      interactive: !interactionOptions.disableInteractions,
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

  fetchStyle(
    styleUrl: string,
    poiEnvironment?: SbbPointsOfInterestEnvironmentType
  ): Observable<StyleSpecification> {
    return this._http.get(styleUrl).pipe(
      map((fetchedStyle) => {
        const style = fetchedStyle as StyleSpecification;

        // Set POI-Source-URL
        const poiSource = style.sources['journey-pois-source'] as VectorTileSource;
        poiSource.url = this._urlService.getPoiSourceUrlByEnvironment(
          poiSource.url,
          poiEnvironment
        );

        return style;
      })
    );
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
