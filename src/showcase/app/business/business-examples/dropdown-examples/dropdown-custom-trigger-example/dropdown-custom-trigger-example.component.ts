import { Component } from '@angular/core';

interface DropdownLink {
  page: number;
  text: string;
}

@Component({
  selector: 'sbb-dropdown-custom-trigger-example',
  templateUrl: './dropdown-custom-trigger-example.component.html',
  styleUrls: ['./dropdown-custom-trigger-example.component.css'],
})
export class DropdownCustomTriggerExampleComponent {
  links: Array<DropdownLink> = [
    { page: 1, text: 'Test 1' },
    { page: 2, text: 'Test 2' },
    { page: 3, text: 'Test 3' },
  ];

  linkGenerator(page: number) {
    return {
      queryParams: { page: page },
      routerLink: ['.'],
    };
  }

  onClick() {
    console.log('Button clicked');
  }
}
