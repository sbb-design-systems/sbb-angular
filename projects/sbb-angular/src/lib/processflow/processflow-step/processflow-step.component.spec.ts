import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessflowStepComponent } from './processflow-step.component';

describe('ProcessflowStepComponent', () => {
  let component: ProcessflowStepComponent;
  let fixture: ComponentFixture<ProcessflowStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessflowStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessflowStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
