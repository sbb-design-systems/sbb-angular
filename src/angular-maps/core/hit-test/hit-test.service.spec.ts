import { TestBed } from '@angular/core/testing';

import { SbbHitTestService } from './hit-test.service';

describe('HitTestService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SbbHitTestService],
    })
  );

  it('should be created', () => {
    const service: SbbHitTestService = TestBed.inject(SbbHitTestService);
    expect(service).toBeTruthy();
  });
});
