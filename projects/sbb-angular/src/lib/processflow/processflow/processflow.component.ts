import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef, HostBinding } from '@angular/core';

export interface ProcessflowStep {
  title: string;
  active: boolean;
  disabled: boolean;
}

@Component({
  selector: 'sbb-processflow',
  templateUrl: './processflow.component.html',
  styleUrls: ['./processflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowComponent {

  /** @docs-private */
  @HostBinding('class.sbb-processflow')
  cssClass = true;

  @Input()
  steps: ProcessflowStep[] = [];

  @Output()
  stepChange: EventEmitter<ProcessflowStep>;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  changeStep(step: ProcessflowStep) {
    this.steps.forEach((s) => {
      s.active = false;
    });
    step.active = true;
    this.changeDetectorRef.markForCheck();
    this.stepChange.emit(step);
  }
}
