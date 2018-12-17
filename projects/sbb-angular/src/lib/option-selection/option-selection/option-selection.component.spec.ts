import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSelectionComponent } from './option-selection.component';

describe('OptionSelectionComponent', () => {
  let component: OptionSelectionComponent;
  let fixture: ComponentFixture<OptionSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
