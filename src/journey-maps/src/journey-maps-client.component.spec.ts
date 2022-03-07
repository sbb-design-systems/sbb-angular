import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {Marker} from './model/marker';
import {MapMarkerService} from './services/map/map-marker.service';
import {MapInitService} from './services/map/map-init.service';
import {asyncScheduler, Observable, of, scheduled} from 'rxjs';
import {JourneyMapsClientModule} from './journey-maps-client.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {Map as MaplibreMap} from 'maplibre-gl';

let component: JourneyMapsClientComponent;
let fixture: ComponentFixture<JourneyMapsClientComponent>;

describe('JourneyMapsClientComponent#selectedMarkerId', () => {
  beforeEach(async () => {
    await configureTestingModule();
  });

  beforeEach(() => {
    setupFixtureAndComponent();
  });

  function setSelectedMarkerId(markerId: string): void {
    component.selectedMarkerId = markerId;
    fixture.detectChanges();
  }

  it('should emit when (un-)selecting a marker', async () => {
    let selectedMarkerId: string = null;
    component.selectedMarkerIdChange.subscribe((id: string) => selectedMarkerId = id);

    expect(selectedMarkerId).toBe(null);

    setSelectedMarkerId('work');
    expect(selectedMarkerId).toBe('work');

    setSelectedMarkerId(undefined);
    expect(selectedMarkerId).toBe(undefined);
  });
});

describe('JourneyMapsClientComponent#touchEventCollector', () => {
  beforeEach(async () => {
    await configureTestingModule();
  });

  beforeEach(() => {
    setupFixtureAndComponent(false);
  });

  const oneFinger = new Touch({
    identifier: 123,
    target: new EventTarget(),
  });

  const createTouchEventsObservable = (touchEvents: TouchEvent[]): Observable<TouchEvent> =>
    scheduled(touchEvents, asyncScheduler);

  const createTouchEvent = (touches: Touch[], type = 'touchstart'): TouchEvent => new TouchEvent(type, {touches});

  it('should set the touch overlay style class when only one finger used', fakeAsync(() => {
    // @ts-ignore
    component.touchEventCollector = createTouchEventsObservable([
      createTouchEvent([oneFinger]),
      createTouchEvent([oneFinger]),
    ]);

    component.ngAfterViewInit();
    tick();

    expect(component.touchOverlayStyleClass).toBeTruthy();
  }));

  it('should NOT set the touch overlay style class when two fingers used', fakeAsync(() => {
    // @ts-ignore
    component.touchEventCollector = createTouchEventsObservable([
      createTouchEvent([oneFinger]),
      createTouchEvent([oneFinger, oneFinger]),
      createTouchEvent([oneFinger]),
    ]);

    component.ngAfterViewInit();
    tick();

    expect(component.touchOverlayStyleClass).toBeFalsy();
  }));

  it('should NOT set the touch overlay style class when touch events contain \'touchend\' event', fakeAsync(() => {
    // @ts-ignore
    component.touchEventCollector = createTouchEventsObservable([
      createTouchEvent([oneFinger]),
      createTouchEvent([oneFinger], 'touchend'),
      createTouchEvent([oneFinger]),
    ]);

    component.ngAfterViewInit();
    tick();

    expect(component.touchOverlayStyleClass).toBeFalsy();
  }));
});

const configureTestingModule = () => TestBed.configureTestingModule({
  imports: [JourneyMapsClientModule, NoopAnimationsModule, HttpClientModule],
  declarations: [JourneyMapsClientComponent],
  providers: [
    Window,
    {
      provide: MapMarkerService,
      useValue: {
        selectMarker: () => {
        },
        unselectFeature: () => {
        },
        markerCategoryMappings: {get: () => null}
      }
    },
    {
      provide: MapInitService,
      useValue: {
        initializeMap: () => of({
          isStyleLoaded: () => false,
          on: () => {
          },
          addControl: () => {
          },
          resize: () => {
          },
          remove: () => {
          }
        } as unknown as MaplibreMap),
      }
    },
  ]
});

const setupFixtureAndComponent = (oneFingerPan: boolean = true) => {
  fixture = TestBed.createComponent(JourneyMapsClientComponent);
  component = fixture.componentInstance;
  component.apiKey = 'apiKey';
  component.markerOptions.markers = markers;
  component.interactionOptions.oneFingerPan = oneFingerPan;
  fixture.detectChanges();
};

const markers: Marker[] = [
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
    position: [7.446450, 46.961409],
    category: 'WARNING'
  },
];
