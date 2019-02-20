import {
  Component,
  ContentChildren,
  QueryList, AfterContentInit, HostBinding, ViewChild, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy, Input
} from '@angular/core';
import { DropdownItemDirective } from '../../dropdown/dropdown-item.directive';
import { DropdownTriggerDirective, DropdownComponent } from '../../dropdown/dropdown';

@Component({
  selector: 'sbb-user-menu',
  exportAs: 'sbbUserMenu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent implements AfterContentInit, AfterViewInit {

  @HostBinding('class.sbb-user-menu') cssClass = true;
  @ContentChildren(DropdownItemDirective) items: QueryList<DropdownItemDirective>;
  @ViewChild(DropdownTriggerDirective) dropdownTrigger: DropdownTriggerDirective;
  @Input() loggedIn: boolean;



  constructor() { }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {
  }


}
