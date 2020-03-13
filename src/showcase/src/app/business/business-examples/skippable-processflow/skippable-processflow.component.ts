import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ProcessflowComponent, ProcessflowStep } from '@sbb-esta/angular-business/processflow';

@Component({
  selector: 'sbb-skippable-processflow',
  templateUrl: './skippable-processflow.component.html',
  styleUrls: ['./skippable-processflow.component.css']
})
export class SkippableProcessflowComponent implements AfterViewInit {
  @ViewChild('processflow', { static: true }) processflow: ProcessflowComponent;

  ngAfterViewInit(): void {
    this.processflow.stepChange.subscribe((s: ProcessflowStep) => {
      console.log(s.title);
    });
  }

  reset() {
    this.processflow.reset();
  }
}
