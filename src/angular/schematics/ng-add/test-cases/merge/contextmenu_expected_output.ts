import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenu, SbbDropdownSelectedEvent } from '@sbb-esta/angular/menu';
import { SBB_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular/menu';

@Component({
  selector: 'sbb-contextmenu-test',
  template: `<button [sbbMenuTriggerFor]="menu2"><sbb-icon svgIcon="kom:context-menu-small" class="sbb-icon-fit"></sbb-icon></button>
      <!-- TODO: Removed properties [autoactivefirstoption], (opened), (optionselected), [panelwidth] because they no longer exist. --><sbb-menu
       
       
        [class]="'testclass'"
        (closed)="closed($event)"
       
       
        #dropdown
       #menu2="sbbMenu">
        <button sbb-menu-item (click)="assignLastAction($event)">
          <sbb-icon svgIcon="kom:face-worker-small"></sbb-icon> Copy
        </button>
        <button sbb-menu-item (click)="assignLastAction($event)">
          <sbb-icon svgIcon="kom:trash-small"></sbb-icon> Delete
        </button>
        <hr />
        <button sbb-menu-item (click)="assignLastAction($event)">
          <sbb-icon svgIcon="kom:cross-small"></sbb-icon> Cancel
        </button>
      </sbb-menu>
    
    <button [sbbMenuTriggerFor]="menu"><sbb-icon svgIcon="kom:context-menu-small" class="sbb-icon-fit"></sbb-icon></button>
      <sbb-menu #menu="sbbMenu"></sbb-menu>
    
    <button [sbbMenuTriggerFor]="menu3"><sbb-icon svgIcon="kom:context-menu-small" class="sbb-icon-fit"></sbb-icon></button>
      <sbb-menu #menu1 #menu3="sbbMenu"></sbb-menu>
    `,
})
export class SbbMenuTestComponent {
  @ViewChild('dropdown') dropdown: SbbMenu;

  constructor() {}

  closed($event: void) {}

  opened($event: void) {}

  optionSelected($event: SbbDropdownSelectedEvent) {}

  assignLastAction($event: any) {}
}

@NgModule({
  declarations: [SbbMenuTestComponent],
  imports: [SbbMenuModule, SbbIconModule],
})
export class ContextmenuTestModule {}
