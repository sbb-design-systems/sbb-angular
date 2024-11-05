import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { CdkStepHeader, StepState } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import { SbbStepLabel } from './step-label';

@Component({
  selector: 'sbb-step-header',
  templateUrl: 'step-header.html',
  styleUrls: ['step-header.css'],
  host: {
    class: 'sbb-step-header',
    role: 'tab',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class SbbStepHeader extends CdkStepHeader implements AfterViewInit, OnDestroy {
  private _focusMonitor = inject(FocusMonitor);

  /** State of the given step. */
  @Input() state: StepState;

  /** Label of the given step. */
  @Input() label: SbbStepLabel | string;

  /** Index of the given step. */
  @Input() index: number;

  /** Whether the given step is selected. */
  @Input() selected: boolean;

  /** Whether the given step label is active. */
  @Input() active: boolean;

  /** Whether the given step is optional. */
  @Input() optional: boolean;

  /** Whether the given step is not editable and completed. */
  @Input() locked: boolean;

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the step header. */
  override focus(origin?: FocusOrigin, options?: FocusOptions) {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }

  /** Returns string label of given step if it is a text label. */
  _stringLabel(): string | null {
    return this.label instanceof SbbStepLabel ? null : this.label;
  }

  /** Returns SbbStepLabel if the label of given step is a template label. */
  _templateLabel(): SbbStepLabel | null {
    return this.label instanceof SbbStepLabel ? this.label : null;
  }

  /** Returns the host HTML element. */
  _getHostElement() {
    return this._elementRef.nativeElement;
  }
}
