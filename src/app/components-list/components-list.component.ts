import { Component, OnInit } from '@angular/core';

import { NavlistComponent } from '../navlist-component/navlist.component';

@Component({
  selector: 'sbb-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss']
})
export class ComponentsListComponent extends NavlistComponent {
}
