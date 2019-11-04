import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMenuTriggerComponent } from './header-menu-trigger.component';

describe('HeaderMenuTriggerComponent', () => {
  let component: HeaderMenuTriggerComponent;
  let fixture: ComponentFixture<HeaderMenuTriggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderMenuTriggerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMenuTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
