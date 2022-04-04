import { SbbFeatureData, SbbFeatureDataType } from '../../../journey-maps.interfaces';
import { SbbMaplibreMapMock } from '../../../testing/maplibre-map-mock';

import { SbbFeaturesHoverEvent } from './features-hover-event';
import { SbbMapEventUtils } from './map-event-utils';
import { SbbRouteUtils } from './route-utils';

describe('FeaturesHoverEvent', () => {
  let watchOnLayers: Map<string, SbbFeatureDataType>;
  let featuresHoverEvent: SbbFeaturesHoverEvent;
  let mapMock: SbbMaplibreMapMock;
  let featureData: SbbFeatureData[];

  beforeEach(() => {
    mapMock = new SbbMaplibreMapMock();

    featureData = [
      {
        featureDataType: 'ROUTE',
        geometry: { type: 'Line' },
        source: 'routes-source',
      },
      {
        featureDataType: 'ROUTE',
        geometry: { type: 'Line' },
        source: 'routes-source',
      },
    ] as unknown as SbbFeatureData[];

    const mapEventUtilsMock = new SbbMapEventUtils();
    spyOn(mapEventUtilsMock, 'queryFeaturesByLayerIds').and.returnValue(featureData);

    const routeUtilsMock = {
      filterRouteFeatures: () => [],
    } as unknown as SbbRouteUtils;

    const layers = ['route-layer-1', 'route-layer-2'];
    watchOnLayers = new Map<string, SbbFeatureDataType>();
    layers.forEach((id) => watchOnLayers.set(id, 'ROUTE'));

    featuresHoverEvent = new SbbFeaturesHoverEvent(
      mapMock.get(),
      mapEventUtilsMock,
      watchOnLayers,
      routeUtilsMock
    );
  });

  it('should be created', () => {
    expect(featuresHoverEvent).toBeTruthy();
  });

  it('should submit hover event on mouse-hover', (doneFn) => {
    featuresHoverEvent.subscribe((eventArgs) => {
      expect(eventArgs.hover).toBeTruthy();
      expect(eventArgs.leave).toBeFalse();
      expect(eventArgs.features.length).toBe(2);
      doneFn();
    });
    mapMock.raise('mousemove');
  });

  it('should not submit event on mouse-hover when no features hovered', (doneFn) => {
    featureData.length = 0;
    featuresHoverEvent.subscribe(() => {
      fail('Should not raise this event.');
    });
    mapMock.raise('mousemove');
    setTimeout(() => doneFn(), 1000);
  });

  it('should submit hover then leave events on mouse-hover change', (doneFn) => {
    let hover = true;
    featuresHoverEvent.subscribe((eventArgs) => {
      expect(eventArgs.features.length).toBe(2);
      if (hover) {
        expect(eventArgs.hover).toBeTruthy();
        expect(eventArgs.leave).toBeFalse();
        hover = false;
      } else {
        expect(eventArgs.hover).toBeFalse();
        expect(eventArgs.leave).toBeTruthy();
        doneFn();
      }
    });
    /* simulate hover */
    mapMock.raise('mousemove');

    setTimeout(() => {
      /* simulate leave */
      featureData.length = 0; // nothing hovered
      mapMock.raise('mousemove');
    }, 100);
  });

  it('should submit hover events periodically with delay', (doneFn) => {
    let once = true;
    featuresHoverEvent.subscribe(() => {
      expect(once).toBeTruthy();
      once = false;
    });
    /* simulate hover */
    setTimeout(() => mapMock.raise('mousemove'), 1);
    setTimeout(() => mapMock.raise('mousemove'), 2);
    setTimeout(() => mapMock.raise('mousemove'), 3);
    setTimeout(() => mapMock.raise('mousemove'), 4);
    setTimeout(() => doneFn(), 100);
  });
});
