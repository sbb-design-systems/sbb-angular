import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbLoadingIndicator } from './loading-indicator';

describe('SbbLoadingIndicator', () => {
  let component: SbbLoadingIndicator;
  let fixture: ComponentFixture<SbbLoadingIndicator>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbLoadingIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
