import { Component } from '@angular/core';

/**
 * @title Basic use of the tab nav bar
 * @order 80
 */
@Component({
  selector: 'sbb-tab-nav-bar-basic-example',
  templateUrl: 'tab-nav-bar-basic-example.html',
  styleUrls: ['tab-nav-bar-basic-example.css'],
})
export class TabNavBarBasicExample {
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }
}
