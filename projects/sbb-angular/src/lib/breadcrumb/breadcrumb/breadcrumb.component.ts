import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterContentInit,
  ViewContainerRef,
  forwardRef,
  ViewChildren,
  AfterViewInit
} from '@angular/core';
import { BreadcrumbLevelDirective } from '../breadcrumb-level.directive';
import { DropdownTriggerDirective } from '../../dropdown/dropdown';

@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements AfterViewInit {


  @ContentChildren(BreadcrumbLevelDirective) levels: QueryList<BreadcrumbLevelDirective>;


  constructor(private viewContainerRef: ViewContainerRef) { }

  ngAfterViewInit() {
    console.log(this.levels);
  }

  isDropdownTrigger(level: BreadcrumbLevelDirective) {
    return level.elementRef.nativeElement.type === 'button';
  }
}
