import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessflowComponent } from './processflow.component';
import { IconCommonModule } from '../../svg-icons-components/icon-common.module';
import { Component, ViewChild } from '@angular/core';


@Component({
  selector: 'sbb-processflow-test',
  templateUrl: './processflow-showcase.component.html',
  styleUrls: ['./processflow-showcase.component.scss']
})
export class ProcessflowTestComponent {

  @ViewChild('processflow') processflow: ProcessflowComponent;
}

fdescribe('ProcessflowComponent', () => {
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
