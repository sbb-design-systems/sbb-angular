import {MapLayerFilterService} from './map-layer-filter.service';

describe('MapLayerFilterService', () => {
  let service: MapLayerFilterService;
  let mapMock: any;
  let rokasBackgroundLayerMock: any;
  let calculatedFilter: any[];
  const testLayerId = 'station-platform-lvl';

  beforeEach(() => {
    service = new MapLayerFilterService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not change filter if nothing to do', () => {
    const oldFilter = ['all', ['==', ['geometry-type'], 'Point'], ['==', 'lorem-ipsum', '1234567890']];
    configureMapMock(oldFilter);
    const level = 1;
    service.setLevelFilter(level);
    expect(calculatedFilter).toEqual(oldFilter);
  });

  it('should set new floor - simple', () => {
    const oldFilter = ['==', 'floor', '0'];
    configureMapMock(oldFilter);
    const level = 1;
    service.setLevelFilter(level);
    expect(calculatedFilter).toEqual(['==', 'floor', 1]);
  });

  it('should set new floor - advanced', () => {
    const oldFilter = ['==', ['get', 'floor'], '0'];
    configureMapMock(oldFilter);
    const level = -1;
    service.setLevelFilter(level);
    expect(calculatedFilter).toEqual(['==', ['get', 'floor'], -1]);
  });

  it('should set new floor - expert', () => {
    const oldFilter = ['all', ['==', ['geometry-type'], 'Polygon'], ['==', 'floor', '0.0']];
    configureMapMock(oldFilter);
    const level = 2.0;
    service.setLevelFilter(level);
    expect(calculatedFilter).toEqual(['all', ['==', ['geometry-type'], 'Polygon'], ['==', 'floor', 2]]);
  });

  it('should set new level - case-filter', () => {
    const oldFilter = ['all', ['==', ['case', ['has', 'level'], ['get', 'level'], 0], 0], ['==', ['geometry-type'], 'Polygon']];
    configureMapMock(oldFilter);
    const level = 2;
    service.setLevelFilter(level);
    expect(calculatedFilter).toEqual(
      ['all', ['==', ['case', ['has', 'level'], ['get', 'level'], 0], 2], ['==', ['geometry-type'], 'Polygon']]
    );
  });

  it('should set rokas_background_mask layer to visible when level < 0', () => {
    configureMapMock([]);
    const level = -4;
    expect(rokasBackgroundLayerMock.visibility).toEqual('none');
    service.setLevelFilter(level);
    expect(rokasBackgroundLayerMock.visibility).toEqual('visible');
  });

  it('should keep rokas_background_mask hidden when level >= 0', () => {
    configureMapMock([]);
    const level = 2;
    expect(rokasBackgroundLayerMock.visibility).toEqual('none');
    service.setLevelFilter(level);
    expect(rokasBackgroundLayerMock.visibility).toEqual('none');
  });

  function configureMapMock(filter: any[]): void {
    mapMock = {
      getStyle: () => {
        return {
          layers: createMapLayersMock()
        };
      },
      setFilter: (layerId, newFilter) => {
        if (layerId === testLayerId) {
          calculatedFilter = newFilter;
        } else {
          throw new Error('setFilter: LayerId not found in map mock:' + layerId);
        }
      },
      getFilter: (layerId) => {
        return filter;
      },
    };

    service.setMap(mapMock);
  }

  function createMapLayersMock(): any[] {
    const mapLayerMock = {
      id: testLayerId,
      visibility: 'visible',
      type: 'fill'
    };

    rokasBackgroundLayerMock = {
      id: 'rokas_background_mask',
      visibility: 'none',
      type: 'background'
    };

    mapMock.getLayer = (layerId) => {
      if (layerId === 'rokas_background_mask') {
        return rokasBackgroundLayerMock;
      } else if (layerId === testLayerId) {
        return mapLayerMock;
      } else {
        throw new Error('getLayer: LayerId not found in map mock:' + layerId);
      }
    };

    return [mapLayerMock, rokasBackgroundLayerMock];
  }
});
