import { AnimationEvent } from '@angular/animations';
import { Directionality } from '@angular/cdk/bidi';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  CdkStep,
  CdkStepper,
  StepContentPositionState,
  StepperOptions,
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
  Directive,
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
  TemplateRef,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SbbErrorStateMatcher } from '@sbb-esta/angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { sbbProcessflowAnimations } from './processflow-animations';
import { SbbProcessflowIcon, SbbProcessflowIconContext } from './processflow-icon';
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
    @Inject(forwardRef(() => SbbProcessflow)) stepper: SbbProcessflow,
    @SkipSelf() private _errorStateSbbcher: SbbErrorStateMatcher,
    private _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(STEPPER_GLOBAL_OPTIONS) stepperOptions?: StepperOptions
  ) {
    super(stepper, stepperOptions);
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
    const originalErrorState = this._errorStateSbbcher.isErrorState(control, form);

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
  templateUrl: 'stepper.html',
  styleUrls: ['stepper.css'],
  inputs: ['selectedIndex'],
  host: {
    '[class.sbb-processflow-horizontal]': 'orientation === "horizontal"',
    '[class.sbb-processflow-vertical]': 'orientation === "vertical"',
    '[class.sbb-processflow-label-position-end]':
      'orientation === "horizontal" && labelPosition == "end"',
    '[class.sbb-processflow-label-position-bottom]':
      'orientation === "horizontal" && labelPosition == "bottom"',
    '[attr.aria-orientation]': 'orientation',
    role: 'tablist',
  },
  animations: [
    sbbProcessflowAnimations.horizontalStepTransition,
    sbbProcessflowAnimations.verticalStepTransition,
  ],
  providers: [{ provide: CdkStepper, useExisting: SbbProcessflow }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbProcessflow extends CdkStepper implements AfterContentInit {
  /** The list of step headers of the steps in the stepper. */
  @ViewChildren(SbbStepHeader) _stepHeader: QueryList<SbbStepHeader>;

  /** Full list of steps inside the stepper, including inside nested steppers. */
  @ContentChildren(SbbStep, { descendants: true }) _steps: QueryList<SbbStep>;

  /** Steps that belong to the current stepper, excluding ones from nested steppers. */
  readonly steps: QueryList<SbbStep> = new QueryList<SbbStep>();

  /** Custom icon overrides passed in by the consumer. */
  @ContentChildren(SbbProcessflowIcon, { descendants: true }) _icons: QueryList<SbbProcessflowIcon>;

  /** Event emitted when the current step is done transitioning in. */
  @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Whether the label should display in bottom or end position.
   * Only applies in the `horizontal` orientation.
   */
  @Input()
  labelPosition: 'bottom' | 'end' = 'end';

  /** Consumer-specified template-refs to be used to override the header icons. */
  _iconOverrides: Record<string, TemplateRef<SbbProcessflowIconContext>> = {};

  /** Stream of animation `done` events when the body expands/collapses. */
  readonly _animationDone = new Subject<AnimationEvent>();

  constructor(
    @Optional() dir: Directionality,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) document: any
  ) {
    super(dir, changeDetectorRef, elementRef, document);
    const nodeName = elementRef.nativeElement.nodeName.toLowerCase();
    this.orientation = nodeName === 'sbb-vertical-stepper' ? 'vertical' : 'horizontal';
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._icons.forEach(({ name, templateRef }) => (this._iconOverrides[name] = templateRef));

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
