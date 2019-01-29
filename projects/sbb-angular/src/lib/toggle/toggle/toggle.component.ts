import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ViewEncapsulation,
  Input,
  HostBinding,
  ChangeDetectorRef,
  ContentChild,
  AfterContentInit,
  QueryList,
  ContentChildren,
  OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, RadioControlValueAccessor, ControlValueAccessor } from '@angular/forms';
import { RadioButtonComponent } from '../../radio-button/radio-button';
import { RadioButton } from '../../radio-button/radio-button/radio-button.model';
import { ToggleOptionComponent } from '../toggle-option/toggle-option.component';
import { Subscription, Observable, merge, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

let counter = 0;

@Component({
  selector: 'sbb-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleComponent extends RadioButton implements ControlValueAccessor, OnInit, OnDestroy, AfterContentInit {
  /**
     * Radio button panel identifier
     */
  @Input()
  @HostBinding('id')
  inputId = `sbb-toggle-${counter++}`;

  @Input()
  disabled: boolean;

  /**
   * Indicates radio button name in formControl
   */
  @Input()
  formControlName: string;

  private _toggleValueChangesSubscription = Subscription.EMPTY;
  private _toggleValueChanges$: Observable<any>;

  constructor(private _changeDetector: ChangeDetectorRef) {
    super();
  }

  @ContentChildren(forwardRef(() => ToggleOptionComponent))
  toggleOptions: QueryList<ToggleOptionComponent>;

  ngOnInit() {
    this.checkName();
  }

  ngAfterContentInit() {
    this.checkNumOfOptions();

    this._toggleValueChanges$ = of(this.toggleOptions.map(toggle => toggle.valueChange))
      .pipe(
        switchMap(valueChange => merge(...valueChange))
      );

    this._toggleValueChangesSubscription = this._toggleValueChanges$.subscribe(
      (value) => {
        this.onChange(value);
        this.onTouched();
        this.writeValue(value);
      }
    );
  }

  ngOnDestroy() {
    this._toggleValueChangesSubscription.unsubscribe();
  }

  /**
   * Class property that represents a change on the radio button
   */
  onChange = (_: any) => { };
  /**
   * Class property that represents a touch on the radio button
   */
  onTouched = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }

  uncheck() { }

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

  private checkNumOfOptions(): void {
    if (this.toggleOptions.length !== 2) {
      console.log(this.toggleOptions.length);
      this.throwNotTwoOptionsError();
    }
  }

  private throwNotTwoOptionsError(): void {
    throw new Error('You must set two sbb-toggle-option into the sbb-toggle component');
  }


}
