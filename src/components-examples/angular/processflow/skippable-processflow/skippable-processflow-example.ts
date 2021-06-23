import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbProcessflow, SbbProcessflowStep } from '@sbb-esta/angular/processflow';

/**
 * @title Skippable Processflow
 * @order 30
 */
@Component({
  selector: 'sbb-skippable-processflow-example',
  templateUrl: './skippable-processflow-example.html',
})
export class SkippableProcessflowExample implements AfterViewInit {
  @ViewChild('processflow', { static: true }) processflow: SbbProcessflow;

  ngAfterViewInit(): void {
    this.processflow.stepChange.subscribe((s: SbbProcessflowStep) => {
      console.log(s.title);
    });
  }

  reset() {
    this.processflow.reset();
  }
}
