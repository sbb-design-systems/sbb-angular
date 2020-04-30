import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Directive, Input } from '@angular/core';

export class ProcessflowStep {
  /** Title of a step in a process flow. */
  title: string;
  /** Refers to the active status of a step in a process flow. */
  active = false;
  /** Refers to the disable status of a step in a process flow.  */
  disabled = true;
}

@Directive()
export abstract class ProcessflowStepBase {
  /** Refers to the processFlowStep istance. */
  descriptor: ProcessflowStep = new ProcessflowStep();
  /** Title of a step in a process flow. */
  @Input()
  set title(value: string) {
    this.descriptor.title = value;
    this._changeDetectorRef.markForCheck();
  }
  get title() {
    return this.descriptor.title;
  }
  /** Refers to the active status of a step in a process flow.  */
  @Input()
  set active(value: boolean) {
    this.descriptor.active = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  get active() {
    return this.descriptor.active;
  }
  /** Refers to the disable status of a step in a process flow.  */
  @Input()
  set disabled(value: boolean) {
    this.descriptor.disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  get disabled() {
    return this.descriptor.disabled;
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  // tslint:disable: member-ordering
  static ngAcceptInputType_active: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  // tslint:enable: member-ordering
}
