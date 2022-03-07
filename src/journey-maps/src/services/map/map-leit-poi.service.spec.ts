import {MapLeitPoiService} from './map-leit-poi.service';

describe('MapLeitPoiService', () => {
  let service: MapLeitPoiService;

  beforeEach(() => {
    service = new MapLeitPoiService(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
