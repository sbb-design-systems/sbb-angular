import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  InjectionToken,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { HasVariantCtor, mixinVariant } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { SbbError, SBB_ERROR } from './error';
import { SbbFormFieldControl } from './form-field-control';
import { getSbbFormFieldMissingControlError } from './form-field-errors';
import { SbbLabel } from './label';

/** @docs-private */
class SbbFormFieldBase {
  constructor(public _elementRef: ElementRef) {}
}

// tslint:disable-next-line: naming-convention
const _SbbFormFieldBase: HasVariantCtor & typeof SbbFormFieldBase = mixinVariant(SbbFormFieldBase);

let nextId = 0;

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
export class SbbFormField
  extends _SbbFormFieldBase
  implements AfterContentInit, AfterContentChecked, OnDestroy {
  /** The label text for the input. */
  @Input() label?: string;

  private _destroyed = new Subject<void>();

  // Unique id for the label element.
  readonly _labelId = `sbb-form-field-label-${nextId++}`;

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

  @ContentChild(SbbLabel) _labelChildNonStatic: SbbLabel;
  @ContentChild(SbbLabel, { static: true }) _labelChildStatic: SbbLabel;

  @ContentChildren(SBB_ERROR, { descendants: true }) _errorChildren: QueryList<SbbError>;

  constructor(
    public _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_elementRef);
  }

  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   */
  getLabelId(): string | null {
    return this._hasLabel() || this.label ? this._labelId : null;
  }

  ngAfterContentInit() {
    this._validateControlChild();

    const control = this._control;

    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(`sbb-form-field-type-${control.controlType}`);
    }

    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges.pipe(startWith(null! as any)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });

    // Run change detection if the value changes.
    if (control.ngControl && control.ngControl.valueChanges) {
      control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }

    // Update the aria-described by when the number of errors changes.
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterContentChecked() {
    this._validateControlChild();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Determines whether a class from the NgControl should be forwarded to the host element. */
  _shouldForward(prop: keyof NgControl): boolean {
    const ngControl = this._control ? this._control.ngControl : null;
    return ngControl && ngControl[prop];
  }

  _hasLabel() {
    return !!(this._labelChildNonStatic || this._labelChildStatic);
  }

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
}
