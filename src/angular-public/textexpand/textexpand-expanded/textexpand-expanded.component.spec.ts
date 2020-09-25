import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbTextexpandExpanded } from './textexpand-expanded.component';

describe('TextexpandExpandedComponent', () => {
  let component: SbbTextexpandExpanded;
  let fixture: ComponentFixture<SbbTextexpandExpanded>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbbTextexpandExpanded],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbTextexpandExpanded);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
