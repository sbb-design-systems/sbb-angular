import { EventEmitter, Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SBB_SERVICE_POINT_SOURCE } from '../../../services/constants';
import { SbbLocaleService } from '../../../services/locale-service';
import { SbbMapLeitPoiService } from '../../../services/map/map-leit-poi-service';
import { SbbMapTransferService } from '../../../services/map/map-transfer-service';

import { SbbMapLayerFilter } from './map-layer-filter';
import { SbbQueryMapFeatures } from './query-map-features';

/**
 journey-maps-client component scope service.
 Use one service instance per map instance.
 */
@Injectable()
export class SbbLevelSwitcher {
  private _map: MaplibreMap;
  private _lastZoom: number; // needed to detect when we cross zoom threshold to show or hide the level switcher component

  private readonly _destroyed = new Subject<void>();
  private readonly _defaultLevel = undefined;
  // same minZoom as in Android and iOS map
  private readonly _levelButtonMinMapZoom = 15;
  private readonly _selectedLevel = new BehaviorSubject<number | undefined>(this._defaultLevel);
  // availableLevels: levels available in the visible area of the map
  private readonly _availableLevels = new BehaviorSubject<number[]>([]);
  // visibleLevels: same as availableLevels IF at correct zoom level, otherwise empty
  private readonly _visibleLevels = new BehaviorSubject<number[]>([]);

  private readonly _zoomChanged = new Subject<void>(); // gets triggered by the map's 'zoomend' event and calls onZoomChanged()
  private readonly _mapMoved = new Subject<void>(); // gets triggered by the map's 'moveend' event and calls updateLevels()

  // service design inspired by https://www.maestralsolutions.com/angular-application-state-management-you-do-not-need-external-data-stores/
  readonly selectedLevel$ = this._selectedLevel.asObservable();
  readonly visibleLevels$ = this._visibleLevels.asObservable();
  // changeDetectionEmitter inspired by https://stackoverflow.com/a/48736591/349169
  readonly changeDetectionEmitter = new EventEmitter<void>();

  get selectedLevel(): number | undefined {
    return this._selectedLevel.getValue();
  }

  // in most instances you should call switchLevel() instead
  private _setSelectedLevel(selectedLevel: number | undefined): void {
    if (
      !selectedLevel ||
      this.availableLevels.includes(selectedLevel) ||
      selectedLevel === this._defaultLevel
    ) {
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
    private _mapLayerFilterService: SbbMapLayerFilter,
    private _i18n: SbbLocaleService,
    private _queryMapFeaturesService: SbbQueryMapFeatures,
    private _mapLeitPoiService: SbbMapLeitPoiService,
    private _mapTransferService: SbbMapTransferService,
  ) {}

  private _isVisibleInCurrentMapZoomLevel(): boolean {
    return this._map?.getZoom() >= this._levelButtonMinMapZoom;
  }

  destroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
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
    if (this._map.isSourceLoaded(SBB_SERVICE_POINT_SOURCE)) {
      this._updateLevels();
    } else {
      this._map.once('idle', () => this._updateLevels());
    }
    // call outside component-zone, trigger detect changes manually
    this.changeDetectionEmitter.emit();

    this._zoomChanged.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._onZoomChanged();
    });

    this._mapMoved.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._updateLevels();
    });

    // called whenever the level is switched via the leit-pois (or when the map is set to a specific floor for a new transfer)
    this._mapLeitPoiService.levelSwitched
      .pipe(takeUntil(this._destroyed))
      .subscribe((nextLevel) => {
        this._setSelectedLevel(nextLevel);
      });

    this._selectedLevel.pipe(takeUntil(this._destroyed)).subscribe((selectedLevel) => {
      this._mapLayerFilterService.setLevelFilter(selectedLevel);
      this._mapTransferService.updateOutdoorWalkFloor(this._map, selectedLevel);
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    });

    // call setSelectedLevel() here, as calling it from the constructor doesn't seem to notify the elements testapp
    this._setSelectedLevel(this._defaultLevel);
  }

  switchLevel(level: number | undefined): void {
    this._setSelectedLevel(level);
    this._mapLeitPoiService.setCurrentLevel(this._map, level);
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
      if (!this.selectedLevel || this.availableLevels.indexOf(this.selectedLevel) === -1) {
        this.switchLevel(this._defaultLevel);
      }
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
  }
}
