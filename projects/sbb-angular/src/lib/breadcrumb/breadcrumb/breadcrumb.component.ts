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

import { BreadcrumbLevelComponent } from '../breadcrumb-level/breadcrumb-level.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements AfterViewInit {

  /**
   * Refers to BreadcrumbLevelComponents istance.
   */
  @ContentChildren(BreadcrumbLevelComponent) levels: QueryList<BreadcrumbLevelComponent>;

  @HostBinding('class.sbb-breadcrumb')
  cssClass = true;

  @HostBinding('class.sbb-breadcrumb-expanded')
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
