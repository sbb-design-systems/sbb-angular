import { TestBed } from '@angular/core/testing';

import { SbbTooltipRegistryService } from './tooltip-registry.service';

describe('TooltipRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SbbTooltipRegistryService = TestBed.inject(SbbTooltipRegistryService);
    expect(service).toBeTruthy();
  });

  it('should emit when calling activate', () => {
    const service: SbbTooltipRegistryService = TestBed.inject(SbbTooltipRegistryService);
    let count = 0;
    service.tooltipActivation.subscribe(() => count++);
    service.activate();
    expect(count).toBe(1);
  });
});
