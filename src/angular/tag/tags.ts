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
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import { SbbTag, SBB_TAGS_CONTAINER } from './tag';

@Component({
  selector: 'sbb-tags',
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
   * Total amount visible on the all tag.
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
  /** @docs-private */
  _totalAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private _totalAmountSetAsInput = false;

  /** Refers to the tags contained. */
  @ContentChildren(forwardRef(() => SbbTag))
  tags: QueryList<SbbTag>;
  /** Refers to the tag always displayed in the filter. */
  @ViewChild('allTag', { static: true })
  allTag: SbbTag;

  private _destroyed = new Subject();

  ngAfterContentInit() {
    this._tagsHandleChecking();

    // listen to tag changes and amount changes of all tag components
    merge<SbbTag[]>(of(this.tags.toArray()), this.tags.changes)
      .pipe(
        mergeMap((tags) => [
          of(this.tags.toArray()),
          this.tags.changes,
          ...tags.map((item) =>
            item._amountChange.pipe(
              map(() => tags),
              takeUntil(merge(this._destroyed, this.tags.changes))
            )
          ),
        ]),
        mergeAll(),
        takeUntil(this._destroyed)
      )
      .subscribe((tags: SbbTag[]) => {
        if (this._totalAmountSetAsInput) {
          return;
        }
        const calculatedTotalAmount = tags.reduce(
          (current, next) => current + Number(next.amount),
          0
        );
        this._totalAmount.next(calculatedTotalAmount);
      });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this._totalAmount.complete();
  }

  private _tagsHandleChecking() {
    merge<SbbTag[]>(of(this.tags.toArray()), this.tags.changes)
      .pipe(
        map((tags) =>
          tags.reduce(
            (current, next) => current.concat(next.tagChecking$, next.change, next._internalChange),
            [] as Observable<unknown>[]
          )
        ),
        switchMap((o) => merge(...o)),
        takeUntil(this._destroyed)
      )
      .subscribe(() => this.setAllTagState());
  }

  setAllTagState() {
    const noTagChecked = this.tags.map((t) => !t.disabled && t.checked).every((v) => !v);
    if (noTagChecked !== this.allTag.checked) {
      this.allTag.checked = noTagChecked;
    }
  }

  allTagClick() {
    this.allTag._setCheckedAndEmit(true);
    this.tags.forEach((t) => t._setCheckedAndEmit(false));
  }

  static ngAcceptInputType_totalAmount: NumberInput;
}
