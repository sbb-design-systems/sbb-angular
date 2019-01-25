import {
  Component, ChangeDetectionStrategy, ContentChildren, QueryList,
  AfterContentInit,
  forwardRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { TagComponent } from '../tag/tag.component';
import { Subscription, merge, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'sbb-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements AfterContentInit, OnDestroy {

  get totalAmount(): number {
    return this.tags
      .map(t => t.amount)
      .reduce((amount1, amount2) => {
        return amount1 + amount2;
      }, 0);
  }

  private _tagsChangeSubscription = Subscription.EMPTY;
  private _tagsCheckingSubscription = Subscription.EMPTY;
  private _tagChecking$: Observable<TagComponent[]>;

  @ContentChildren(forwardRef(() => TagComponent))
  tags: QueryList<TagComponent>;

  @ViewChild('allTag')
  allTag: TagComponent;

  ngAfterContentInit() {
    this.initTags();
    this._tagsChangeSubscription = this.tagsChange();
    this._tagsCheckingSubscription = this.tagsHandleChecking();
  }

  ngOnDestroy() {
    this._tagsChangeSubscription.unsubscribe();
    this._tagsCheckingSubscription.unsubscribe();
  }

  initTags() {
    this.tags.forEach(t => {
      t.linkMode = false;
    });
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
      this.allTag.active = true;
    } else {
      this.allTag.active = false;
    }
  }

  tagsChange(): Subscription {
    return this.tags
      .changes.subscribe(
        () => {
          this.initTags();
          this.setAllTagState();
        }
      );
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
    this.tags.forEach(t => this.setTagChecked(t, false));
  }

  setTagChecked(tag: TagComponent, checked: boolean) {
    tag.checked = checked;
    tag.onChange(checked);
    tag.onTouched();
    tag.writeValue(checked);
  }

}
