import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerContentComponent } from './datepicker-content.component';

describe('DatepickerContentComponent', () => {
  let component: DatepickerContentComponent;
  let fixture: ComponentFixture<DatepickerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
