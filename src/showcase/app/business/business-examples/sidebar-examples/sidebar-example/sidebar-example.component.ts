import { Component, ViewChild } from '@angular/core';
import { SbbSidebarContainer } from '@sbb-esta/angular-business/sidebar';

@Component({
  selector: 'sbb-sidebar-example',
  templateUrl: './sidebar-example.component.html',
  styleUrls: ['./sidebar-example.component.css'],
})
export class SidebarExampleComponent {
  @ViewChild(SbbSidebarContainer) sbbSidebarContainer;

  get simulateMobile(): boolean {
    return this._simulateMobile;
  }

  set simulateMobile(value: boolean) {
    this.sbbSidebarContainer._updateMobileState(value);
    this._simulateMobile = value;
  }

  private _simulateMobile = false;
}
