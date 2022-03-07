import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LngLatBoundsLike, LngLatLike, Map as MaplibreMap, MapboxOptions, Style} from 'maplibre-gl';
import {map, tap} from 'rxjs/operators';
import {MultiTouchSupport} from '../multiTouchSupport';

@Injectable({
  providedIn: 'root'
})
export class MapInitService {

  public static MIN_ZOOM = 1;
  public static MAX_ZOOM = 23; /* same as in mobile-clients */

  private readonly defaultZoom = 7.5;
  private readonly defaultMapCenter: LngLatLike = [7.299265, 47.072120];
  private readonly defaultBoundingBox: LngLatBoundsLike = [[5.7349, 47.9163], [10.6677, 45.6755]]; // CH bounds;
  private readonly controlLabels = {
    de: {
      'NavigationControl.ZoomIn': 'Hineinzoomen',
      'NavigationControl.ZoomOut': 'Rauszoomen'
    },
    fr: {
      'NavigationControl.ZoomIn': 'Zoom avant',
      'NavigationControl.ZoomOut': 'Dézoomer'
    },
    it: {
      'NavigationControl.ZoomIn': 'Ingrandire',
      'NavigationControl.ZoomOut': 'Rimpicciolire'
    },
    en: {
      'NavigationControl.ZoomIn': 'Zoom in',
      'NavigationControl.ZoomOut': 'Zoom out'
    }
  };

  constructor(private http: HttpClient) {
  }

  initializeMap(
    mapNativeElement: any,
    language: string,
    styleUrl: string,
    scrollZoom: boolean,
    zoomLevel?: number,
    mapCenter?: LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number,
    oneFingerPan?: boolean,
  ): Observable<MaplibreMap> {
    const maplibreMap = new MaplibreMap(
      this.createOptions(mapNativeElement, scrollZoom, zoomLevel, mapCenter, boundingBox, boundingBoxPadding)
    );

    this.translateControlLabels(maplibreMap, language);
    this.addControls(maplibreMap, oneFingerPan);

    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    maplibreMap.dragRotate.disable();
    maplibreMap.touchPitch.disable();

    return this.fetchStyle(styleUrl).pipe(
      tap(style => maplibreMap.setStyle(style)),
      map(() => maplibreMap)
    );
  }

  private createOptions(
    container: any,
    scrollZoom: boolean,
    zoomLevel?: number,
    mapCenter?: LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number): MapboxOptions {
    const options: MapboxOptions = {
      container,
      minZoom: MapInitService.MIN_ZOOM,
      maxZoom: MapInitService.MAX_ZOOM,
      scrollZoom,
      dragRotate: false,
      fadeDuration: 10
    };

    if (zoomLevel || mapCenter) {
      options.zoom = zoomLevel ?? this.defaultZoom;
      options.center = mapCenter ?? this.defaultMapCenter;
    } else if (boundingBox) {
      options.bounds = boundingBox;
      options.fitBoundsOptions = {padding: boundingBoxPadding};
    } else {
      options.bounds = this.defaultBoundingBox;
    }

    return options;
  }

  public getDefaultBoundingBox() {
    return this.defaultBoundingBox;
  }

  public fetchStyle(styleUrl: string): Observable<Style> {
    return this.http.get(styleUrl).pipe(
      map(style => style as Style)
    );
  }

  private translateControlLabels(maplibreMap: MaplibreMap, language: string): void {
    (maplibreMap as any)._locale = Object.assign(
      {},
      (maplibreMap as any)._locale,
      this.controlLabels[language]
    );
  }

  private addControls(maplibreMap: MaplibreMap, oneFingerPan?: boolean): void {
    if (!oneFingerPan) {
      maplibreMap.addControl(new MultiTouchSupport());
    }
  }
}
