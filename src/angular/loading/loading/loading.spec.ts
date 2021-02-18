import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbLoading } from './loading';

describe('SbbLoading', () => {
  let component: SbbLoading;
  let fixture: ComponentFixture<SbbLoading>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbLoading],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
