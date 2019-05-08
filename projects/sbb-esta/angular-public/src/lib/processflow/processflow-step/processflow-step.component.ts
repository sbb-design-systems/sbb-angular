import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

export class ProcessflowStep {
  /** Title of a step in a process flow. */
  title: string;
  /** Refers to the active status of a step in a process flow. */
  active = false;
  /** Refers to the disable status of a step in a process flow.  */
  disabled = true;
}

@Component({
  selector: 'sbb-processflow-step',
  templateUrl: './processflow-step.component.html',
  styleUrls: ['./processflow-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowStepComponent {
  /** Refers to the processFlowStep istance. */
  descriptor: ProcessflowStep = new ProcessflowStep();
  /** Title of a step in a process flow. */
  @Input()
  set title(value: string) {
    this.descriptor.title = value;
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
}
