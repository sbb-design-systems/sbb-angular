import { Component, QueryList, ViewChildren } from '@angular/core';
import { DropdownTriggerDirective } from '@sbb-esta/angular-public/dropdown';

interface DropdownLink {
  page: number;
  text: string;
}

@Component({
  selector: 'sbb-dropdown-example',
  templateUrl: './dropdown-example.component.html',
  styleUrls: ['./dropdown-example.component.css']
})
export class DropdownExampleComponent {
  @ViewChildren(DropdownTriggerDirective) triggers: QueryList<DropdownTriggerDirective>;

  links: Array<DropdownLink> = [
    { page: 1, text: 'Test 1' },
    { page: 2, text: 'Test 2' },
    { page: 3, text: 'Test 3' }
  ];

  linkGenerator(page: number) {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  onClick() {
    console.log('Button clicked');
  }

  addNewLink() {
    this.links.push({
      page: this.links.length + 1,
      text: 'Test ' + (this.links.length + 1)
    });
  }
}
