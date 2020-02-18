import { TestBed } from '@angular/core/testing';

import { EsriTypesService } from '../esri-types/esri-types.service';

import { GraphicService } from './graphic.service';

describe('GraphicService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [GraphicService, EsriTypesService]
    })
  );

  it('should be created', () => {
    const service: GraphicService = TestBed.inject(GraphicService);
    expect(service).toBeTruthy();
  });
});
