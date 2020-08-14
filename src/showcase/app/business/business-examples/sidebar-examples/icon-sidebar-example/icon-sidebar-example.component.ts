import { Component, ViewChild } from '@angular/core';
import { SbbIconSidebarContainer } from '@sbb-esta/angular-business/sidebar';

@Component({
  selector: 'sbb-icon-sidebar-example',
  templateUrl: './icon-sidebar-example.component.html',
  styleUrls: ['./icon-sidebar-example.component.css'],
})
export class IconSidebarExampleComponent {
  @ViewChild(SbbIconSidebarContainer) sbbIconSidebarContainer;
  expanded = true;

  get simulateMobile(): boolean {
    return this._simulateMobile;
  }

  set simulateMobile(value: boolean) {
    this.sbbIconSidebarContainer._updateMobileState(value);
    this._simulateMobile = value;
  }

  private _simulateMobile = false;
}
