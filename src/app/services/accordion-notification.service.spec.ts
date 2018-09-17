import { TestBed } from '@angular/core/testing';

import { AccordionNotificationService } from './accordion-notification.service';

describe('AccordionNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccordionNotificationService = TestBed.get(AccordionNotificationService);
    expect(service).toBeTruthy();
  });
});
