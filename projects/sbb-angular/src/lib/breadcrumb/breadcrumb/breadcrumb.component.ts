import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';

import { BreadcrumbLevelComponent } from '../breadcrumb-level/breadcrumb-level.component';

@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements AfterViewInit {

  @ContentChildren(BreadcrumbLevelComponent) levels: QueryList<BreadcrumbLevelComponent>;


  ngAfterViewInit() {
    console.log(this.levels);
  }


}
