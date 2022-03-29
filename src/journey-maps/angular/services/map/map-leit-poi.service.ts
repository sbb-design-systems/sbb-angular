import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LeitPoiFeature } from '../../components/leit-poi/model/leit-poi-feature';
import { MapLeitPoi } from '../../model/map-leit-poi';

import { MapLeitPoiCreatorService } from './map-leit-poi-creator.service';
import { EMPTY_FEATURE_COLLECTION } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class MapLeitPoiService {
  private static readonly _leitPoiPathType = 'leit_poi';
  private static readonly _defaultLevel = 0;
  // check the rokas map style blue-arrow: 16.5 or 15 like LevelSwitch:
  private static readonly _leitPoiMinMapZoom = 15;
  levelSwitched: Subject<number> = new Subject<number>();
  destroyed: Subject<void> = new Subject<void>();

  private _mapZoomSubscription: any;
  private _leitPoiFeatures: LeitPoiFeature[] = [];
  private _mapLeitPois: MapLeitPoi[] = [];

  constructor(private _mapLeitPoiCreator: MapLeitPoiCreatorService) {}

  destroy(): void {
    this._removeMapLeitPois();
    this.destroyed.next();
    this.destroyed.complete();
  }

  processData(
    map: MaplibreMap,
    featureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION
  ): void {
    this._removeMapLeitPois();
    if (!featureCollection || !featureCollection.features?.length) {
      return;
    }

    this._leitPoiFeatures = featureCollection.features
      .filter(
        (f) => !!f.properties?.step && f.properties?.pathType === MapLeitPoiService._leitPoiPathType
      )
      .map((f) => this._convertToLeitPoiFeature(f))
      .filter((lp) => !!lp) as LeitPoiFeature[];

    if (this._leitPoiFeatures.length) {
      this._registerMapZoomEvent(map);
      const routeStartLevelFeature = featureCollection.features.find(
        (f) => !!f.properties?.step && f.properties?.routeStartLevel
      );
      const routeStartLevel = routeStartLevelFeature
        ? Number(routeStartLevelFeature.properties?.routeStartLevel)
        : MapLeitPoiService._defaultLevel;
      this.setCurrentLevel(map, routeStartLevel);
      this.levelSwitched.next(routeStartLevel);
    }
  }

  setCurrentLevel(map: MaplibreMap, currentLevel: number): void {
    this._showLeitPoiByLevel(map, currentLevel);
  }

  private _registerMapZoomEvent(map: MaplibreMap): void {
    if (!this._mapZoomSubscription) {
      this._mapZoomSubscription = map.on('zoomend', () =>
        this._toggleMapLeitPoisVisibility(map.getZoom())
      );
    }
  }

  private _toggleMapLeitPoisVisibility(currentZoomLevel: number): void {
    if (MapLeitPoiService._leitPoiMinMapZoom >= currentZoomLevel) {
      this._hideLeitPois();
    } else {
      this._showLeitPois();
    }
  }

  private _showLeitPois(): void {
    this._mapLeitPois
      .filter((p) => !p.visible)
      .forEach((p) => {
        p.toggleHidden();
      });
  }

  private _hideLeitPois(): void {
    this._mapLeitPois
      .filter((p) => p.visible)
      .forEach((p) => {
        p.toggleHidden();
      });
  }

  private _showLeitPoiByLevel(map: MaplibreMap, currentLevel: number): void {
    this._removeMapLeitPois();
    this._getFeaturesByLevel(currentLevel).forEach((f) => this._showLeitPoi(map, f));
    this._toggleMapLeitPoisVisibility(map.getZoom());
  }

  private _showLeitPoi(map: MaplibreMap, feature: LeitPoiFeature): void {
    const mapLeitPoi = this._mapLeitPoiCreator.createMapLeitPoi(map, feature);
    this._mapLeitPois.push(mapLeitPoi);

    mapLeitPoi.switchLevel.pipe(takeUntil(mapLeitPoi.destroyed)).subscribe((nextLevel) => {
      this._showLeitPoiByLevel(map, nextLevel);
      this.levelSwitched.next(nextLevel);
    });
  }

  private _convertToLeitPoiFeature(feature: Feature): LeitPoiFeature | undefined {
    try {
      if (feature.properties) {
        return {
          travelType: feature.properties.travelType.toLowerCase(),
          travelDirection: feature.properties.direction.toLowerCase(),
          placement: feature.properties.placement.toLowerCase(),
          sourceLevel: Number(feature.properties.sourceFloor),
          location: (feature.geometry as any).coordinates,
          destinationLevel: Number(feature.properties.destinationFloor),
        } as any;
      }
    } catch (e) {
      console.error('Failed to convert Feature to LeitPoiFeature:', feature, e);
    }
    return;
  }

  private _getFeaturesByLevel(currentLevel: number): LeitPoiFeature[] {
    return this._leitPoiFeatures.filter((f) => f.sourceLevel === currentLevel);
  }

  private _removeMapLeitPois(): void {
    this._mapLeitPois.forEach((p) => p.destroy());
    this._mapLeitPois.length = 0;
  }
}
