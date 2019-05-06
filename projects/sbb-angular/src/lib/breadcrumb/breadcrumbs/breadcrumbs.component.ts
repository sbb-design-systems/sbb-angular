import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { first } from 'rxjs/operators';

import {
  BreadcrumbComponent,
  SBB_BREADCRUMB_PARENT_COMPONENT
} from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'sbb-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SBB_BREADCRUMB_PARENT_COMPONENT,
      useExisting: BreadcrumbsComponent
    }
  ]
})
export class BreadcrumbsComponent implements AfterViewInit {
  /**
   * Refers to BreadcrumbComponents instance.
   */
  @ContentChildren(BreadcrumbComponent) levels: QueryList<BreadcrumbComponent>;

  /**
   * Css class of a sbb-breadcrumbs.
   */
  @HostBinding('class.sbb-breadcrumbs')
  cssClass = true;

  /**
   * Status expanded of a sbb-breadcrumbs.
   */
  @HostBinding('class.sbb-breadcrumbs-expanded')
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
      this.levels.first.expandEvent.pipe(first()).subscribe(() => {
        this._expanded = true;
        this._changeDetectorRef.markForCheck();
      });
    }
  }
}
