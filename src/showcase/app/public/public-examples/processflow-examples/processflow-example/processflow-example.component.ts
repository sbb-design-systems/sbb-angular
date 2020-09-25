import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbProcessflow, SbbProcessflowStep } from '@sbb-esta/angular-public/processflow';

@Component({
  selector: 'sbb-processflow-example',
  templateUrl: './processflow-example.component.html',
})
export class ProcessflowExampleComponent implements AfterViewInit {
  @ViewChild('processflow', { static: true }) processflow: SbbProcessflow;

  ngAfterViewInit(): void {
    this.processflow.stepChange.subscribe((s: SbbProcessflowStep) => {
      console.log(s.title);
    });
  }
}
