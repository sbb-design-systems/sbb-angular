import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { SbbProcessflowBase } from '@sbb-esta/angular-core/base/processflow';

import { SbbProcessflowStep } from '../processflow-step/processflow-step.component';

// TODO: Find solution for template and style
@Component({
  selector: 'sbb-processflow',
  templateUrl: './processflow.component.html',
  styleUrls: ['./processflow.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-processflow',
  },
})
export class SbbProcessflow
  extends SbbProcessflowBase<SbbProcessflowStep>
  implements AfterContentInit {
  /** @docs-private */
  @ContentChildren(SbbProcessflowStep)
  steps: QueryList<SbbProcessflowStep>;

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
      this.steps.forEach((s) => (s.disabled = false));
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

  // tslint:disable: member-ordering
  static ngAcceptInputType_skippable: BooleanInput;
  // tslint:enable: member-ordering
}
