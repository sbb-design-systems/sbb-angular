import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  HostBinding,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { FormFieldControl } from '@sbb-esta/angular-core/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { FormErrorDirective } from '../form-error/form-error.directive';
import { FORM_FIELD } from '../form-field-token';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'sbb-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: FORM_FIELD, useExisting: FieldComponent }]
})
export class FieldComponent implements AfterContentInit, OnDestroy {
  /** @docs-private */
  @HostBinding('class.sbb-input-field')
  _fieldClass = true;
  /**
   * The label text for the input.
   */
  @Input() label?: string;
  /**
   * mode set the length of the input field
   */
  @Input() mode: 'default' | 'short' | 'medium' | 'long' = 'default';

  @ContentChild(FormFieldControl) _control: FormFieldControl<any>;
  @ContentChild(LabelComponent, { static: true }) contentLabel: LabelComponent;
  @ContentChildren(FormErrorDirective) formErrors: QueryList<FormErrorDirective>;

  /** @docs-private */
  @HostBinding('class.sbb-input-field-default')
  get _defaultClass() {
    return this.mode === 'default';
  }
  /** @docs-private */
  @HostBinding('class.sbb-input-field-short')
  get _shortClass() {
    return this.mode === 'short';
  }
  /** @docs-private */
  @HostBinding('class.sbb-input-field-medium')
  get _mediumClass() {
    return this.mode === 'medium';
  }
  /** @docs-private */
  @HostBinding('class.sbb-input-field-long')
  get _longClass() {
    return this.mode === 'long';
  }

  private _destroyed = new Subject<void>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit() {
    if (this._control) {
      this._initializeFormFieldControl();
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _initializeFormFieldControl() {
    const control = this._control;

    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges.pipe(startWith<void>(null as any)).subscribe(() => {
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
    this.formErrors.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      const ids: string[] =
        this.formErrors && this.formErrors.length && this._control.errorState
          ? this.formErrors.map(e => e.id)
          : [];
      this._control.setDescribedByIds(ids);
    }
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode:
    | 'default'
    | 'short'
    | 'medium'
    | 'long'
    | string
    | null
    | undefined;
  // tslint:enable: member-ordering
}
