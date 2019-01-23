import {
  Component, ChangeDetectionStrategy, ContentChildren, QueryList,
  AfterContentInit,
  forwardRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  SimpleChange,
  SimpleChanges
} from '@angular/core';

import { TagComponent } from '../tag/tag.component';
import { Subscription, merge, Observable, of, zip } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sbb-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements AfterContentInit, OnDestroy {

  totalAmount = 0;

  private _tagSubscription = Subscription.EMPTY;
  private _tagCheckingDefaultSubscription = Subscription.EMPTY;
  private _tagCheckingSubscription = Subscription.EMPTY;
  private _tagChecking$: Observable<TagComponent[]>;

  @ContentChildren(forwardRef(() => TagComponent))
  tags: QueryList<TagComponent>;

  @ViewChild(TagComponent)
  allTag: TagComponent;

  constructor(private _changeDetector: ChangeDetectorRef) { }

  ngAfterContentInit() {
    this.allTag.linkMode = false;

    this.initTags();

    this._tagSubscription = this.tagsChange();

    this._tagCheckingDefaultSubscription = this.tagsHandleDefaultState();

    this._tagCheckingSubscription = this.tagsHandleChecking();
  }

  ngOnDestroy() {
    this._tagSubscription.unsubscribe();
    this._tagCheckingDefaultSubscription.unsubscribe();
    this._tagCheckingSubscription.unsubscribe();
  }

  initTags() {
    this.tags.forEach(t => {
      t.linkMode = false;
    });
  }

  tagsChange(): Subscription {
    return this.tags
      .changes.subscribe(
        () => {
          console.log('1 - initTags');
          this.initTags();
        }
      );
  }

  tagsHandleDefaultState(): Subscription {
    return zip(...this.tags.map(t => t.tagChecking$))
      .subscribe((values) => {
        console.log('2 - DEFAULT VAL', values);

        const hasCheckedValue = values.findIndex(val => val === true) !== -1;

        if (!hasCheckedValue) {
          this.setTagChecked(this.allTag, true);

          this.tags.forEach(t => {
            this.setTagChecked(t, true);
            t.active = false;
          });
        }
      });
  }

  tagsHandleChecking(): Subscription {
    this._tagChecking$ = merge<TagComponent[]>(of(this.tags.toArray()), this.tags.changes);

    return this._tagChecking$
      .pipe(
        map(tags => tags.map(t => t.tagChecking$)),
        switchMap(tagChecking$ => merge(...tagChecking$)),
        distinctUntilChanged()
      )
      .subscribe((x) => console.log('3 - SWITCHMAP VAL', x));
  }

  setTagChecked(tag: TagComponent, checked: boolean) {
    tag.checked = checked;
    tag.onChange(checked);
    tag.onTouched();
    tag.writeValue(checked);
  }

}
