import {
  AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren,
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
  providers: [{
    provide: TAGS_CONTAINER,
    useExisting: TagsComponent
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements AfterContentInit, OnDestroy {
  /**
   * Total amount of results found.
   */
  get totalAmount(): number {
    return this.tags
      .map(t => t.amount)
      .reduce((amount1, amount2) => {
        return Number(amount1) + Number(amount2);
      }, 0);
  }

  private _tagsCheckingSubscription = Subscription.EMPTY;
  private _tagChecking$: Observable<TagComponent[]>;
  /**
   * Css class associated to sbb-tags.
   */
  @HostBinding('class.sbb-tags')
  sbbTagsClass = true;
  /**
   * Refers to the tags contained.
   */
  @ContentChildren(forwardRef(() => TagComponent))
  tags: QueryList<TagComponent>;
  /**
   * Refers to the tag always displayed in the filter.
   */
  @ViewChild('allTag')
  allTag: TagComponent;

  ngAfterContentInit() {
    this._tagsCheckingSubscription = this.tagsHandleChecking();
  }

  ngOnDestroy() {
    this._tagsCheckingSubscription.unsubscribe();
  }

  setAllTagState() {
    const values = this.tags.map(t => {
      if (t.disabled) {
        return false;
      }
      return t.checked;
    });

    const hasAcheckedTag = values.indexOf(true) !== -1;

    if (!hasAcheckedTag) {
      this.allTag.setTagChecked(true);
    } else {
      this.allTag.setTagChecked(false);
    }
  }

  tagsHandleChecking(): Subscription {
    this._tagChecking$ = merge<TagComponent[]>(of(this.tags.toArray()), this.tags.changes);

    return this._tagChecking$
      .pipe(
        map(tags => tags.map(t => merge(t.tagChecking$, t.stateChange$))),
        switchMap(tagStateChecking$ => merge(...tagStateChecking$))
      )
      .subscribe(
        () => {
          this.setAllTagState();
        });
  }

  allTagClick() {
    this.tags.forEach(t => t.setTagChecked(false));
  }

}
