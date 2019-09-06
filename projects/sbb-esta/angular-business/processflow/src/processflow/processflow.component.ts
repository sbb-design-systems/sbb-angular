import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import { ProcessflowComponent as ProcessflowComponentPublic } from '@sbb-esta/angular-public';

import {
  ProcessflowStep,
  ProcessflowStepComponent
} from '../processflow-step/processflow-step.component';

@Component({
  selector: 'sbb-processflow',
  templateUrl:
    '../../../../../angular-public/src/lib/processflow/processflow/processflow.component.html',
  styleUrls: [
    '../../../../../angular-public/src/lib/processflow/processflow/processflow.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowComponent extends ProcessflowComponentPublic implements AfterContentInit {
  /** Event emitted to the change of step in the process flow. */
  @Output()
  stepChange: EventEmitter<ProcessflowStep> = new EventEmitter<ProcessflowStep>();
  /** Refers to the steps of process flow. */
  @ContentChildren(ProcessflowStepComponent)
  steps: QueryList<ProcessflowStepComponent>;

  private _skippable = false;
  /** Refers to the skippable status of a step in a process flow.  */
  @Input()
  set skippable(value: boolean) {
    this._skippable = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  get skippable() {
    return this._skippable;
  }

  constructor(protected _changeDetectorRef: ChangeDetectorRef) {
    super(_changeDetectorRef);
  }

  ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.setSkippableSteps();
  }

  setSkippableSteps() {
    if (this.skippable) {
      this.steps.forEach(s => {
        s.disabled = false;
      });
    }
  }

  stepClick($event: any, stepIndex: number) {
    $event.preventDefault();
    const currentIndex = super._findActiveStepIndex(this.steps.toArray());
    if (stepIndex < currentIndex || this.skippable) {
      this.changeStep(stepIndex);
    }
  }

  changeStep(index: number) {
    const step = this.steps.toArray()[index];
    if (step) {
      this.steps.forEach((s, i) => {
        s.active = false;
        if (i > index && !this.skippable) {
          s.disabled = true;
        }
      });
      step.active = true;
      this._changeDetectorRef.markForCheck();
      this.stepChange.emit(step.descriptor);
    }
  }

  prevStep() {
    const activeStepIndex = this._findActiveStepIndex(this.steps.toArray());
    if (activeStepIndex > 0) {
      if (!this.skippable) {
        this.disableStep(activeStepIndex);
      }
      this.changeStep(activeStepIndex - 1);
    }
  }
}
