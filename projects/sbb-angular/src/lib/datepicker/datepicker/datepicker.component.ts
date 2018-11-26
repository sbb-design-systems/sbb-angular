import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  Input,
  forwardRef,
  Optional,
  Inject,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { DatepickerEmbeddableComponent } from '../datepicker-embeddable/datepicker-embeddable.component';
import {
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';
import { DatepickerInputDirective } from '../datepicker-input/datepicker-input.directive';
import { SBB_DATE_FORMATS, DateFormats } from '../date-formats';
import { DateAdapter } from '../date-adapter';


export const SBB_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};

export const SBB_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};

@Component({
  selector: 'sbb-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    SBB_DATEPICKER_VALUE_ACCESSOR,
    SBB_DATEPICKER_VALIDATORS
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements ControlValueAccessor, Validator, OnInit {

  /** The minimum valid date. */
  @Input()
  set min(value: Date) {
    this.datepickerInput.min = value;
  }
  get min() {
    return this.datepickerInput.min;
  }

  /** The maximum valid date. */
  @Input()
  set max(value: Date) {
    this.datepickerInput.max = value;
  }
  get max() {
    return this.datepickerInput.max;
  }

  /** Whether the datepicker-input is disabled. */
  @Input()
  disabled: boolean;

  /**
   * Embedded datepicker with calendar header and body, switches for next/prev months and years
   */
  @ViewChild('picker') embeddedDatepicker: DatepickerEmbeddableComponent<Date>;

  /**
   * Embedded input field connected to the datepicker
   */
  @ViewChild(DatepickerInputDirective) datepickerInput: DatepickerInputDirective<Date>;

  /**
   * Scrolls used to go directly to the next/prev day. They also support min and max date limits.
   */
  @Input()
  withScrolls: boolean;

  leftScroll: boolean;
  rightScroll: boolean;

  private isDayScrollApplicable(): boolean {
    return this.withScrolls && !!this.datepickerInput.value;
  }

  constructor(
    @Optional() public dateAdapter: DateAdapter<Date>,
    @Optional() @Inject(SBB_DATE_FORMATS) private dateFormats: DateFormats,
    private changeDetectorRef: ChangeDetectorRef) {
  }
  /*
    ngAfterViewInit(): void {

    } */
  ngOnInit(): void {
    this.datepickerInput.valueChange.subscribe(res => {
      this.leftScroll = this.isDayScrollApplicable() &&
        this.dateAdapter.compareDate(this.datepickerInput.value, this.min) > 0;
      this.rightScroll = this.isDayScrollApplicable() &&
        this.dateAdapter.compareDate(this.datepickerInput.value, this.max) < 0;

      this.changeDetectorRef.markForCheck();
    });
  }


  /**
   * Adds or removes a day when clicking on the arrow buttons on the right/left of the input
   */
  scrollToDay(value: 'left' | 'right') {
    value === 'left' ? this.embeddedDatepicker.prevDay() : this.embeddedDatepicker.nextDay();
  }

  writeValue(obj: any): void {
    this.datepickerInput.writeValue(obj);
  }
  registerOnChange(fn: any): void {
    this.datepickerInput.registerOnChange(fn);
  }
  registerOnTouched(fn: any): void {
    this.datepickerInput.registerOnTouched(fn);
  }
  setDisabledState(isDisabled: boolean): void {
    this.datepickerInput.setDisabledState(isDisabled);
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.datepickerInput.registerOnValidatorChange(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.datepickerInput.validate(c);
  }

}
