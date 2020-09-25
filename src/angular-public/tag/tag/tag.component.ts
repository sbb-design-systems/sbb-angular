import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbCheckboxBase, SbbCheckboxChange } from '@sbb-esta/angular-core/base/checkbox';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Injection token used to provide the parent component to TagComponent.
 */
export const SBB_TAGS_CONTAINER = new InjectionToken<any>('SBB_TAG_CONTAINER');

export interface SbbTagChange extends SbbCheckboxChange<SbbTag> {}

@Component({
  selector: 'sbb-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbTag),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-tag',
    '[class.sbb-tag-disabled]': 'disabled',
    '[class.sbb-tag-active]': 'active',
  },
})
export class SbbTag extends SbbCheckboxBase<SbbTagChange> implements OnInit, OnDestroy {
  /**
   * @docs-private
   * @deprecated internal detail
   */
  sbbTagClass = true;

  /**
   *  @docs-private
   *  @deprecated internal detail
   */
  get sbbTagDisabledClass() {
    return this.disabled;
  }

  /**
   * Link mode of a tag.
   */
  get linkMode() {
    return this._linkMode;
  }
  set linkMode(value: boolean) {
    this._linkMode = value;
    this.active = value;
  }
  private _linkMode = false;

  /**
   * Label of the tag.
   */
  @Input()
  label: string;
  /**
   * Amount of result found.
   */
  @Input()
  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = coerceNumberProperty(value);
    this.amountChange.next(this._amount);
  }
  private _amount: number;

  /**
   * Emits the current amount when the amount changes
   */
  readonly amountChange = new Subject<number>();

  /**
   * A subject on tag checking.
   * @deprecated Use the change event
   */
  readonly tagChecking$ = new Subject<any>();

  /**
   * Emits when values are set from outside
   * @docs-private
   */
  readonly _internalChange = new Subject<any>();

  /** Refers if a tag is active. */
  get active() {
    return this._active || (this.checked && !this.disabled);
  }
  set active(value: boolean) {
    this._active = value;
    this._changeDetectorRef.markForCheck();
  }
  private _active = false;

  constructor(
    @Optional() @Inject(SBB_TAGS_CONTAINER) private _tagsContainer: any,
    private _zone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(changeDetectorRef, focusMonitor, elementRef, tabIndex, 'tag');

    this.change.subscribe((e: SbbTagChange) => {
      this.tagChecking$.next(e.checked);
    });
    this._zone.onStable
      .pipe(take(1))
      .subscribe(() => this._zone.run(() => this.tagChecking$.next(this.checked)));
  }

  ngOnInit() {
    if (!this._tagsContainer) {
      this.linkMode = true;
    }
  }

  writeValue(value: any) {
    super.writeValue(value);
    this._internalChange.next(value);
  }

  /**
   * @docs-private internal use only
   */
  _setCheckedAndEmit(checked: boolean) {
    const previousChecked = this.checked;
    this.checked = checked;
    if (previousChecked !== this.checked) {
      this._emitChangeEvent();
    }
  }

  ngOnDestroy() {
    this.tagChecking$.complete();
    this.amountChange.complete();
  }
  // tslint:disable: member-ordering
  static ngAcceptInputType_amount: NumberInput;
  // tslint:enable: member-ordering
}
