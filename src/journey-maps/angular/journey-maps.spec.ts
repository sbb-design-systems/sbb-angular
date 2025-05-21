import { HttpClientModule } from '@angular/common/http';
import { provideCheckNoChangesConfig } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Map as MaplibreMap } from 'maplibre-gl';
import { asyncScheduler, Observable, of, scheduled } from 'rxjs';

import { SbbJourneyMaps } from './journey-maps';
import { SbbJourneyMapsModule } from './journey-maps.module';
import { SbbMarker } from './model/marker';
import { SbbMapInitService } from './services/map/map-init-service';
import { SbbMapMarkerService } from './services/map/map-marker-service';

let component: SbbJourneyMaps;
let fixture: ComponentFixture<SbbJourneyMaps>;

describe('JourneyMapsClientComponent#selectedMarkerId', () => {
  beforeEach(() => {
    configureTestingModule();
  });

  beforeEach(() => {
    setupFixtureAndComponent();
  });

  function setSelectedMarkerId(markerId: string | undefined): void {
    component.selectedMarkerId = markerId;
    fixture.detectChanges();
  }

  it('should emit when (un-)selecting a marker', (doneFn) => {
    setSelectedMarkerId('work');
    component.selectedMarkerIdChange.subscribe((id: string | undefined) => {
      expect(id).toBeFalsy();
      doneFn();
    });
    setSelectedMarkerId(undefined);
  });

  it('should emit when selecting a marker', (doneFn) => {
    component.selectedMarkerIdChange.subscribe((id: string) => {
      expect(id).toBe('work');
      doneFn();
    });
    setSelectedMarkerId('work');
  });
});

if (window.TouchEvent) {
  describe('JourneyMapsClientComponent#touchEventCollector', () => {
    beforeEach(() => {
      configureTestingModule();
    });

    beforeEach(() => {
      setupFixtureAndComponent(false);
    });

    const createTouchEventsObservable = (touchEvents: TouchEvent[]): Observable<TouchEvent> =>
      scheduled(touchEvents, asyncScheduler);

    const createTouchEvent = (touches: Touch[], type = 'touchstart'): TouchEvent =>
      new TouchEvent(type, { touches });

    const createFingerTouch = () =>
      new Touch({
        identifier: 123,
        target: new EventTarget(),
      });

    it('should set the touch overlay style class when only one finger used', fakeAsync(() => {
      // @ts-ignore
      component.touchEventCollector = createTouchEventsObservable([
        createTouchEvent([createFingerTouch()]),
        createTouchEvent([createFingerTouch()]),
      ]);

      component.ngAfterViewInit();
      tick();

      expect(component.touchOverlayStyleClass).toBeTruthy();
    }));

    it('should NOT set the touch overlay style class when two fingers used', fakeAsync(() => {
      // @ts-ignore
      component.touchEventCollector = createTouchEventsObservable([
        createTouchEvent([createFingerTouch()]),
        createTouchEvent([createFingerTouch(), createFingerTouch()]),
        createTouchEvent([createFingerTouch()]),
      ]);

      component.ngAfterViewInit();
      tick();

      expect(component.touchOverlayStyleClass).toBeFalsy();
    }));

    it("should NOT set the touch overlay style class when touch events contain 'touchend' event", fakeAsync(() => {
      // @ts-ignore
      component.touchEventCollector = createTouchEventsObservable([
        createTouchEvent([createFingerTouch()]),
        createTouchEvent([createFingerTouch()], 'touchend'),
        createTouchEvent([createFingerTouch()]),
      ]);

      component.ngAfterViewInit();
      tick();

      expect(component.touchOverlayStyleClass).toBeFalsy();
    }));
  });
}

const configureTestingModule = () =>
  TestBed.configureTestingModule({
    imports: [SbbJourneyMapsModule, NoopAnimationsModule, HttpClientModule],
    declarations: [SbbJourneyMaps],
    providers: [
      Window,
      provideCheckNoChangesConfig({ exhaustive: false }),
      {
        provide: SbbMapMarkerService,
        useValue: {
          selectMarker: () => {},
          unselectFeature: () => {},
          markerCategoryMappings: { get: () => null },
        },
      },
      {
        provide: SbbMapInitService,
        useValue: {
          initializeMap: () =>
            of({
              isStyleLoaded: () => false,
              on: () => {},
              addControl: () => {},
              resize: () => {},
              remove: () => {},
            } as unknown as MaplibreMap),
        },
      },
    ],
  });

const setupFixtureAndComponent = (oneFingerPan: boolean = true) => {
  fixture = TestBed.createComponent(SbbJourneyMaps);
  component = fixture.componentInstance;
  component.apiKey = 'apiKey';
  component.markerOptions.markers = markers;
  component.interactionOptions.oneFingerPan = oneFingerPan;
  fixture.detectChanges();
};

const markers: SbbMarker[] = [
  {
    id: 'home',
    title: 'Home Office',
    subtitle: 'My home is my castle',
    position: [7.296515, 47.069815],
    category: 'INFORMATION', // or WARNING or CUSTOM
  },
  {
    id: 'work',
    title: 'Office',
    subtitle: 'SBB Wylerpark',
    position: [7.44645, 46.961409],
    category: 'WARNING',
  },
];
