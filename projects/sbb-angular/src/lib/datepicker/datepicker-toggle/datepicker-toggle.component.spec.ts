import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerToggleComponent } from './datepicker-toggle.component';

describe('DatepickerToggleComponent', () => {
  let component: DatepickerToggleComponent;
  let fixture: ComponentFixture<DatepickerToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
