import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  Input,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  HostBinding,
  HostListener,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RadioButtonComponent } from '../../radio-button/radio-button';
import { RadioButton } from '../../radio-button/radio-button/radio-button.model';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { RadioButtonRegistryService } from '../../radio-button/radio-button/radio-button-registry.service';
import { OptionSelectionImageDirective } from './option-selection-image.directive';

let counter = 0;

@Component({
  selector: 'sbb-option-selection',
  templateUrl: './option-selection.component.html',
  styleUrls: ['./option-selection.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionSelectionComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionSelectionComponent extends RadioButton implements ControlValueAccessor, OnInit, OnDestroy {

  @HostBinding('class.sbb-option-selection')
  cssClass = true;

  /**
     * Template that will contain icons.
     * Use the *sbbButtonIcon structural directive to provide the desired icon.
     */
  @Input()
  @ContentChild(OptionSelectionImageDirective, { read: TemplateRef })
  image: TemplateRef<any>;

  @Input()
  label: string;

  @Input()
  subtitle?: string;

  @ViewChild('radio') embeddedRadio: RadioButtonComponent;
  /**
     * Radio button identifier
     */
  @Input()
  @HostBinding('id')
  inputId = `sbb-option-selection-${counter++}`;
  /**
   * Indicates radio button name in formControl
   */
  @Input() formControlName: string;
  /**
   * Used to set the 'aria-label' attribute on the underlying input element.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel: string;
  /**
   * The 'aria-labelledby' attribute takes precedence as the element's text alternative.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string;
  /**
   * The 'aria-describedby' attribute is read after the element's label and field type.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-describedby') ariaDescribedby: string;
  /**
   * Indicates that the radio button field is required
   */
  @Input()
  @HostBinding('class.sbb-option-selection-required')
  set required(value: any) {
    this.embeddedRadio.required = coerceBooleanProperty(value);
  }
  get required(): any {
    return this.embeddedRadio.required;
  }


  /**
   * The disabled state of the radio button
   */
  @Input()
  @HostBinding('class.sbb-option-selection-disabled')
  set disabled(value: any) {
    this.embeddedRadio.disabled = coerceBooleanProperty(value);
    this.embeddedRadio.changeDetector.markForCheck();
  }
  get disabled(): any {
    return this.embeddedRadio.disabled;
  }

  /**
   * The checked state of the radio button
   */
  @Input()
  @HostBinding('class.sbb-option-selection-checked')
  get checked(): boolean {
    return this.embeddedRadio.checked;
  }
  set checked(value: boolean) {
    this.embeddedRadio.checked = value;
  }


  @HostBinding('class.sbb-option-selection-has-subtitle')
  get hasSubtitle() {
    return !!this.subtitle;
  }

  /**
   * Class property that represents a change on the radio button
   */
  onChange = (_: any) => {
    this.embeddedRadio.onChange(_);
  }
  /**
   * Class property that represents a touch on the radio button
   */
  onTouched = () => {
    this.embeddedRadio.onTouched();
  }

  constructor(private changeDetector: ChangeDetectorRef, private registry: RadioButtonRegistryService) {
    super();
  }

  ngOnInit(): void {
    this.checkName();
    this.registry.add(this.embeddedRadio);
  }

  ngOnDestroy(): void {
    this.registry.remove(this.embeddedRadio);
  }

  writeValue(value: any): void {
    this.embeddedRadio.checked = this.value === value;
  }

  /**
   * Registers the on change callback
   */
  registerOnChange(fn: any): void {
    this.embeddedRadio.onChange = fn;
  }
  /**
   * Registers the on touched callback
   */
  registerOnTouched(fn: any): void {
    this.embeddedRadio.onTouched = fn;
  }

  /**
   * Manage the event click on the radio button
   */
  @HostListener('click')
  click() {
    if (!this.disabled) {
      this.onChange(this.value);
      this.onTouched();
      this.writeValue(this.value);
      this.embeddedRadio.checked = true;
    }

  }

  /**
   * Sets the radio button status to disabled
   */
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.embeddedRadio.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  /**
   * Unchecks the radio button
   */
  uncheck() {
    this.embeddedRadio.uncheck();
  }

  /**
  * Verify that radio button name matches with radio button form control name
  */
  private checkName(): void {
    if (this.name && this.formControlName && this.name !== this.formControlName) {
      this.throwNameError();
    } else if (!this.name && this.formControlName) {
      this.name = this.formControlName;
    }
  }

  /**
   * Throws an exception if the radio button name doesn't match with the radio button form control name
   */
  private throwNameError(): void {
    throw new Error(`
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <sbb-radio-button formControlName="food" name="food"></sbb-radio-button>
    `);
  }
}
