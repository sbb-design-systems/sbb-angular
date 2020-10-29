import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { SbbFormFieldControl } from '@sbb-esta/angular-core/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { SbbFormError } from '../form-error/form-error.directive';
import { SBB_FORM_FIELD } from '../form-field-token';
import { SbbLabel } from '../label/label.component';

@Component({
  selector: 'sbb-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: SBB_FORM_FIELD, useExisting: SbbField }],
  host: {
    class: 'sbb-input-field',
    '[class.sbb-input-field-default]': 'this.mode === "default"',
    '[class.sbb-input-field-short]': 'this.mode === "short"',
    '[class.sbb-input-field-medium]': 'this.mode === "medium"',
    '[class.sbb-input-field-long]': 'this.mode === "long"',
  },
})
export class SbbField implements AfterContentInit, OnDestroy {
  /** The label text for the input. */
  @Input() label?: string;
  /** Mode set the length of the input field. */
  @Input() mode: 'default' | 'short' | 'medium' | 'long' = 'default';

  @ContentChild(SbbFormFieldControl) _control: SbbFormFieldControl<any>;
  @ContentChild(SbbLabel, { static: true }) contentLabel: SbbLabel;
  @ContentChildren(SbbFormError) formErrors: QueryList<SbbFormError>;

  private _destroyed = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    public _elementRef: ElementRef<HTMLElement>
  ) {}

  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   * // TODO: Fix with sbb-field refactor.
   */
  getLabelId(): string | null {
    return null;
  }

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
          ? this.formErrors.map((e) => e.id)
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
