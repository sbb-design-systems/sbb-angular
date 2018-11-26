import { TestBed, inject } from '@angular/core/testing';

import { SbbSpinnerService } from './sbb-spinner.service';

describe('SbbSpinnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SbbSpinnerService]
    });
  });

  it('should be created', inject([SbbSpinnerService], (service: SbbSpinnerService) => {
    expect(service).toBeTruthy();
  }));
});
