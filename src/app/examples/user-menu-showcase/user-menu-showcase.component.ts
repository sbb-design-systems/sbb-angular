import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { LinkGeneratorResult, UserMenuComponent } from 'sbb-angular';
import { DropdownTriggerDirective } from 'projects/sbb-angular/src/lib/dropdown/dropdown-trigger.directive';

@Component({
  selector: 'sbb-user-menu-showcase',
  templateUrl: './user-menu-showcase.component.html',
  styleUrls: ['./user-menu-showcase.component.scss']
})
export class UserMenuShowcaseComponent implements OnInit {

  @ViewChildren(DropdownTriggerDirective) triggers: QueryList<DropdownTriggerDirective>;

  loggedIn = false;

  links: Array<any> = [
    { page: 1, text: 'Test 1' },
    { page: 2, text: 'Test 2' },
    { page: 3, text: 'Test 3' }
  ];

  constructor() { }

  ngOnInit() {
  }

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  logout() {

    console.log('Button clicked');
    this.loggedIn = false;

  }

  logIn() {
    this.loggedIn = true;

  }
}
