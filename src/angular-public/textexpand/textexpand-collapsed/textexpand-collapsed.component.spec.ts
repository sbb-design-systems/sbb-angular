import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbTextexpandCollapsed } from './textexpand-collapsed.component';

describe('TextexpandCollapsedComponent', () => {
  let component: SbbTextexpandCollapsed;
  let fixture: ComponentFixture<SbbTextexpandCollapsed>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbbTextexpandCollapsed],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbTextexpandCollapsed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
