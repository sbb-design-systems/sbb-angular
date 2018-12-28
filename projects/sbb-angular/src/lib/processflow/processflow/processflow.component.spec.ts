import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessflowComponent } from './processflow.component';
import { IconCommonModule } from '../../svg-icons-components/icon-common.module';

describe('ProcessflowComponent', () => {
  let component: ProcessflowComponent;
  let fixture: ComponentFixture<ProcessflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCommonModule],
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
