import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  HostBinding,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { ProcessflowStepComponent, ProcessflowStep } from '../processflow-step/processflow-step.component';

@Component({
  selector: 'sbb-processflow',
  templateUrl: './processflow.component.html',
  styleUrls: ['./processflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowComponent implements AfterContentInit {

  /** @docs-private */
  @HostBinding('class.sbb-processflow')
  cssClass = true;
  /** Event emitted to the change of step in the process flow. */
  @Output()
  stepChange: EventEmitter<ProcessflowStep> = new EventEmitter<ProcessflowStep>();
  /** Refers to the steps of process flow. */
  @ContentChildren(ProcessflowStepComponent)
  steps: QueryList<ProcessflowStepComponent>;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterContentInit(): void {
    if (this.steps && this.steps.length) {
      this.steps.first.active = true;
      this.steps.first.disabled = false;
    }
  }

  nextStep() {
    const activeStepIndex = this.findActiveStepIndex(this.steps.toArray());
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
      this.stepChange.emit(this.steps.toArray()[activeStepIndex + 1]);
    }
  }

  prevStep() {
    const activeStepIndex = this.findActiveStepIndex(this.steps.toArray());
    if (activeStepIndex > 0) {
      this.disableStep(activeStepIndex);
      this.changeStep(activeStepIndex - 1);
    }
  }

  private findActiveStepIndex(steps: ProcessflowStepComponent[]) {
    return steps.findIndex(s => !!s.active);
  }
  /**
   * Method to change on a step with a click.
   * @param $event Event generated at the click on a step.
   * @param stepIndex Index of a step.
   */
  stepClick($event: any, stepIndex: number) {
    $event.preventDefault();
    this.changeStep(stepIndex);
  }
  /**
   * Method to change a step in a process flow.
   * @param index Index of the step to change.
   */
  changeStep(index: number) {
    const step = this.steps.toArray()[index];
    if (step) {
      this.steps.forEach((s, i) => {
        s.active = false;
        if (i > index) {
          s.disabled = true;
        }
      });
      step.active = true;
      this.changeDetectorRef.markForCheck();
      this.stepChange.emit(step.descriptor);
    }
  }
  /** Method to disable a step in a process flow.
   * @param index Index of the step to disable.
  */
  disableStep(index: number) {
    const step = this.steps.toArray()[index];
    if (step) {
      step.disabled = true;
      this.changeDetectorRef.markForCheck();
    }
  }

  reset() {
    this.steps.forEach(s => {
      s.active = false;
      s.disabled = true;
    });
    this.ngAfterContentInit();
    this.changeDetectorRef.markForCheck();
  }

  getActiveStep() {
    if (this.steps && this.steps.length) {
      const activeStepIndex = this.findActiveStepIndex(this.steps.toArray());
      if (activeStepIndex > -1) {
        return this.steps.toArray()[activeStepIndex];
      }
    }
    return null;
  }

}
