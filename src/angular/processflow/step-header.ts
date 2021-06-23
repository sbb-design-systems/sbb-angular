import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { CdkStepHeader, StepState } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { SbbProcessflowIconContext } from './processflow-icon';
import { SbbProcessflowIntl } from './processflow-intl';
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
})
export class SbbStepHeader extends CdkStepHeader implements AfterViewInit, OnDestroy {
  private _intlSubscription: Subscription;

  /** State of the given step. */
  @Input() state: StepState;

  /** Label of the given step. */
  @Input() label: SbbStepLabel | string;

  /** Error message to display when there's an error. */
  @Input() errorMessage: string;

  /** Overrides for the header icons, passed in via the stepper. */
  @Input() iconOverrides: { [key: string]: TemplateRef<SbbProcessflowIconContext> };

  /** Index of the given step. */
  @Input() index: number;

  /** Whether the given step is selected. */
  @Input() selected: boolean;

  /** Whether the given step label is active. */
  @Input() active: boolean;

  /** Whether the given step is optional. */
  @Input() optional: boolean;

  constructor(
    public _intl: SbbProcessflowIntl,
    private _focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);
    this._intlSubscription = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy() {
    this._intlSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the step header. */
  focus(origin?: FocusOrigin, options?: FocusOptions) {
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

  /** Template context variables that are exposed to the `sbbProcessflowIcon` instances. */
  _getIconContext(): SbbProcessflowIconContext {
    return {
      index: this.index,
      active: this.active,
      optional: this.optional,
    };
  }

  _getDefaultTextForState(state: StepState): string {
    if (state === 'number') {
      return `${this.index + 1}`;
    }
    if (state === 'edit') {
      return 'create';
    }
    if (state === 'error') {
      return 'warning';
    }
    return state;
  }
}
