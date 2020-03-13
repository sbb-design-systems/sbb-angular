import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent {
  @HostBinding('class.sbb-scrollbar') scrollbar = true;
  @HostBinding('attr.role') role = 'navigation';
}
