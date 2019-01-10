import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export class ProcessflowStep {
  title: string;
  active = false;
  disabled = true;
}

@Component({
  selector: 'sbb-processflow-step',
  templateUrl: './processflow-step.component.html',
  styleUrls: ['./processflow-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowStepComponent {

  descriptor: ProcessflowStep = new ProcessflowStep();

  @Input()
  set title(value: string) {
    this.descriptor.title = value;
  }
  get title() {
    return this.descriptor.title;
  }

  @Input()
  set active(value: boolean) {
    this.descriptor.active = coerceBooleanProperty(value);
    this.changeDetectorRef.markForCheck();
  }
  get active() {
    return this.descriptor.active;
  }

  @Input()
  set disabled(value: boolean) {
    this.descriptor.disabled = coerceBooleanProperty(value);
    this.changeDetectorRef.markForCheck();
  }
  get disabled() {
    return this.descriptor.disabled;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}
}
