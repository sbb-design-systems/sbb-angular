import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbProcessflow, SbbProcessflowStep } from '@sbb-esta/angular/processflow';

/**
 * @title Processflow
 * @order 10
 */
@Component({
  selector: 'sbb-processflow-example',
  templateUrl: './processflow-example.html',
})
export class ProcessflowExample implements AfterViewInit {
  @ViewChild('processflow', { static: true }) processflow: SbbProcessflow;

  ngAfterViewInit(): void {
    this.processflow.stepChange.subscribe((s: SbbProcessflowStep) => {
      console.log(s.title);
    });
  }
}
