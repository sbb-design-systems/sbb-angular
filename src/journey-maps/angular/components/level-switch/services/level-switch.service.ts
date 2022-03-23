import { EventEmitter, Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { LocaleService } from '../../../services/locale.service';
import { MapLeitPoiService } from '../../../services/map/map-leit-poi.service';
import { MapTransferService } from '../../../services/map/map-transfer.service';

import { MapLayerFilterService } from './map-layer-filter.service';
import { QueryMapFeaturesService } from './query-map-features.service';

/**
 journey-maps-client component scope service.
 Use one service instance per map instance.
 */
@Injectable()
export class LevelSwitchService {
  private _map: MaplibreMap;
  private _lastZoom: number; // needed to detect when we cross zoom threshold to show or hide the level switcher component

  private readonly _subscriptions = new Subscription();

  private readonly _defaultLevel = 0;
  // same minZoom as in Android and iOS map
  private readonly _levelButtonMinMapZoom = 15;
  private readonly _selectedLevel = new BehaviorSubject<number>(0);
  private readonly _availableLevels = new BehaviorSubject<number[]>([]);
  private readonly _visibleLevels = new BehaviorSubject<number[]>([]);

  private readonly _zoomChanged = new Subject<void>(); // gets triggered by the map's 'zoomend' event and calls onZoomChanged()
  private readonly _mapMoved = new Subject<void>(); // gets triggered by the map's 'moveend' event and calls updateLevels()

  // service design inspired by https://www.maestralsolutions.com/angular-application-state-management-you-do-not-need-external-data-stores/
  readonly selectedLevel$ = this._selectedLevel.asObservable();
  readonly visibleLevels$ = this._visibleLevels.asObservable();
  // changeDetectionEmitter inspired by https://stackoverflow.com/a/48736591/349169
  readonly changeDetectionEmitter = new EventEmitter<void>();

  get selectedLevel(): number {
    return this._selectedLevel.getValue();
  }

  // in most instances you should call switchLevel() instead
  private _setSelectedLevel(selectedLevel: number): void {
    if (this.availableLevels.includes(selectedLevel) || selectedLevel === this._defaultLevel) {
      this._selectedLevel.next(selectedLevel);
    }
  }

  get availableLevels(): number[] {
    return this._availableLevels.getValue();
  }

  setAvailableLevels(availableLevels: number[]): void {
    this._availableLevels.next(availableLevels);
    this._updateIsLevelSwitchVisible();
  }

  get visibleLevels(): number[] {
    return this._visibleLevels.getValue();
  }

  constructor(
    private _mapLayerFilterService: MapLayerFilterService,
    private _i18n: LocaleService,
    private _queryMapFeaturesService: QueryMapFeaturesService,
    private _mapLeitPoiService: MapLeitPoiService,
    private _mapTransferService: MapTransferService
  ) {}

  private _isVisibleInCurrentMapZoomLevel(): boolean {
    return this._map?.getZoom() >= this._levelButtonMinMapZoom;
  }

  destroy(): void {
    this._subscriptions.unsubscribe();
  }

  isVisible(): boolean {
    return this._isVisibleInCurrentMapZoomLevel() && this.availableLevels.length > 0;
  }

  onInit(map: MaplibreMap): void {
    this._map = map;
    this._lastZoom = this._map.getZoom();
    this._map.on('zoomend', () => this._zoomChanged.next());
    this._map.on('moveend', () => this._mapMoved.next());

    this._mapLayerFilterService.setMap(this._map);
    if (this._map.isSourceLoaded(QueryMapFeaturesService.SERVICE_POINT_SOURCE_ID)) {
      this._updateLevels();
    } else {
      this._map.once('idle', () => this._updateLevels());
    }
    // call outside component-zone, trigger detect changes manually
    this.changeDetectionEmitter.emit();

    this._subscriptions.add(
      this._zoomChanged.subscribe(() => {
        this._onZoomChanged();
      })
    );

    this._subscriptions.add(
      this._mapMoved.subscribe(() => {
        this._updateLevels();
      })
    );

    // called whenever the level is switched via the leit-pois (or when the map is set to a specific floor for a new transfer)
    this._subscriptions.add(
      this._mapLeitPoiService.levelSwitched.subscribe((nextLevel) => {
        this._setSelectedLevel(nextLevel);
      })
    );

    this._subscriptions.add(
      this._selectedLevel.subscribe((selectedLevel) => {
        this._mapLayerFilterService.setLevelFilter(selectedLevel);
        this._mapTransferService.updateOutdoorWalkFloor(this._map, selectedLevel);
        // call outside component-zone, trigger detect changes manually
        this.changeDetectionEmitter.emit();
      })
    );

    // call setSelectedLevel() here, as calling it from the constructor doesn't seem to notify the elements testapp
    this._setSelectedLevel(this._defaultLevel);
  }

  switchLevel(level: number): void {
    this._setSelectedLevel(level);
    this._mapLeitPoiService.setCurrentLevel(this._map, level);
  }

  getLevelLabel(level: number): string {
    const txt1 = this._i18n.getText('a4a.visualFunction');
    const txt2 = this._i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }

  /**
   * gets called every time the map's 'zoomend' event triggers the 'zoomChanged' observable
   */
  private _onZoomChanged(): void {
    this._updateIsLevelSwitchVisible();
    // diff < 0 means that we crossed (in either direction) the threshold to display the level switch component.
    // diff = 0 means that we touched (before or after zoomChanged) the threshold to display the level switch component.
    const diff =
      (this._levelButtonMinMapZoom - this._lastZoom) *
      (this._levelButtonMinMapZoom - this._map.getZoom());
    if (diff <= 0) {
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
    this._setDefaultLevelIfNotVisible();
    this._lastZoom = this._map.getZoom();
  }

  private _updateIsLevelSwitchVisible(): void {
    if (this._isVisibleInCurrentMapZoomLevel()) {
      this._visibleLevels.next(this.availableLevels);
    } else {
      this._visibleLevels.next([]);
    }
  }

  private _setDefaultLevelIfNotVisible(): void {
    // Set default level when level switch is not visible
    const shouldSetDefaultLevel = !this.isVisible() && this.selectedLevel !== this._defaultLevel;
    if (shouldSetDefaultLevel) {
      this.switchLevel(this._defaultLevel);
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
  }

  /**
   * gets called when the map is initialized and then again every time the map's 'moveend' event triggers the 'mapMoved' observable
   */
  private _updateLevels(): void {
    if (this._isVisibleInCurrentMapZoomLevel()) {
      const currentLevels = this._queryMapFeaturesService.getVisibleLevels(this._map);
      this._updateLevelsIfChanged(currentLevels);
    }

    this._setDefaultLevelIfNotVisible();
  }

  private _updateLevelsIfChanged(levels: number[]): void {
    if (JSON.stringify(this.availableLevels) !== JSON.stringify(levels)) {
      this.setAvailableLevels(levels);
      // if selected level not in new levels list:
      if (this.availableLevels.indexOf(this.selectedLevel) === -1) {
        this.switchLevel(this._defaultLevel);
      }
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
  }
}
