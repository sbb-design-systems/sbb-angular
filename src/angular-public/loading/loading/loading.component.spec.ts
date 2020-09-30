import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbLoading } from './loading.component';

describe('LoadingComponent', () => {
  let component: SbbLoading;
  let fixture: ComponentFixture<SbbLoading>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbbLoading],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
