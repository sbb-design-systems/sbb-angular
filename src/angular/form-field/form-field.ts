import { _IdGenerator } from '@angular/cdk/a11y';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  ContentChild,
  ContentChildren,
  ElementRef,
  inject,
  InjectionToken,
  input,
  InputSignal,
  OnDestroy,
  QueryList,
  Signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControlDirective } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { filter, map, pairwise, startWith, takeUntil } from 'rxjs/operators';

import { SbbError, SBB_ERROR } from './error';
import { SbbFormFieldControl } from './form-field-control';
import { getSbbFormFieldMissingControlError } from './form-field-errors';
import { SbbLabel } from './label';

/**
 * Injection token that can be used to inject an instances of `SbbFormField`. It serves
 * as alternative token to the actual `SbbFormField` class which would cause unnecessary
 * retention of the `SbbFormField` class and its component metadata.
 */
export const SBB_FORM_FIELD = new InjectionToken<SbbFormField>('SBB_FORM_FIELD');

@Component({
  selector: 'sbb-form-field',
  exportAs: 'sbbFormField',
  templateUrl: './form-field.html',
  styleUrls: ['./form-field.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: SBB_FORM_FIELD, useExisting: SbbFormField }],
  host: {
    class: 'sbb-form-field',
    '[class.sbb-form-field-invalid]': '_control?.errorState',
    '[class.sbb-form-field-disabled]': '_control?.disabled',
    '[class.sbb-focused]': '_control?.focused',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")',
  },
})
export class SbbFormField implements AfterContentInit, AfterContentChecked, OnDestroy {
  _elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  /** The label text for the input. */
  label: InputSignal<string | undefined> = input<string>();

  private _destroyed = new Subject<void>();

  // Unique id for the label element.
  readonly _labelId = inject(_IdGenerator).getId('sbb-form-field-label-');

  @ViewChild('connectionContainer', { static: true }) _connectionContainerRef: ElementRef;

  @ContentChild(SbbFormFieldControl) _controlNonStatic: SbbFormFieldControl<any>;
  @ContentChild(SbbFormFieldControl, { static: true }) _controlStatic: SbbFormFieldControl<any>;
  get _control() {
    // TODO(crisbeto): we need this workaround in order to support both Ivy and ViewEngine.
    //  We should clean this up once Ivy is the default renderer.
    return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
  }
  set _control(value) {
    this._explicitFormFieldControl = value;
  }
  private _explicitFormFieldControl: SbbFormFieldControl<any>;

  @ContentChildren(SBB_ERROR, { descendants: true }) _errorChildren: QueryList<SbbError>;
  private readonly _labelChild = contentChild(SbbLabel);

  private _previousControl: SbbFormFieldControl<unknown> | null = null;
  private _stateChanges: Subscription | undefined;
  private _valueChanges: Subscription | undefined;
  private _describedByChanges: Subscription | undefined;

  constructor(...args: unknown[]);
  constructor() {}

  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   */
  getLabelId: Signal<string | null> = computed(() =>
    this._hasLabel() || this.label() ? this._labelId : null,
  );

  ngAfterContentInit() {
    this._validateControlChild();
  }

  ngAfterContentChecked() {
    this._validateControlChild();

    if (this._control !== this._previousControl) {
      this._initializeControl(this._previousControl);
      this._previousControl = this._control;
    }
  }

  ngOnDestroy(): void {
    this._stateChanges?.unsubscribe();
    this._valueChanges?.unsubscribe();
    this._describedByChanges?.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Determines whether a class from the AbstractControlDirective
   * should be forwarded to the host element.
   */
  _shouldForward(prop: keyof AbstractControlDirective): boolean {
    const control = this._control ? this._control.ngControl : null;
    return control && control[prop];
  }

  _hasLabel: Signal<boolean> = computed(() => !!this._labelChild());

  _hasErrors() {
    return !!(this._errorChildren && this._errorChildren.length && this._control.errorState);
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      const ids: string[] = [];

      // TODO(wagnermaciel): Remove the type check when we find the root cause of this bug.
      if (
        this._control.userAriaDescribedBy &&
        typeof this._control.userAriaDescribedBy === 'string'
      ) {
        ids.push(...this._control.userAriaDescribedBy.split(' '));
      }

      if (this._errorChildren) {
        ids.push(...this._errorChildren.map((error) => error.id));
      }

      this._control.setDescribedByIds(ids);
    }
  }

  /** Throws an error if the form field's control is missing. */
  protected _validateControlChild() {
    if (!this._control && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSbbFormFieldMissingControlError();
    }
  }

  /**
   * Gets an ElementRef for the element that a overlay attached to the form-field should be
   * positioned relative to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._connectionContainerRef || this._elementRef;
  }

  /** Initializes the registered form field control. */
  private _initializeControl(previousControl: SbbFormFieldControl<unknown> | null) {
    const control = this._control;
    const classPrefix = 'sbb-form-field-type-';

    if (previousControl) {
      this._elementRef.nativeElement.classList.remove(classPrefix + previousControl.controlType);
    }

    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(classPrefix + control.controlType);
    }

    // Subscribe to changes in the child control state in order to update the form field UI.
    this._stateChanges?.unsubscribe();
    this._stateChanges = control.stateChanges.pipe(startWith(null! as any)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });

    // Updating the `aria-describedby` touches the DOM. Only do it if it actually needs to change.
    this._describedByChanges?.unsubscribe();
    this._describedByChanges = control.stateChanges
      .pipe(
        startWith([undefined, undefined] as const),
        map(() => [control.errorState, control.userAriaDescribedBy] as const),
        pairwise(),
        filter(([[prevErrorState, prevDescribedBy], [currentErrorState, currentDescribedBy]]) => {
          return prevErrorState !== currentErrorState || prevDescribedBy !== currentDescribedBy;
        }),
      )
      .subscribe(() => this._syncDescribedByIds());

    this._valueChanges?.unsubscribe();

    // Run change detection if the value changes.
    if (control.ngControl && control.ngControl.valueChanges) {
      this._valueChanges = control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }

    // Update the aria-described by when the number of errors changes.
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
  }
}
