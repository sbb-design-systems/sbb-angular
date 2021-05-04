import { TestBed } from '@angular/core/testing';

import { SbbGraphicService } from './graphic.service';

describe('GraphicService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SbbGraphicService],
    })
  );

  it('should be created', () => {
    const service: SbbGraphicService = TestBed.inject(SbbGraphicService);
    expect(service).toBeTruthy();
  });
});
