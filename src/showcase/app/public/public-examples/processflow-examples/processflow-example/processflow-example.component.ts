import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ProcessflowComponent, ProcessflowStep } from '@sbb-esta/angular-public/processflow';

@Component({
  selector: 'sbb-processflow-example',
  templateUrl: './processflow-example.component.html',
  styleUrls: ['./processflow-example.component.css']
})
export class ProcessflowExampleComponent implements AfterViewInit {
  @ViewChild('processflow', { static: true }) processflow: ProcessflowComponent;

  ngAfterViewInit(): void {
    this.processflow.stepChange.subscribe((s: ProcessflowStep) => {
      console.log(s.title);
    });
  }
}
