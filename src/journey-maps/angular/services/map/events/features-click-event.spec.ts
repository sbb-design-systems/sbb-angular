import {
  SbbFeatureData,
  SbbFeatureDataType,
  SbbFeaturesClickEventData,
} from '../../../journey-maps.interfaces';
import { SbbMaplibreMapMock } from '../../../testing/maplibre-map-mock';

import { SbbFeaturesClickEvent } from './features-click-event';
import { SbbMapEventUtils } from './map-event-utils';

describe('FeaturesClickEvent', () => {
  let featuresClickEvent: SbbFeaturesClickEvent;
  let mapMock: SbbMaplibreMapMock;
  let mapEventUtilsMock: any;
  let featureData: SbbFeatureData[];

  beforeEach(() => {
    featureData = [
      { featureDataType: 'ROUTE', geometry: { type: 'Line' } },
      { featureDataType: 'ROUTE', geometry: { type: 'Line' } },
    ] as unknown as SbbFeatureData[];

    mapMock = new SbbMaplibreMapMock();
    mapEventUtilsMock = new SbbMapEventUtils();
    spyOn(mapEventUtilsMock, 'queryFeaturesByLayerIds').and.returnValue(featureData);

    const layers = new Map<string, SbbFeatureDataType>();
    featuresClickEvent = new SbbFeaturesClickEvent(mapMock.get(), mapEventUtilsMock, layers);
  });

  it('should be created', () => {
    expect(featuresClickEvent).toBeTruthy();
  });

  it('should submit event on map click', (doneFn) => {
    featuresClickEvent.subscribe((args: SbbFeaturesClickEventData) => {
      expect(args.features.length).toBe(2);
      doneFn();
    });

    mapMock.raise('click');
  });

  it('should submit event on map click with geometry priority check', (doneFn) => {
    featureData.push({
      featureDataType: 'STATION',
      geometry: { type: 'Point' },
    } as unknown as SbbFeatureData);

    featuresClickEvent.subscribe((args: SbbFeaturesClickEventData) => {
      expect(args.features.length).toBe(1);
      expect(args.features[0].geometry.type).toBe('Point');
      doneFn();
    });

    mapMock.raise('click');
  });

  it('should not submit event on map click when no features found.', (doneFn) => {
    featureData.length = 0;
    featuresClickEvent.subscribe(() => {
      fail('Should not raise this event.');
    });

    mapMock.raise('click');
    setTimeout(() => doneFn(), 1000);
  });
});
