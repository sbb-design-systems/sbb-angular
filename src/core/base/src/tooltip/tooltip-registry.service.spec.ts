import { TestBed } from '@angular/core/testing';

import { TooltipRegistryService } from './tooltip-registry.service';

describe('TooltipRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TooltipRegistryService = TestBed.inject(TooltipRegistryService);
    expect(service).toBeTruthy();
  });

  it('should emit when calling activate', () => {
    const service: TooltipRegistryService = TestBed.inject(TooltipRegistryService);
    let count = 0;
    service.tooltipActivation.subscribe(() => count++);
    service.activate();
    expect(count).toBe(1);
  });
});
