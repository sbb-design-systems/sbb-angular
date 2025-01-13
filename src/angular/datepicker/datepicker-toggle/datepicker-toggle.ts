// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostAttributeToken,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { merge, Observable, of, Subscription } from 'rxjs';

import { SBB_DATEPICKER } from '../datepicker-token';
import type { SbbDatepicker } from '../datepicker/datepicker';

@Component({
  selector: 'sbb-datepicker-toggle',
  templateUrl: './datepicker-toggle.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-datepicker-toggle',
    '[class.sbb-datepicker-toggle-active]': 'this._datepicker && this._datepicker.opened',
    '[attr.tabindex]': 'null',
  },
  imports: [SbbIconModule],
})
export class SbbDatepickerToggle<D> implements OnDestroy, OnChanges, AfterContentInit {
  private _changeDetectorRef = inject(ChangeDetectorRef);
  _datepicker: SbbDatepicker<D> = inject<SbbDatepicker<D>>(SBB_DATEPICKER);
  _labelShowCalendar: string = $localize`:Open calendar@@sbbDatepickerOpenCalendar:Show calendar`;

  private _stateChanges = Subscription.EMPTY;

  /** Tabindex for the toggle. */
  @Input() tabIndex: number | null;

  /** Whether the toggle button is disabled. */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled === undefined ? this._datepicker.disabled : this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled?: boolean;

  constructor(...args: unknown[]);
  constructor() {
    const defaultTabIndex = inject(new HostAttributeToken('tabindex'), { optional: true });
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.datepicker) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  /** Open datepicker calendar. */
  open(event: Event): void {
    if (this._datepicker && !this.disabled) {
      this._datepicker.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const datepickerDisabled = this._datepicker ? this._datepicker.disabledChange : of();
    const inputDisabled =
      this._datepicker && this._datepicker.datepickerInput
        ? this._datepicker.datepickerInput.disabledChange
        : of();
    const datepickerToggled = this._datepicker
      ? merge(this._datepicker.openedStream, this._datepicker.closedStream)
      : of();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      datepickerDisabled as Observable<void>,
      inputDisabled as Observable<void>,
      datepickerToggled,
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }
}
