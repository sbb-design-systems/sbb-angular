import {QueryMapFeaturesService} from './query-map-features.service';

describe('QueryMapFeaturesService', () => {
  let service: QueryMapFeaturesService;

  beforeEach(() => {
    service = new QueryMapFeaturesService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getVisibleLevels should return empty list if map source was not found', () => {
    const map: any = {
      getStyle: () => {
        return {sources: {}};
      }
    };
    const levels = service.getVisibleLevels(map);
    expect(levels.length).toBeFalsy();
  });

  it('getVisibleLevels should return empty list if feature floor_liststring is missing', () => {
    const map: any = {
      getStyle: () => {
        return {sources: {service_points: {}}};
      },
      querySourceFeatures: () => {
        return [{id: 1, properties: {}}];
      }
    };
    const levels = service.getVisibleLevels(map);
    expect(levels.length).toBeFalsy();
  });

  it('getVisibleLevels should return 3 levels ordered desc for feature with a floor_liststring=-4,-1,0', () => {
    const map: any = {
      getStyle: () => {
        return {sources: {service_points: {}}};
      },
      querySourceFeatures: () => {
        return [{id: 1, properties: {floor_liststring: '-4,-1,0'}}];
      }
    };
    const levels = service.getVisibleLevels(map);
    expect(levels.length).toEqual(3);
    expect(JSON.stringify(levels)).toEqual('[0,-1,-4]');
  });

  it('getVisibleLevels should merge level lists if multiple features were found', () => {
    const map: any = {
      getStyle: () => {
        return {sources: {service_points: {}}};
      },
      querySourceFeatures: () => {
        return [
          {id: 1, properties: {floor_liststring: '-1,0,1'}},
          {id: 2, properties: {floor_liststring: '-4,-2,-1,0'}},
        ];
      }
    };
    const levels = service.getVisibleLevels(map);
    expect(levels.length).toEqual(5);
    expect(JSON.stringify(levels)).toEqual('[1,0,-1,-2,-4]');
  });
});
