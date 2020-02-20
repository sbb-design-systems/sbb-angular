import { TestBed } from '@angular/core/testing';

import { EsriTypesService } from '../esri-types/esri-types.service';

import { HitTestService } from './hit-test.service';

describe('HitTestService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HitTestService, EsriTypesService]
    })
  );

  it('should be created', () => {
    const service: HitTestService = TestBed.inject(HitTestService);
    expect(service).toBeTruthy();
  });
});
