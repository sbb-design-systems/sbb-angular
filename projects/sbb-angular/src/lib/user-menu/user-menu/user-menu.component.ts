import {
  Component,
  ContentChildren,
  QueryList, AfterContentInit, HostBinding, ElementRef, ChangeDetectorRef, ViewChild, AfterViewInit, TemplateRef
} from '@angular/core';
import { DropdownItemDirective } from '../../dropdown/dropdown-item.directive';
import { DropdownTriggerDirective, DropdownComponent } from '../../dropdown/dropdown';

@Component({
  selector: 'sbb-user-menu',
  exportAs: 'sbbUserMenu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements AfterContentInit, AfterViewInit {

  @HostBinding('class.sbb-user-menu') cssClass = true;
  renderIt = false;
  @ContentChildren(DropdownItemDirective) content: QueryList<DropdownItemDirective>;
  @ViewChild(DropdownTriggerDirective) dropdownTrigger: DropdownTriggerDirective;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterContentInit() {
    /*  console.log(this.items);
     this.dropdown.options = this.items;
     this.dropdown.ngAfterContentInit();
     this.trigger.dropdown = this.dropdown;
     this.trigger.openPanel(); */
    // this.conversionElement();

  }


  ngAfterViewInit() {
    console.log(this.dropdownTrigger);
    console.log(this.content);
    this.renderIt = true;
    this.changeDetectorRef.detectChanges();
  }

  private conversionElement() {

    /*     const items: Array<DropdownItemDirective> = this.projectedContent.map(content => {
          return new DropdownItemDirective(content, this.changeDetectorRef);
        });
        console.log(items); */

    /*  this.items.reset(items); */
  }
}
