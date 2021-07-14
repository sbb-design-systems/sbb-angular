import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { filter, mergeAll, mergeMap, startWith, takeUntil } from 'rxjs/operators';

import { SbbTag, SBB_TAGS_CONTAINER } from './tag';

@Component({
  selector: 'sbb-tags',
  exportAs: 'sbbTags',
  templateUrl: './tags.html',
  providers: [
    {
      provide: SBB_TAGS_CONTAINER,
      useExisting: SbbTags,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-tags',
  },
})
export class SbbTags implements AfterContentInit, OnDestroy {
  /**
   * Total amount visible on the all tag badge.
   * If not provided, the total amount is calculated by the sum of all amounts of all tags.
   */
  @Input()
  set totalAmount(totalAmount: number) {
    this._totalAmountSetAsInput = true;
    this._totalAmount.next(coerceNumberProperty(totalAmount));
  }
  get totalAmount(): number {
    return this._totalAmount.value;
  }
  _totalAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private _totalAmountSetAsInput = false;

  /** Refers to the tags contained. */
  @ContentChildren(forwardRef(() => SbbTag))
  tags: QueryList<SbbTag>;

  /** Refers to the tag always displayed in the filter. */
  @ViewChild('allTag')
  allTag: SbbTag;

  private _destroyed = new Subject();

  ngAfterContentInit() {
    // Listen to tag changes in order to update state of 'all'-tag
    this.tags.changes
      .pipe(
        startWith(this.tags.toArray()),
        mergeMap((tags) => [
          ...tags.map((tag: SbbTag) => tag.change),
          ...tags.map((tag: SbbTag) => tag._valueChange),
        ]),
        mergeAll(),
        takeUntil(this._destroyed)
      )
      .subscribe(() => this._setCheckedStateOfAllTag());

    // Listen to tag changes and amount changes of all tag components
    this.tags.changes
      .pipe(
        startWith(this.tags.toArray()),
        mergeMap((tags: SbbTag[]) =>
          tags.length === 0
            ? [of(null)]
            : tags.map((tag) => tag._amountChange.pipe(startWith(null)))
        ),
        mergeAll(),
        filter(() => !this._totalAmountSetAsInput),
        takeUntil(this._destroyed)
      )
      .subscribe(() => this._calculateTotalAmountOfTags());
  }

  private _setCheckedStateOfAllTag() {
    const noTagChecked = this.tags.map((t) => !t.disabled && t.checked).every((v) => !v);
    if (noTagChecked !== this.allTag.checked) {
      this.allTag.checked = noTagChecked;
    }
  }

  private _calculateTotalAmountOfTags() {
    const calculatedTotalAmount = this.tags.reduce((current, next) => current + next.amount, 0);
    this._totalAmount.next(calculatedTotalAmount);
  }

  _setAllTagChecked() {
    this.allTag._setCheckedAndEmit(true);
    this.tags.forEach((t) => t._setCheckedAndEmit(false));
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this._totalAmount.complete();
  }

  static ngAcceptInputType_totalAmount: NumberInput;
}
