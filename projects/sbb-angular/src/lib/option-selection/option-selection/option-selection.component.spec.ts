import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSelectionComponent } from './option-selection.component';
import { OptionSelectionModule } from '../option-selection.module';

fdescribe('OptionSelectionComponent', () => {
  let component: OptionSelectionComponent;
  let fixture: ComponentFixture<OptionSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OptionSelectionModule
      ],
      declarations: [

      ]
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
