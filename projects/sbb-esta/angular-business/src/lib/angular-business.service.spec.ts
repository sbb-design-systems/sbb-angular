import { TestBed } from '@angular/core/testing';

import { AngularBusinessService } from './angular-business.service';

describe('AngularBusinessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularBusinessService = TestBed.get(AngularBusinessService);
    expect(service).toBeTruthy();
  });
});
