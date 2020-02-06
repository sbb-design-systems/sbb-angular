import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { DisabledChipInputComponent } from '../business-examples/chip-showcase/disabled-chip-input/disabled-chip-input.component';
import { SimpleChipInputComponent } from '../business-examples/chip-showcase/simple-chip-input/simple-chip-input.component';
import { DialogShowcaseComponent } from '../business-examples/dialog-showcase/dialog-showcase.component';
import { ClosableNotificationComponent } from '../business-examples/notification-showcase/closable-notification/closable-notification.component';
import { CustomIconNotificationComponent } from '../business-examples/notification-showcase/custom-icon-notification/custom-icon-notification.component';
import { JumpmarkNotificationComponent } from '../business-examples/notification-showcase/jumpmark-notification/jumpmark-notification.component';
import { SimpleNotificationComponent } from '../business-examples/notification-showcase/simple-notification/simple-notification.component';
import { ToastNotificationComponent } from '../business-examples/notification-showcase/toast-notification/toast-notification.component';
import { PaginationShowcaseComponent } from '../business-examples/pagination-showcase/pagination-showcase.component';
import { SimpleContextmenuComponent } from '../business-examples/simple-contextmenu/simple-contextmenu.component';
import { SkippableProcessflowComponent } from '../business-examples/skippable-processflow/skippable-processflow.component';
import { GroupedColumnsTableComponent } from '../business-examples/table-showcase/grouped-columns-table/grouped-columns-table.component';
import { GroupedRowsTableComponent } from '../business-examples/table-showcase/grouped-rows-table/grouped-rows-table.component';
import { SimpleTableComponent } from '../business-examples/table-showcase/simple-table/simple-table.component';
import { SortableTableComponent } from '../business-examples/table-showcase/sortable-table/sortable-table.component';
import { TabsShowcaseComponent } from '../business-examples/tabs-showcase/tabs-showcase.component';
import { TooltipShowcaseComponent } from '../business-examples/tooltip-showcase/tooltip-showcase.component';
import { UsermenuShowcaseComponent } from '../business-examples/usermenu-showcase/usermenu-showcase.component';

@Component({
  selector: 'sbb-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  providers: [{ provide: ExampleProvider, useExisting: BusinessComponent }]
})
export class BusinessComponent implements ExampleProvider {
  formComponents = {
    autocomplete: 'Autocomplete',
    checkbox: 'Checkbox',
    chip: 'Chip Input',
    datepicker: 'Datepicker',
    field: 'Field',
    'radio-button': 'Radiobutton',
    select: 'Select',
    textarea: 'Textarea',
    'time-input': 'Time Input'
  };
  navigationComponents = {
    header: 'Header'
  };
  layoutComponents = {
    accordion: 'Accordion',
    pagination: 'Pagination',
    notification: 'Notification',
    processflow: 'Processflow',
    tabs: 'Tabs',
    usermenu: 'Usermenu',
    table: 'Table'
  };
  buttonAndIndicatorComponents = {
    button: 'Button',
    contextmenu: 'Contextmenu'
  };
  popupsAndModals = {
    tooltip: 'Tooltip',
    dialog: 'Dialog'
  };
  private _examples: { [component: string]: { [name: string]: ComponentPortal<any> } } = {
    processflow: {
      'skippable-processflow': new ComponentPortal(SkippableProcessflowComponent)
    },
    contextmenu: {
      'simple-contextmenu': new ComponentPortal(SimpleContextmenuComponent)
    },
    tooltip: {
      'tooltip-showcase': new ComponentPortal(TooltipShowcaseComponent)
    },
    usermenu: {
      'usermenu-showcase': new ComponentPortal(UsermenuShowcaseComponent)
    },
    tabs: {
      'tabs-showcase': new ComponentPortal(TabsShowcaseComponent)
    },
    dialog: {
      'dialog-showcase': new ComponentPortal(DialogShowcaseComponent)
    },
    pagination: {
      'pagination-showcase': new ComponentPortal(PaginationShowcaseComponent)
    },
    notification: {
      'simple-notification': new ComponentPortal(SimpleNotificationComponent),
      'custom-icon-notification': new ComponentPortal(CustomIconNotificationComponent),
      'toast-notification': new ComponentPortal(ToastNotificationComponent),
      'jumpmark-notification': new ComponentPortal(JumpmarkNotificationComponent),
      'closable-notification': new ComponentPortal(ClosableNotificationComponent)
    },
    table: {
      'simple-table': new ComponentPortal(SimpleTableComponent),
      'grouped-columns-table': new ComponentPortal(GroupedColumnsTableComponent),
      'grouped-rows-table': new ComponentPortal(GroupedRowsTableComponent),
      'sortable-table': new ComponentPortal(SortableTableComponent)
    },
    chip: {
      'simple-chip-input-showcase': new ComponentPortal(SimpleChipInputComponent),
      'disabled-chip-input-showcase': new ComponentPortal(DisabledChipInputComponent)
    }
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}
