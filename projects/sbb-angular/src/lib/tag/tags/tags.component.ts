import {
  Component, ChangeDetectionStrategy, ContentChildren, QueryList,
  AfterContentInit,
  forwardRef,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { TagComponent } from '../tag/tag.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements AfterContentInit, OnDestroy {

  private tagSubscription = Subscription.EMPTY;

  constructor(private _changeDetector: ChangeDetectorRef) { }

  @ContentChildren(forwardRef(() => TagComponent))
  tags: QueryList<TagComponent>;

  ngAfterContentInit() {
    this.initTags();

    this.tagSubscription = this.tags
      .changes.subscribe(
        () => {
          this.initTags();
        }
      );
  }

  ngOnDestroy() {
    this.tagSubscription.unsubscribe();
  }

  initTags() {
    this.tags.forEach(t => {
      t.linkMode = false;
      t.tagDetectChanges();
    });
  }

}
