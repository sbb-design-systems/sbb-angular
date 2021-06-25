import { AnimationEvent } from '@angular/animations';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  CdkStep,
  CdkStepper,
  StepContentPositionState,
  StepperOptions,
  StepperOrientation,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SbbErrorStateMatcher } from '@sbb-esta/angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { sbbProcessflowAnimations } from './processflow-animations';
import { SbbStepContent } from './step-content';
import { SbbStepHeader } from './step-header';
import { SbbStepLabel } from './step-label';

@Component({
  selector: 'sbb-step',
  templateUrl: 'step.html',
  providers: [
    { provide: SbbErrorStateMatcher, useExisting: SbbStep },
    { provide: CdkStep, useExisting: SbbStep },
  ],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbStep',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbStep extends CdkStep implements SbbErrorStateMatcher, AfterContentInit, OnDestroy {
  private _isSelected = Subscription.EMPTY;

  /** Content for step label given by `<ng-template sbbStepLabel>`. */
  @ContentChild(SbbStepLabel) stepLabel: SbbStepLabel;

  /** Content that will be rendered lazily. */
  @ContentChild(SbbStepContent, { static: false }) _lazyContent: SbbStepContent;

  /** Currently-attached portal containing the lazy content. */
  _portal: TemplatePortal;

  constructor(
    @Inject(forwardRef(() => SbbProcessflow)) processflow: SbbProcessflow,
    @SkipSelf() private _errorStateMatcher: SbbErrorStateMatcher,
    private _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(STEPPER_GLOBAL_OPTIONS) processflowOptions?: StepperOptions
  ) {
    super(processflow, processflowOptions);
  }

  ngAfterContentInit() {
    this._isSelected = this._stepper.steps.changes
      .pipe(
        switchMap(() => {
          return this._stepper.selectionChange.pipe(
            map((event) => event.selectedStep === this),
            startWith(this._stepper.selected === this)
          );
        })
      )
      .subscribe((isSelected) => {
        if (isSelected && this._lazyContent && !this._portal) {
          this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef!);
        }
      });
  }

  ngOnDestroy() {
    this._isSelected.unsubscribe();
  }

  /** Custom error state matcher that additionally checks for validity of interacted form. */
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this._errorStateMatcher.isErrorState(control, form);

    // Custom error state checks for the validity of form that is not submitted or touched
    // since user can trigger a form change by calling for another step without directly
    // interacting with the current form.
    const customErrorState = !!(control && control.invalid && this.interacted);

    return originalErrorState || customErrorState;
  }
}

@Component({
  selector: 'sbb-processflow, [sbbProcessflow]',
  exportAs: 'sbbProcessflow',
  templateUrl: 'processflow.html',
  styleUrls: ['processflow.css'],
  inputs: ['selectedIndex'],
  host: {
    class: 'sbb-processflow',
    role: 'tablist',
  },
  animations: [sbbProcessflowAnimations.stepTransition],
  providers: [{ provide: CdkStepper, useExisting: SbbProcessflow }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbProcessflow extends CdkStepper implements AfterContentInit {
  /** The list of step headers of the steps in the processflow. */
  @ViewChildren(SbbStepHeader) _stepHeader: QueryList<SbbStepHeader>;

  /** Full list of steps inside the processflow, including inside nested processflows. */
  @ContentChildren(SbbStep, { descendants: true }) _steps: QueryList<SbbStep>;

  /** Steps that belong to the current processflow, excluding ones from nested processflows. */
  readonly steps: QueryList<SbbStep> = new QueryList<SbbStep>();

  /** Event emitted when the current step is done transitioning in. */
  @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();

  /** Stream of animation `done` events when the body expands/collapses. */
  readonly _animationDone = new Subject<AnimationEvent>();

  /** Not available for the SBB implementation. */
  set orientation(_value: StepperOrientation) {}

  constructor(
    @Optional() dir: Directionality,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) document: any
  ) {
    super(dir, changeDetectorRef, elementRef, document);
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    // Mark the component for change detection whenever the content children query changes
    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._stateChanged();
    });

    this._animationDone
      .pipe(
        // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
        // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
        // See https://github.com/angular/angular/issues/24084
        distinctUntilChanged((x, y) => x.fromState === y.fromState && x.toState === y.toState),
        takeUntil(this._destroyed)
      )
      .subscribe((event) => {
        if ((event.toState as StepContentPositionState) === 'current') {
          this.animationDone.emit();
        }
      });
  }
}
