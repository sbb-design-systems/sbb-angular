import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ProcessflowStep, ProcessflowComponent } from 'projects/sbb-angular/src/public_api';

@Component({
  selector: 'sbb-processflow-showcase',
  templateUrl: './processflow-showcase.component.html',
  styleUrls: ['./processflow-showcase.component.scss']
})
export class ProcessflowShowcaseComponent implements AfterViewInit {

  logs: string[] = [];
  logText: string;

  steps: ProcessflowStep[] = [
    { title: '1. Verbindung', active: true, disabled: false },
    { title: '2. Reisedaten', active: false, disabled: true },
    { title: '3. Zahlung', active: false, disabled: true },
    { title: '4. Bestätigung', active: false, disabled: true }

  ];

  @ViewChild('processflow') processflow: ProcessflowComponent;

  ngAfterViewInit(): void {
    this.processflow.stepChange.subscribe((s: ProcessflowStep) => {
      this.logs.push('Step changed to ' + s.title);
      this.logText = this.logs.reverse().join('\n');
    });
  }

}
