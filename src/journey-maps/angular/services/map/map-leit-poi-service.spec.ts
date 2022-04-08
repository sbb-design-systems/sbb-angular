import { SbbMapLeitPoiService } from './map-leit-poi-service';

describe('MapLeitPoiService', () => {
  let service: SbbMapLeitPoiService;

  beforeEach(() => {
    service = new SbbMapLeitPoiService({} as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
