// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  numberAttribute,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { filter, mergeAll, mergeMap, startWith, takeUntil } from 'rxjs/operators';

import { SbbTag } from './tag';

@Component({
  selector: 'sbb-tags',
  exportAs: 'sbbTags',
  templateUrl: './tags.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-tags',
  },
  standalone: true,
  imports: [SbbTag, AsyncPipe],
})
export class SbbTags implements AfterContentInit, OnDestroy {
  _labelAllTag: string = $localize`:Label for the 'All' tag@@sbbTagsAll:All`;

  get _labelBadgeDescription(): string {
    return $localize`:Badge description (total amount) for the 'All' tag@@sbbTagsAllBadgeDescription:A total of ${this.totalAmount} results available`;
  }

  /**
   * Total amount visible on the "All" tag badge.
   * If not provided, the total amount is calculated by the sum of all amounts of all tags.
   */
  @Input({ transform: numberAttribute })
  get totalAmount(): number {
    return this._totalAmount.value;
  }
  set totalAmount(totalAmount: number) {
    this._totalAmountSetAsInput = true;
    this._totalAmount.next(totalAmount);
  }
  _totalAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private _totalAmountSetAsInput = false;

  /** Refers to the tags contained. */
  @ContentChildren(forwardRef(() => SbbTag))
  tags: QueryList<SbbTag>;

  /** Refers to the tag always displayed in the filter. */
  @ViewChild('allTag')
  allTag: SbbTag;

  private _destroyed = new Subject<void>();

  ngAfterContentInit() {
    // Listen to tag changes in order to update state of "All" tag
    this.tags.changes
      .pipe(
        startWith(this.tags.toArray()),
        mergeMap((tags) => [
          ...tags.map((tag: SbbTag) => tag.change),
          ...tags.map((tag: SbbTag) => tag._valueChange),
        ]),
        mergeAll(),
        takeUntil(this._destroyed),
      )
      .subscribe(() => this._setCheckedStateOfAllTag());

    // Listen to tag changes and amount changes of every tag component
    this.tags.changes
      .pipe(
        startWith(this.tags.toArray()),
        mergeMap((tags: SbbTag[]) =>
          tags.length === 0
            ? [of(null)]
            : tags.map((tag) => tag._amountChange.pipe(startWith(null))),
        ),
        mergeAll(),
        filter(() => !this._totalAmountSetAsInput),
        takeUntil(this._destroyed),
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
}
