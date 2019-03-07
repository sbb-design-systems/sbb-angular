import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ViewEncapsulation,
  Input,
  HostBinding,
  AfterContentInit,
  QueryList,
  ContentChildren,
  OnDestroy,
  Output,
  EventEmitter,
  NgZone
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RadioButton } from '../../radio-button/radio-button/radio-button.model';
import { ToggleOptionComponent } from '../toggle-option/toggle-option.component';
import { Subscription, Observable, merge } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToggleBase, SBB_TOGGLE_COMPONENT } from '../toggle.base';

let counter = 0;

@Component({
  selector: 'sbb-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
    {
      provide: SBB_TOGGLE_COMPONENT,
      useExisting: ToggleComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleComponent extends RadioButton
  implements ToggleBase, ControlValueAccessor, OnInit, OnDestroy, AfterContentInit {

  /**
     * Radio button panel identifier
     */
  @Input()
  @HostBinding('id')
  inputId = `sbb-toggle-${counter++}`;

  /**
   * Indicates radio button name in formControl
   */
  @Input()
  formControlName: string;

  /**
   * Attribute name of sbb-toggle.
   */
  @Input()
  name: string;

  /**
   * Css class on sbb-toggle.
   */
  @HostBinding('class.sbb-toggle')
  toggleClass = true;

  /**
   * Role of sbb-toggle.
   */
  @HostBinding('attr.role')
  role = 'radiogroup';

  /**
   * Event generated on a change of sbb-toggle.
   */
  @Output()
  toggleChange = new EventEmitter<any[]>();

  /**
   * Reference to sbb-toggle-options.
   */
  @ContentChildren(forwardRef(() => ToggleOptionComponent))
  toggleOptions: QueryList<ToggleOptionComponent>;

  private _toggleValueChangesSubscription = Subscription.EMPTY;
  private _toggleValueChanges$: Observable<any>;

  /**
   * Class property that represents a change on the radio button
   */
  onChange = (_: any) => { };

  /**
   * Class property that represents a touch on the radio button
   */
  onTouched = () => { };

  constructor(private zone: NgZone) {
    super();
  }

  ngOnInit() {
    this.checkName();
  }

  ngAfterContentInit() {
    this.zone.onStable.pipe(first()).subscribe(
      () => this.zone.run(() => {
        this.checkNumOfOptions();
        const defaultOption = this.toggleOptions.toArray()[0];
        defaultOption.setToggleChecked(true);
      })
    );


    this._toggleValueChanges$ = merge(...this.toggleOptions.map(toggle => toggle.valueChange$));
    this._toggleValueChangesSubscription = this._toggleValueChanges$.subscribe(
      (value) => {
        this.onChange(value);
        this.onTouched();
        this.writeValue(value);
        this.toggleChange.emit(value);
      }
    );
  }

  ngOnDestroy() {
    this._toggleValueChangesSubscription.unsubscribe();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
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
   * Throws an exception if the Toggle name doesn't match with the Toggle form control name
   */
  private throwNameError(): void {
    throw new Error(`
      If you define both a name and a formControlName attribute on your Toggle, their values
      must match. Ex: <sbb-toggle formControlName="food" name="food"></sbb-toggle>
    `);
  }

  private checkNumOfOptions(): void {
    if (this.toggleOptions.length !== 2) {
      this.throwNotTwoOptionsError();
    }
  }

  private throwNotTwoOptionsError(): void {
    throw new Error(`You must set two sbb-toggle-option into the sbb-toggle component. You set ${this.toggleOptions.length} options.`);
  }


}
