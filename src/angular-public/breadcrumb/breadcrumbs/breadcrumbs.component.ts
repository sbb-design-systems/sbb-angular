import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { take } from 'rxjs/operators';

import { SbbBreadcrumb, SBB_BREADCRUMB_PARENT_COMPONENT } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'sbb-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SBB_BREADCRUMB_PARENT_COMPONENT,
      useExisting: SbbBreadcrumbs,
    },
  ],
  host: {
    class: 'sbb-breadcrumbs',
    '[class.sbb-breadcrumbs-expanded]': 'this.expanded',
  },
})
export class SbbBreadcrumbs implements AfterViewInit {
  /**
   * Refers to BreadcrumbComponents instance.
   */
  @ContentChildren(SbbBreadcrumb) levels: QueryList<SbbBreadcrumb>;

  /**
   * Css class of a sbb-breadcrumbs.
   * @deprecated internal detail
   */
  cssClass = true;

  /**
   * Status expanded of a sbb-breadcrumbs.
   */
  get expanded(): boolean {
    if (this.levels.length > 2) {
      return this._expanded;
    }
    return true;
  }
  private _expanded = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.levels && this.levels.first) {
      this.levels.first.expandEvent.pipe(take(1)).subscribe(() => {
        this._expanded = true;
        this._changeDetectorRef.markForCheck();
      });
    }
  }
}
