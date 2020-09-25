import { TestBed } from '@angular/core/testing';

import { SbbEsriTypesService } from '../esri-types/esri-types.service';

import { SbbHitTestService } from './hit-test.service';

describe('HitTestService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SbbHitTestService, SbbEsriTypesService],
    })
  );

  it('should be created', () => {
    const service: SbbHitTestService = TestBed.inject(SbbHitTestService);
    expect(service).toBeTruthy();
  });
});
