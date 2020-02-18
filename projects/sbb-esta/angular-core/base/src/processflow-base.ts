import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  Output,
  QueryList
} from '@angular/core';

import { ProcessflowStep, ProcessflowStepBase } from './processflow-step-base';

@Directive()
export abstract class ProcessflowBase<TProcessflowStepComponent extends ProcessflowStepBase>
  implements AfterContentInit {
  /** @docs-private */
  @HostBinding('class.sbb-processflow')
  cssClass = true;
  /** Event emitted to the change of step in the process flow. */
  @Output()
  stepChange: EventEmitter<ProcessflowStep> = new EventEmitter<ProcessflowStep>();
  /** @docs-private */
  abstract steps: QueryList<TProcessflowStepComponent>;

  constructor(protected _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    if (this.steps && this.steps.length) {
      this.steps.first.active = true;
      this.steps.first.disabled = false;
    }
  }

  nextStep() {
    const activeStepIndex = this._findActiveStepIndex(this.steps.toArray());
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
      this._changeDetectorRef.markForCheck();
      this.stepChange.emit(this.steps.toArray()[activeStepIndex + 1]);
    }
  }

  prevStep() {
    const activeStepIndex = this._findActiveStepIndex(this.steps.toArray());
    if (activeStepIndex > 0) {
      this.disableStep(activeStepIndex);
      this.changeStep(activeStepIndex - 1);
    }
  }

  protected _findActiveStepIndex(steps: TProcessflowStepComponent[]) {
    return steps.findIndex(s => !!s.active);
  }

  /**
   * Method to change on a step with a click.
   * @param $event Event generated at the click on a step.
   * @param stepIndex Index of a step.
   */
  stepClick($event: any, stepIndex: number) {
    $event.preventDefault();
    const currentIndex = this._findActiveStepIndex(this.steps.toArray());
    if (stepIndex < currentIndex) {
      this.changeStep(stepIndex);
    }
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
      this._changeDetectorRef.markForCheck();
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
      this._changeDetectorRef.markForCheck();
    }
  }

  reset() {
    this.steps.forEach(s => {
      s.active = false;
      s.disabled = true;
    });
    this.ngAfterContentInit();
    this._changeDetectorRef.markForCheck();
  }

  getActiveStep() {
    if (this.steps && this.steps.length) {
      const activeStepIndex = this._findActiveStepIndex(this.steps.toArray());
      if (activeStepIndex > -1) {
        return this.steps.toArray()[activeStepIndex];
      }
    }
    return null;
  }
}
