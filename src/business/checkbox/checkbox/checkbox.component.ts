import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxBase, SbbCheckboxChange } from '@sbb-esta/angular-core/base';

export interface CheckboxChange extends SbbCheckboxChange<CheckboxComponent> {}

@Component({
  selector: 'sbb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends CheckboxBase<CheckboxChange> {
  /** @docs-private */
  get ariaChecked(): String {
    return this.checked ? 'true' : this.indeterminate ? 'mixed' : 'false';
  }

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output() readonly indeterminateChange = new EventEmitter<boolean>();

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(changeDetectorRef, focusMonitor, elementRef, tabIndex);
  }

  /**
   * The indeterminate state of the checkbox
   */
  @Input()
  @HostBinding('class.sbb-checkbox-indeterminate')
  get indeterminate(): any {
    return this._indeterminate;
  }
  set indeterminate(value: any) {
    const changed = value !== this._indeterminate;
    this._indeterminate = value;
    if (changed) {
      this.indeterminateChange.emit(this._indeterminate);
    }
  }
  private _indeterminate = false;

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   * Do not toggle on (change) event since IE doesn't fire change event when
   *   indeterminate checkbox is clicked.
   */
  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();

    // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
    if (!this.disabled) {
      // When user manually click on the checkbox, `indeterminate` is set to false.
      if (this.indeterminate) {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }

      this.toggle();

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      this._emitChangeEvent();
    }
  }
}
