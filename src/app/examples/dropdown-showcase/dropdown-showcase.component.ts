import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { LinkGeneratorResult } from 'sbb-angular';
import { DropdownTriggerDirective } from 'projects/sbb-angular/src/lib/dropdown/dropdown';

@Component({
  selector: 'sbb-dropdown-showcase',
  templateUrl: './dropdown-showcase.component.html',
  styleUrls: ['./dropdown-showcase.component.scss']
})
export class DropdownShowcaseComponent {

  @ViewChildren(DropdownTriggerDirective) triggers: QueryList<DropdownTriggerDirective>;

  links: Array<any> = [
    { page: 1, text: 'Test 1' },
    { page: 2, text: 'Test 2' },
    { page: 3, text: 'Test 3' }
  ];

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }


  onClick() {
    console.log('Button clicked');

  }

  addNewLink() {
    this.links.push({ page: this.links.length + 1, text: 'Test ' + (this.links.length + 1) });
  }

}
