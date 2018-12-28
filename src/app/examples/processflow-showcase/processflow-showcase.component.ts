import { Component, OnInit } from '@angular/core';
import { ProcessflowStep } from 'projects/sbb-angular/src/public_api';

@Component({
  selector: 'sbb-processflow-showcase',
  templateUrl: './processflow-showcase.component.html',
  styleUrls: ['./processflow-showcase.component.scss']
})
export class ProcessflowShowcaseComponent {

  steps: ProcessflowStep[] = [
    { title: '1. Intro', active: true, disabled: false },
    { title: '2. Chapter 1', active: false, disabled: true }
  ];
}
