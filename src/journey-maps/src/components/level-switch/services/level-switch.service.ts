import {EventEmitter, Injectable} from '@angular/core';
import {Map as MaplibreMap} from 'maplibre-gl';
import {BehaviorSubject, Subject} from 'rxjs';
import {LocaleService} from '../../../services/locale.service';
import {QueryMapFeaturesService} from './query-map-features.service';
import {MapLeitPoiService} from '../../../services/map/map-leit-poi.service';
import {MapTransferService} from '../../../services/map/map-transfer.service';
import {MapLayerFilterService} from './map-layer-filter.service';

@Injectable({
  providedIn: 'root'
})
export class LevelSwitchService {

  private map: MaplibreMap;
  private lastZoom: number; // needed to detect when we cross zoom threshold to show or hide the level switcher component

  private readonly defaultLevel = 0;
  // same minZoom as in Android and iOS map
  private readonly levelButtonMinMapZoom = 15;
  private readonly _selectedLevel = new BehaviorSubject<number>(0);
  private readonly _availableLevels = new BehaviorSubject<number[]>([]);
  private readonly _visibleLevels = new BehaviorSubject<number[]>([]);

  private readonly zoomChanged = new Subject<void>(); // gets triggered by the map's 'zoomend' event and calls onZoomChanged()
  private readonly mapMoved = new Subject<void>(); // gets triggered by the map's 'moveend' event and calls updateLevels()

  // service design inspired by https://www.maestralsolutions.com/angular-application-state-management-you-do-not-need-external-data-stores/
  readonly selectedLevel$ = this._selectedLevel.asObservable();
  readonly visibleLevels$ = this._visibleLevels.asObservable();
  // changeDetectionEmitter inspired by https://stackoverflow.com/a/48736591/349169
  readonly changeDetectionEmitter = new EventEmitter<void>();

  get selectedLevel(): number {
    return this._selectedLevel.getValue();
  }

  // in most instances you should call switchLevel() instead
  private setSelectedLevel(selectedLevel: number): void {
    if (this.availableLevels.includes(selectedLevel) || selectedLevel === this.defaultLevel) {
      this._selectedLevel.next(selectedLevel);
    }
  }

  get availableLevels(): number[] {
    return this._availableLevels.getValue();
  }

  setAvailableLevels(availableLevels: number[]): void {
    this._availableLevels.next(availableLevels);
    this.updateIsLevelSwitchVisible();
  }

  get visibleLevels(): number[] {
    return this._visibleLevels.getValue();
  }

  constructor(private mapLayerFilterService: MapLayerFilterService,
              private i18n: LocaleService,
              private queryMapFeaturesService: QueryMapFeaturesService,
              private mapLeitPoiService: MapLeitPoiService,
              private mapTransferService: MapTransferService) {
  }

  private isVisibleInCurrentMapZoomLevel(): boolean {
    return this.map?.getZoom() >= this.levelButtonMinMapZoom;
  }

  isVisible(): boolean {
    return this.isVisibleInCurrentMapZoomLevel() && this.availableLevels.length > 0;
  }

  onInit(map: MaplibreMap): void {
    this.map = map;
    this.lastZoom = this.map.getZoom();
    this.map.on('zoomend', () => this.zoomChanged.next());
    this.map.on('moveend', () => this.mapMoved.next());

    this.mapLayerFilterService.setMap(this.map);
    if (this.map.isSourceLoaded(QueryMapFeaturesService.SERVICE_POINT_SOURCE_ID)) {
      this.updateLevels();
    } else {
      this.map.once('idle', () => this.updateLevels());
    }
    // call outside component-zone, trigger detect changes manually
    this.changeDetectionEmitter.emit();

    this.zoomChanged
      .subscribe(() => {
        this.onZoomChanged();
      });

    this.mapMoved
      .subscribe(() => {
        this.updateLevels();
      });

    // called whenever the level is switched via the leit-pois (or when the map is set to a specific floor for a new transfer)
    this.mapLeitPoiService.levelSwitched
      .subscribe((nextLevel) => {
        this.setSelectedLevel(nextLevel);
      });

    this._selectedLevel
      .subscribe(selectedLevel => {
        this.mapLayerFilterService.setLevelFilter(selectedLevel);
        this.mapTransferService.updateOutdoorWalkFloor(this.map, selectedLevel);
        // call outside component-zone, trigger detect changes manually
        this.changeDetectionEmitter.emit();
      });

    // call setSelectedLevel() here, as calling it from the constructor doesn't seem to notify the elements testapp
    this.setSelectedLevel(this.defaultLevel);
  }

  switchLevel(level: number): void {
    this.setSelectedLevel(level);
    this.mapLeitPoiService.setCurrentLevel(this.map, level);
  }

  getLevelLabel(level: number): string {
    const txt1 = this.i18n.getText('a4a.visualFunction');
    const txt2 = this.i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }

  /**
   * gets called every time the map's 'zoomend' event triggers the 'zoomChanged' observable
   */
  private onZoomChanged(): void {
    this.updateIsLevelSwitchVisible();
    // diff < 0 means that we crossed (in either direction) the threshold to display the level switch component.
    // diff = 0 means that we touched (before or after zoomChanged) the threshold to display the level switch component.
    const diff = (this.levelButtonMinMapZoom - this.lastZoom) * (this.levelButtonMinMapZoom - this.map.getZoom());
    if (diff <= 0) {
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
    this.setDefaultLevelIfNotVisible();
    this.lastZoom = this.map.getZoom();
  }

  private updateIsLevelSwitchVisible(): void {
    if (this.isVisibleInCurrentMapZoomLevel()) {
      this._visibleLevels.next(this.availableLevels);
    } else {
      this._visibleLevels.next([]);
    }
  }

  private setDefaultLevelIfNotVisible(): void {
    // Set default level when level switch is not visible
    const shouldSetDefaultLevel = !this.isVisible() && this.selectedLevel !== this.defaultLevel;
    if (shouldSetDefaultLevel) {
      this.switchLevel(this.defaultLevel);
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
  }

  /**
   * gets called when the map is initialized and then again every time the map's 'moveend' event triggers the 'mapMoved' observable
   */
  private updateLevels(): void {
    if (this.isVisibleInCurrentMapZoomLevel()) {
      const currentLevels = this.queryMapFeaturesService.getVisibleLevels(this.map);
      this.updateLevelsIfChanged(currentLevels);
    }

    this.setDefaultLevelIfNotVisible();
  }

  private updateLevelsIfChanged(levels: number[]): void {
    if (JSON.stringify(this.availableLevels) !== JSON.stringify(levels)) {
      this.setAvailableLevels(levels);
      // if selected level not in new levels list:
      if (this.availableLevels.indexOf(this.selectedLevel) === -1) {
        this.switchLevel(this.defaultLevel);
      }
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
  }
}
