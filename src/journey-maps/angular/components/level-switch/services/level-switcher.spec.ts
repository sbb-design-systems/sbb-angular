import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { SbbMapLeitPoiService } from '../../../services/map/map-leit-poi-service';
import { SbbMapTransferService } from '../../../services/map/map-transfer-service';

import { SbbLevelSwitcher } from './level-switcher';
import { SbbMapLayerFilter } from './map-layer-filter';

describe('LevelSwitchService', () => {
  let levelSwitchService: SbbLevelSwitcher;
  let mapLayerFilterServiceSpy: jasmine.SpyObj<SbbMapLayerFilter>;
  let mapLeitPoiServiceSpy: jasmine.SpyObj<SbbMapLeitPoiService>;
  let mapTransferService: jasmine.SpyObj<SbbMapTransferService>;
  let mapMock: any = {};
  let onZoomChangedCallbackFn: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SbbLevelSwitcher,
        {
          provide: SbbMapLayerFilter,
          useValue: jasmine.createSpyObj('MapLayerFilterService', ['setLevelFilter', 'setMap']),
        },
        {
          provide: SbbMapLeitPoiService,
          useValue: jasmine.createSpyObj('MapLeitPoiService', ['setCurrentLevel'], {
            levelSwitched: new Subject<number | undefined>(),
          }),
        },
        {
          provide: SbbMapTransferService,
          useValue: jasmine.createSpyObj('MapTransferService', ['updateOutdoorWalkFloor']),
        },
      ],
    });

    levelSwitchService = TestBed.inject(SbbLevelSwitcher);
    mapLayerFilterServiceSpy = TestBed.inject(
      SbbMapLayerFilter,
    ) as jasmine.SpyObj<SbbMapLayerFilter>;
    mapLeitPoiServiceSpy = TestBed.inject(
      SbbMapLeitPoiService,
    ) as jasmine.SpyObj<SbbMapLeitPoiService>;
    mapTransferService = TestBed.inject(
      SbbMapTransferService,
    ) as jasmine.SpyObj<SbbMapTransferService>;
  });

  it('should create with default level == undefined', () => {
    let selectedLevel: number | undefined;
    levelSwitchService.selectedLevel$.subscribe((levelUpdate) => (selectedLevel = levelUpdate));

    expect(levelSwitchService.selectedLevel).toEqual(undefined);
    expect(selectedLevel).toEqual(undefined);
  });

  it('should set new level on switchLevel', () => {
    let selectedLevel: number | undefined;
    levelSwitchService.selectedLevel$.subscribe((levelUpdate) => (selectedLevel = levelUpdate));

    levelSwitchService.setAvailableLevels([0, -4]);

    const newLevel = -4;
    levelSwitchService.switchLevel(newLevel);

    expect(levelSwitchService.selectedLevel).toEqual(newLevel);
    expect(selectedLevel!).toEqual(newLevel);
  });

  it('should not allow setting new level to unavailable level', () => {
    let selectedLevel: number | undefined;
    levelSwitchService.selectedLevel$.subscribe((levelUpdate) => (selectedLevel = levelUpdate));

    levelSwitchService.setAvailableLevels([0, -4]);

    const newLevel = -3;
    levelSwitchService.switchLevel(newLevel);

    expect(levelSwitchService.selectedLevel).toEqual(undefined);
    expect(selectedLevel).toEqual(undefined);
  });

  it('should call injected services with new level value on switchLevel', () => {
    triggerOnInitWithMapMock();
    levelSwitchService.setAvailableLevels([0, -1, -2, -4]);

    const newLevel = -4;
    levelSwitchService.switchLevel(newLevel);

    expect(levelSwitchService.selectedLevel).toEqual(newLevel);
    expect(mapLeitPoiServiceSpy.setCurrentLevel).toHaveBeenCalledWith(mapMock, newLevel);
    expect(mapLayerFilterServiceSpy.setLevelFilter).toHaveBeenCalledWith(newLevel);
    expect(mapTransferService.updateOutdoorWalkFloor).toHaveBeenCalledWith(mapMock, newLevel);
  });

  it('should not be visible if map not ready', () => {
    setMapZoom(16);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(levelSwitchService.isVisible()).toEqual(false);
  });

  it('should not be visible if map ready and above configured map zoom but no levels', () => {
    triggerOnInitWithMapMock(16);
    levelSwitchService.setAvailableLevels([]);

    expect(levelSwitchService.isVisible()).toEqual(false);
  });

  it('should be visible if map ready and above configured map zoom and levels', () => {
    levelSwitchService.setAvailableLevels([-1, 0]);
    triggerOnInitWithMapMock(16);
    expect(levelSwitchService.isVisible()).toEqual(true);
  });

  it('should not be visible if map ready and below configured map zoom', () => {
    triggerOnInitWithMapMock(14);
    levelSwitchService.setAvailableLevels([-1, 0]);

    expect(levelSwitchService.isVisible()).toEqual(false);
  });

  it('should change visibility if map zoomed-in and above configured map zoom', () => {
    levelSwitchService.setAvailableLevels([1, 2, 3]);
    triggerOnInitWithMapMock(14);
    expect(levelSwitchService.isVisible()).toEqual(false);

    setMapZoomAndTriggerZoomChanged(16);

    expect(levelSwitchService.isVisible()).toEqual(true);
  });

  it('should set default level if map zoomed-out and below configured map zoom', () => {
    // initial zoom
    triggerOnInitWithMapMock();
    levelSwitchService.setAvailableLevels([0, -2, -3]);
    expect(levelSwitchService.isVisible()).toEqual(true);
    // switch to level -2
    levelSwitchService.switchLevel(-2);
    expect(levelSwitchService.selectedLevel).toEqual(-2);

    setMapZoomAndTriggerZoomChanged(14);

    // check visibility and selected level
    expect(levelSwitchService.isVisible()).toEqual(false);
    expect(levelSwitchService.selectedLevel).toEqual(undefined);
  });

  it('should show visibleLevels', () => {
    let visibleLevels: number[];
    levelSwitchService.visibleLevels$.subscribe((newLevels) => (visibleLevels = newLevels));

    // start with some visibleLevels
    triggerOnInitWithMapMock(16);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(visibleLevels!.length).toBe(3);
    expect(levelSwitchService.visibleLevels.length).toBe(3);
  });

  it('should not show visibleLevels as empty if zoomLevel goes below 15', () => {
    let visibleLevels: number[];
    levelSwitchService.visibleLevels$.subscribe((newLevels) => (visibleLevels = newLevels));

    // start with some visibleLevels
    triggerOnInitWithMapMock(16);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(visibleLevels!.length).toBe(3);
    expect(levelSwitchService.visibleLevels.length).toBe(3);

    setMapZoomAndTriggerZoomChanged(14);

    expect(visibleLevels!.length).toBe(0);
    expect(levelSwitchService.visibleLevels.length).toBe(0);
  });

  it('should not show visibleLevels as empty if nb levels goes to 0', () => {
    let visibleLevels: number[];
    levelSwitchService.visibleLevels$.subscribe((newLevels) => (visibleLevels = newLevels));

    // start with some visibleLevels
    triggerOnInitWithMapMock(16);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(visibleLevels!.length).toBe(3);
    expect(levelSwitchService.visibleLevels.length).toBe(3);

    levelSwitchService.setAvailableLevels([]);

    expect(visibleLevels!.length).toBe(0);
    expect(levelSwitchService.visibleLevels.length).toBe(0);
  });

  it('should not show visibleLevels', () => {
    let visibleLevels: number[];
    levelSwitchService.visibleLevels$.subscribe((newLevels) => (visibleLevels = newLevels));

    // start with some visibleLevels
    triggerOnInitWithMapMock(14);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(visibleLevels!.length).toBe(0);
    expect(levelSwitchService.visibleLevels.length).toBe(0);
  });

  it('should show visibleLevels if zoom level goes above 15', () => {
    let visibleLevels: number[];
    levelSwitchService.visibleLevels$.subscribe((newLevels) => (visibleLevels = newLevels));

    // start with some visibleLevels
    triggerOnInitWithMapMock(14);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(visibleLevels!.length).toBe(0);
    expect(levelSwitchService.visibleLevels.length).toBe(0);

    setMapZoomAndTriggerZoomChanged(16);

    expect(visibleLevels!.length).toBe(3);
    expect(levelSwitchService.visibleLevels.length).toBe(3);
  });

  it('should show visibleLevels if number of level goes above 0', () => {
    let visibleLevels: number[];
    levelSwitchService.visibleLevels$.subscribe((newLevels) => (visibleLevels = newLevels));

    // start with some visibleLevels
    triggerOnInitWithMapMock(16);
    levelSwitchService.setAvailableLevels([]);

    expect(visibleLevels!.length).toBe(0);
    expect(levelSwitchService.visibleLevels.length).toBe(0);

    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(visibleLevels!.length).toBe(3);
    expect(levelSwitchService.visibleLevels.length).toBe(3);
  });

  function triggerOnInitWithMapMock(initialMapZoom?: number): any {
    mapMock = {
      getStyle: () => {
        return {
          layers: [],
        };
      },
      on: (eventName: string, callbackFn: any) => {
        if (eventName === 'zoomend') {
          onZoomChangedCallbackFn = callbackFn;
        }
      },
      isSourceLoaded: () => false,
      once: () => undefined,
    };
    setMapZoom(initialMapZoom ?? 15);

    // @ts-ignore
    levelSwitchService.onInit(mapMock);
  }

  function setMapZoom(mapZoom: number): void {
    mapMock.getZoom = () => {
      return mapZoom;
    };
  }

  function setMapZoomAndTriggerZoomChanged(mapZoom: number): void {
    setMapZoom(mapZoom);
    onZoomChangedCallbackFn();
  }
});
