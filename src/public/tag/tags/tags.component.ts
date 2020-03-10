import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  HostBinding,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { merge, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TagComponent, TAGS_CONTAINER } from '../tag/tag.component';

@Component({
  selector: 'sbb-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  providers: [
    {
      provide: TAGS_CONTAINER,
      useExisting: TagsComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements AfterContentInit, OnDestroy {
  /**
   * Total amount of results found.
   */
  get totalAmount(): number {
    return this.tags.map(t => Number(t.amount)).reduce((current, next) => current + next, 0);
  }

  /** Css class associated to sbb-tags. */
  @HostBinding('class.sbb-tags')
  sbbTagsClass = true;
  /** Refers to the tags contained. */
  @ContentChildren(forwardRef(() => TagComponent))
  tags: QueryList<TagComponent>;
  /** Refers to the tag always displayed in the filter. */
  @ViewChild('allTag', { static: true })
  allTag: TagComponent;

  /** @docs-private */
  _amount: Observable<number>;

  private _tagsCheckingSubscription = Subscription.EMPTY;

  ngAfterContentInit() {
    this._tagsCheckingSubscription = this.tagsHandleChecking();
    this._amount = merge<TagComponent[]>(of(this.tags.toArray()), this.tags.changes).pipe(
      map(tags => tags.reduce((current, next) => current + Number(next.amount), 0))
    );
  }

  ngOnDestroy() {
    this._tagsCheckingSubscription.unsubscribe();
  }

  tagsHandleChecking(): Subscription {
    return merge<TagComponent[]>(of(this.tags.toArray()), this.tags.changes)
      .pipe(
        map(tags =>
          tags.reduce(
            (current, next) => current.concat(next.tagChecking$, next.change),
            [] as Observable<unknown>[]
          )
        ),
        switchMap(o => merge(...o))
      )
      .subscribe(() => this.setAllTagState());
  }

  setAllTagState() {
    const checkAllTag = this.tags.map(t => !t.disabled && t.checked).every(v => !v);
    if (checkAllTag !== this.allTag.checked) {
      this.allTag.checked = checkAllTag;
    }
  }

  allTagClick() {
    this.tags.forEach(t => (t.checked = false));
  }
}
