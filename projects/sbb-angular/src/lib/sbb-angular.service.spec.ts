import { TestBed } from '@angular/core/testing';

import { SbbAngularService } from './sbb-angular.service';

describe('SbbAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SbbAngularService = TestBed.get(SbbAngularService);
    expect(service).toBeTruthy();
  });
});
