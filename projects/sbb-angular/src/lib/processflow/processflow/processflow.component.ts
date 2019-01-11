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

  @Output()
  stepChange: EventEmitter<ProcessflowStep> = new EventEmitter<ProcessflowStep>();

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

      this.changeStep(activeStepIndex - 1);
    }
  }

  private findActiveStepIndex(steps: ProcessflowStepComponent[]) {
    return steps.findIndex(s => !!s.active);
  }

  stepClick($event: any, stepIndex: number) {
    $event.preventDefault();
    this.changeStep(stepIndex);
  }

  changeStep(index: number) {
    const step = this.steps.toArray()[index];
    if (step) {

      this.steps.forEach((s, i) => {
        s.active = false;
      });
      step.active = true;
      this.changeDetectorRef.markForCheck();
      this.stepChange.emit(step.descriptor);
    }
  }

  disableStep(index: number) {
    const step = this.steps.toArray()[index];
    if (step) {
      step.disabled = true;
      if (step.active) {
        step.active = false;
        if (index > 0) {
          this.changeStep(index - 1);
        }
      }
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

}
