import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterViewInit,
  HostBinding,
  ChangeDetectorRef,
} from '@angular/core';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'sbb-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent implements AfterViewInit {

  /**
   * Refers to BreadcrumbComponents istance.
   */
  @ContentChildren(BreadcrumbComponent) levels: QueryList<BreadcrumbComponent>;

  @HostBinding('class.sbb-breadcrumbs')
  cssClass = true;

  @HostBinding('class.sbb-breadcrumbs-expanded')
  get expanded(): boolean {
    if (this.levels.length > 2) {
      return this._expanded;
    }
    return true;
  }
  private _expanded = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    if (this.levels && this.levels.first) {

      this.levels.first.expandEvent.pipe(first()).subscribe(() => {
        this._expanded = true;
        this.changeDetectorRef.markForCheck();
      });
    }
  }

}
