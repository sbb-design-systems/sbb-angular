import { TestBed } from '@angular/core/testing';

import { ComponentUiService } from './component-ui.service';

describe('ComponentUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentUiService = TestBed.get(ComponentUiService);
    expect(service).toBeTruthy();
  });
});
