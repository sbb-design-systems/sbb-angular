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
  stepChange: EventEmitter<ProcessflowStep> = new EventEmitter<ProcessflowStep>();

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  nextStep() {
    const activeStepIndex = this.findActiveStep(this.steps);
    let activatedStep = false;
    if (activeStepIndex < this.steps.length - 1) {
      this.steps.forEach((s, i) => {
        if (i > activeStepIndex && !activatedStep) {
          s.active = true;
          s.disabled = false;
          activatedStep = true;
        } else {
          s.active = false;
        }
      });
      this.changeDetectorRef.markForCheck();
      this.stepChange.emit(this.steps[activeStepIndex + 1]);
    }
  }

  private findActiveStep(steps: ProcessflowStep[]) {
    return steps.findIndex(s => !!s.active);
  }

  stepClick($event: any, stepIndex: number) {
    $event.preventDefault();
    this.changeStep(stepIndex);
  }

  changeStep(index: number) {
    const step = this.steps[index];
    this.steps.forEach((s, i) => {
      s.active = false;
    });
    step.active = true;
    this.changeDetectorRef.markForCheck();
    this.stepChange.emit(step);
  }

  disableStep(index: number) {
    const step = this.steps[index];
    step.disabled = true;
    this.changeDetectorRef.markForCheck();

  }

}
