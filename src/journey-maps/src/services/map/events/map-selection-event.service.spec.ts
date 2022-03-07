import {MaplibreMapMock} from '../../../model/maplibre-map-mock';
import {FeatureData, FeatureDataType, FeaturesClickEventData, SelectionMode} from '../../../journey-maps-client.interfaces';
import {MapEventUtilsService} from './map-event-utils.service';
import {RouteUtilsService} from './route-utils.service';
import {MapSelectionEventService} from './map-selection-event.service';

describe('MapSelectionEventService', () => {
  let watchOnLayers: Map<string, FeatureDataType>;
  let mapSelectionEventService: MapSelectionEventService;
  let mapMock: MaplibreMapMock;
  let featureData: FeatureData[];
  const layers = ['route-layer-1', 'route-layer-2'];

  const selectionModes = new Map<FeatureDataType, SelectionMode>();
  const mapEventUtilsMock = {
    queryFeaturesByLayerIds: () => {
      return featureData;
    },
    queryFeaturesByProperty: () => {
      return featureData;
    },
    setFeatureState: (data: any, map: any, state: any) => {
      data.state = Object.assign(data.state, state);
    },
  } as undefined as MapEventUtilsService;

  const routeUtilsMock = {
    filterRouteFeatures: () => [],
    setRelatedRouteFeaturesSelection: () => []
  } as undefined as RouteUtilsService;

  beforeEach(() => {
    featureData = [
      {featureDataType: FeatureDataType.ROUTE, state: {selected: false}},
      {featureDataType: FeatureDataType.ROUTE, state: {selected: false}}
    ] as undefined as FeatureData[];

    mapMock = new MaplibreMapMock();
    watchOnLayers = new Map<string, FeatureDataType>();
    layers.forEach(id => watchOnLayers.set(id, FeatureDataType.ROUTE));
    mapSelectionEventService = new MapSelectionEventService(routeUtilsMock, mapEventUtilsMock);
  });

  it('should be created', () => {
    expect(mapSelectionEventService).toBeTruthy();
  });

  it('should select only one feature in single selection mode', () => {
    selectionModes.set(FeatureDataType.ROUTE, SelectionMode.single);
    mapSelectionEventService.initialize(mapMock.get(), watchOnLayers, selectionModes);

    mapSelectionEventService.toggleSelection({features: featureData} as FeaturesClickEventData);
    expect(featureData.some(f => !f.state.selected)).toBeTruthy();
    expect(featureData.some(f => f.state.selected)).toBeTruthy();
  });

  it('should select all features in multi selection mode', () => {
    selectionModes.set(FeatureDataType.ROUTE, SelectionMode.multi);
    mapSelectionEventService.initialize(mapMock.get(), watchOnLayers, selectionModes);

    mapSelectionEventService.toggleSelection({features: featureData} as FeaturesClickEventData);
    expect(featureData.some(f => !f.state.selected)).toBeFalse();
  });
});
