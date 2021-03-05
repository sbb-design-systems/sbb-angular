import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbDropdown, SbbDropdownSelectedEvent } from '@sbb-esta/angular-public/dropdown';

@Component({
  selector: 'sbb-contextmenu-test',
  template: `<sbb-contextmenu>
    <sbb-dropdown
      [autoActiveFirstOption]="true"
      [panelWidth]="20"
      [class]="'testclass'"
      (closed)="closed($event)"
      (opened)="opened($event)"
      (optionSelected)="optionSelected($event)"
      #dropdown
    >
      <button sbbDropdownItem (click)="assignLastAction($event)">
        <sbb-icon svgIcon="kom:face-worker-small"></sbb-icon> Copy
      </button>
      <button sbbDropdownItem (click)="assignLastAction($event)">
        <sbb-icon svgIcon="kom:trash-small"></sbb-icon> Delete
      </button>
      <hr />
      <button sbbDropdownItem (click)="assignLastAction($event)">
        <sbb-icon svgIcon="kom:cross-small"></sbb-icon> Cancel
      </button>
    </sbb-dropdown>
  </sbb-contextmenu>`,
})
export class SbbMenuTestComponent {
  @ViewChild('dropdown') dropdown: SbbDropdown;

  constructor() {
    this.dropdown.closed.subscribe();
    this.dropdown.opened.subscribe();
    this.dropdown.optionSelected.subscribe();

    this.dropdown.id;
    this.dropdown.panel;
    this.dropdown.panelWidth;
    this.dropdown.options;
    this.dropdown.showPanel;
  }

  closed($event: void) {}

  opened($event: void) {}

  optionSelected($event: SbbDropdownSelectedEvent) {}

  assignLastAction($event: any) {}
}

@NgModule({
  declarations: [SbbMenuTestComponent],
  imports: [SbbContextmenuModule, SbbIconModule],
})
export class ContextmenuTestModule {}
