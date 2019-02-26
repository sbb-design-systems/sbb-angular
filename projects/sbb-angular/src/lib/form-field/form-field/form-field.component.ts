import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Self,
  ContentChild,
  AfterContentInit,
  ContentChildren,
  QueryList,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { HostClass, FormFieldControl } from '../../_common/common';
import { LabelComponent, LABEL_CONTAINER } from '../label/label.component';
import { FormErrorDirective } from '../form-error/form-error.directive';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'sbb-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    HostClass,
    { provide: LABEL_CONTAINER, useExisting: FormFieldComponent },
  ],
})
export class FormFieldComponent implements AfterContentInit, OnChanges, OnDestroy {
  /**
   * The label text for the input.
   */
  @Input() label?: string;
  /**
  * mode set the length of the input field
  */
  @Input() mode: 'default' | 'short' | 'medium' | 'long' = 'default';

  @ContentChild(FormFieldControl) _control: FormFieldControl<any>;
  @ContentChild(LabelComponent) contentLabel: LabelComponent;
  @ContentChildren(FormErrorDirective) formErrors: QueryList<FormErrorDirective>;

  private _destroyed = new Subject<void>();

  constructor(
    @Self() private hostClass: HostClass,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterContentInit() {
    if (!this.label && !this.contentLabel) {
      throw new Error('sbb-form-field requires a label! Use [label] or <sbb-label>!');
    } else if (this._control) {
      this._initializeFormFieldControl();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode && changes.mode.currentValue !== changes.mode.previousValue) {
      this.hostClass.apply(`sbb-input-field-${this.mode}`);
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _initializeFormFieldControl() {
    const control = this._control;

    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges
      .pipe(startWith<void>(null))
      .subscribe(() => {
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
    this.formErrors.changes
      .pipe(startWith(null))
      .subscribe(() => {
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
      const ids: string[] = this.formErrors && this.formErrors.length && this._control.errorState
        ? this.formErrors.map(e => e.id) : [];
      this._control.setDescribedByIds(ids);
    }
  }
}
