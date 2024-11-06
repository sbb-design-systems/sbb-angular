import { AnimationEvent } from '@angular/animations';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { CdkStep, CdkStepper, StepContentPositionState } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SbbErrorStateMatcher } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
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
  standalone: true,
  imports: [CdkPortalOutlet],
})
export class SbbStep extends CdkStep implements SbbErrorStateMatcher, AfterContentInit, OnDestroy {
  private _errorStateMatcher = inject(SbbErrorStateMatcher, { skipSelf: true });
  private _viewContainerRef = inject(ViewContainerRef);
  private _isSelected = Subscription.EMPTY;

  /** Content for step label given by `<ng-template sbbStepLabel>`. */
  // We need an initializer here to avoid a TS error.
  @ContentChild(SbbStepLabel) override stepLabel: SbbStepLabel = undefined!;

  /** Content that will be rendered lazily. */
  @ContentChild(SbbStepContent, { static: false }) _lazyContent: SbbStepContent;

  /** Currently-attached portal containing the lazy content. */
  _portal: TemplatePortal;

  ngAfterContentInit() {
    this._isSelected = this._stepper.steps.changes
      .pipe(
        switchMap(() => {
          return this._stepper.selectionChange.pipe(
            map((event) => event.selectedStep === this),
            startWith(this._stepper.selected === this),
          );
        }),
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
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
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
    '[attr.aria-orientation]': 'orientation',
    role: 'tablist',
  },
  animations: [sbbProcessflowAnimations.stepTransition],
  providers: [{ provide: CdkStepper, useExisting: SbbProcessflow }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SbbStepHeader, SbbIcon, NgTemplateOutlet],
})
export class SbbProcessflow extends CdkStepper implements AfterContentInit {
  /** The list of step headers of the steps in the processflow. */
  // We need an initializer here to avoid a TS error.
  @ViewChildren(SbbStepHeader) override _stepHeader: QueryList<SbbStepHeader> = undefined!;
  @ViewChild('stepListContainer', { static: true }) _tabListContainer: ElementRef;

  /** Full list of steps inside the processflow, including inside nested processflows. */
  // We need an initializer here to avoid a TS error.
  @ContentChildren(SbbStep, { descendants: true }) override _steps: QueryList<SbbStep> = undefined!;

  /** Steps that belong to the current processflow, excluding ones from nested processflows. */
  override readonly steps: QueryList<SbbStep> = new QueryList<SbbStep>();

  /** Event emitted when the current step is done transitioning in. */
  @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();

  /** Stream of animation `done` events when the body expands/collapses. */
  readonly _animationDone = new Subject<AnimationEvent>();

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    // Mark the component for change detection whenever the content children query changes
    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._stateChanged();
    });

    this.selectionChange.pipe(takeUntil(this._destroyed)).subscribe((selection) => {
      this._scrollToLabel(selection.selectedIndex);
    });

    this._animationDone
      .pipe(
        // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
        // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
        // See https://github.com/angular/angular/issues/24084
        distinctUntilChanged((x, y) => x.fromState === y.fromState && x.toState === y.toState),
        takeUntil(this._destroyed),
      )
      .subscribe((event) => {
        if ((event.toState as StepContentPositionState) === 'current') {
          this.animationDone.emit();
        }
      });
  }

  /**
   * Moves the tab list such that the desired tab label (marked by index) is moved into view.
   */
  _scrollToLabel(labelIndex: number) {
    const selectedLabel = this._stepHeader ? this._stepHeader.toArray()[labelIndex] : null;
    if (!selectedLabel) {
      return;
    }

    const containerElement = this._tabListContainer.nativeElement;
    // The view length is the visible width of the tab labels.
    const viewLength = containerElement.offsetWidth;
    const { offsetLeft, offsetWidth } = selectedLabel._elementRef.nativeElement;

    // The offset is off by 24 pixels, which we have to manually remove.
    const labelBeforePos = offsetLeft - 24;
    const labelAfterPos = labelBeforePos + offsetWidth;

    if (labelBeforePos < containerElement.scrollLeft) {
      containerElement.scrollTo({ left: labelBeforePos, behavior: 'smooth' });
    } else if (viewLength + containerElement.scrollLeft < labelAfterPos) {
      containerElement.scrollTo({ left: labelAfterPos - viewLength, behavior: 'smooth' });
    }
  }
}
