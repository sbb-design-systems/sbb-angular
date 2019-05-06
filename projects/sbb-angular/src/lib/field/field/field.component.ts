import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  Self,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { HostClass } from '../../_common/host-class';
import { FormErrorDirective } from '../form-error/form-error.directive';
import { FormFieldControl } from '../form-field-control';
import { FORM_FIELD } from '../form-field-token';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'sbb-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [HostClass, { provide: FORM_FIELD, useExisting: FieldComponent }]
})
export class FieldComponent implements AfterContentInit, OnChanges, OnDestroy {
  /**
   * The label text for the input.
   */
  @Input() label?: string;
  /**
   * mode set the length of the input field
   */
  @Input() mode: 'default' | 'short' | 'medium' | 'long' = 'default';

  // tslint:disable-next-line: naming-convention
  @ContentChild(FormFieldControl) _control: FormFieldControl<any>;
  @ContentChild(LabelComponent) contentLabel: LabelComponent;
  @ContentChildren(FormErrorDirective) formErrors: QueryList<
    FormErrorDirective
  >;

  private _destroyed = new Subject<void>();

  constructor(
    @Self() private _hostClass: HostClass,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterContentInit() {
    if (this._control) {
      this._initializeFormFieldControl();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.mode &&
      changes.mode.currentValue !== changes.mode.previousValue
    ) {
      this._hostClass.apply(`sbb-input-field-${this.mode}`);
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _initializeFormFieldControl() {
    const control = this._control;

    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges.pipe(startWith<void>(null)).subscribe(() => {
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
}
