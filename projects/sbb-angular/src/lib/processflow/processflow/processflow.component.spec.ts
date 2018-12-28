import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessflowComponent } from './processflow.component';

describe('ProcessflowComponent', () => {
  let component: ProcessflowComponent;
  let fixture: ComponentFixture<ProcessflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
