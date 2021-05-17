import { TestBed } from '@angular/core/testing';

import { SbbEsriTypesService } from '../esri-types/esri-types.service';

import { SbbGraphicService } from './graphic.service';

describe('GraphicService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SbbGraphicService, SbbEsriTypesService],
    })
  );

  it('should be created', () => {
    const service: SbbGraphicService = TestBed.inject(SbbGraphicService);
    expect(service).toBeTruthy();
  });
});
