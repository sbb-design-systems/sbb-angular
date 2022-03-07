import {FeaturesClickEvent} from './features-click-event';
import {MaplibreMapMock} from '../../../model/maplibre-map-mock';
import {FeatureData, FeatureDataType, FeaturesClickEventData} from '../../../journey-maps-client.interfaces';
import {MapEventUtilsService} from './map-event-utils.service';

describe('FeaturesClickEvent', () => {
  let featuresClickEvent: FeaturesClickEvent;
  let mapMock: MaplibreMapMock;
  let mapEventUtilsMock: any;
  let featureData: FeatureData[];

  beforeEach(() => {
    featureData = [
      {featureDataType: FeatureDataType.ROUTE, geometry: {type: 'Line'}},
      {featureDataType: FeatureDataType.ROUTE, geometry: {type: 'Line'}},
    ] as unknown as FeatureData[];

    mapMock = new MaplibreMapMock();
    mapEventUtilsMock = new MapEventUtilsService();
    spyOn(mapEventUtilsMock, 'queryFeaturesByLayerIds').and.returnValue(featureData);

    const layers = new Map<string, FeatureDataType>();
    featuresClickEvent = new FeaturesClickEvent(mapMock.get(), mapEventUtilsMock, layers);
  });

  it('should be created', () => {
    expect(featuresClickEvent).toBeTruthy();
  });

  it('should submit event on map click', (doneFn) => {
    featuresClickEvent.subscribe((args: FeaturesClickEventData) => {
      expect(args.features.length).toBe(2);
      doneFn();
    });

    mapMock.raise('click');
  });

  it('should submit event on map click with geometry priority check', (doneFn) => {

    featureData.push({featureDataType: FeatureDataType.STATION, geometry: {type: 'Point'}} as unknown as FeatureData);

    featuresClickEvent.subscribe((args: FeaturesClickEventData) => {
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
