import {MaplibreMapMock} from '../../../model/maplibre-map-mock';
import {FeaturesHoverEvent} from './features-hover-event';
import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';
import {MapEventUtilsService} from './map-event-utils.service';
import {RouteUtilsService} from './route-utils.service';

describe('FeaturesHoverEvent', () => {
  let watchOnLayers: Map<string, FeatureDataType>;
  let featuresHoverEvent: FeaturesHoverEvent;
  let mapMock: MaplibreMapMock;
  let featureData: FeatureData[];

  beforeEach(() => {
    mapMock = new MaplibreMapMock();

    featureData = [
      {featureDataType: FeatureDataType.ROUTE, geometry: {type: 'Line'}, source: 'routes-source'},
      {featureDataType: FeatureDataType.ROUTE, geometry: {type: 'Line'}, source: 'routes-source'},
    ] as unknown as FeatureData[];

    const mapEventUtilsMock = new MapEventUtilsService();
    spyOn(mapEventUtilsMock, 'queryFeaturesByLayerIds').and.returnValue(featureData);

    const routeUtilsMock = {
      filterRouteFeatures: () => []
    } as undefined as RouteUtilsService;

    const layers = ['route-layer-1', 'route-layer-2'];
    watchOnLayers = new Map<string, FeatureDataType>();
    layers.forEach(id => watchOnLayers.set(id, FeatureDataType.ROUTE));

    featuresHoverEvent = new FeaturesHoverEvent(mapMock.get(), mapEventUtilsMock, watchOnLayers, routeUtilsMock);
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
