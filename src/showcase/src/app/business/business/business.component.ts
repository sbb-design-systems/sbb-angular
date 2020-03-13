import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { AutocompleteFormsShowcaseComponent } from '../business-examples/autocomplete-forms-showcase/autocomplete-forms-showcase.component';
import { AutocompleteHintShowcaseComponent } from '../business-examples/autocomplete-hint-showcase/autocomplete-hint-showcase.component';
import { AutocompleteOptionGroupShowcaseComponent } from '../business-examples/autocomplete-option-group-showcase/autocomplete-option-group-showcase.component';
import { AutocompleteReactiveFormsShowcaseComponent } from '../business-examples/autocomplete-reactive-forms-showcase/autocomplete-reactive-forms-showcase.component';
import { BreadcrumbShowcaseComponent } from '../business-examples/breadcrumb-showcase/breadcrumb-showcase.component';
import { AutocompleteChipInputComponent } from '../business-examples/chip-showcase/autocomplete-chip-input/autocomplete-chip-input.component';
import { DisabledChipInputComponent } from '../business-examples/chip-showcase/disabled-chip-input/disabled-chip-input.component';
import { FormsChipInputComponent } from '../business-examples/chip-showcase/forms-chip-input/forms-chip-input.component';
import { ReactiveFormsChipInputComponent } from '../business-examples/chip-showcase/reactive-forms-chip-input/reactive-forms-chip-input.component';
import { DatepickerBusinessDateAdapterShowcaseComponent } from '../business-examples/datepicker-business-date-adapter-showcase/datepicker-business-date-adapter-showcase.component';
import { DatepickerDateFilterShowcaseComponent } from '../business-examples/datepicker-date-filter-showcase/datepicker-date-filter-showcase.component';
import { DatepickerMasterSlaveShowcaseComponent } from '../business-examples/datepicker-master-slave-showcase/datepicker-master-slave-showcase.component';
import { DatepickerSimpleReactiveShowcaseComponent } from '../business-examples/datepicker-simple-reactive-showcase/datepicker-simple-reactive-showcase.component';
import { DatepickerStandaloneFormsShowcaseComponent } from '../business-examples/datepicker-standalone-forms-showcase/datepicker-standalone-forms-showcase.component';
import { DialogShowcaseComponent } from '../business-examples/dialog-showcase/dialog-showcase.component';
import { ClosableNotificationComponent } from '../business-examples/notification-showcase/closable-notification/closable-notification.component';
import { CustomIconNotificationComponent } from '../business-examples/notification-showcase/custom-icon-notification/custom-icon-notification.component';
import { JumpmarkNotificationComponent } from '../business-examples/notification-showcase/jumpmark-notification/jumpmark-notification.component';
import { SimpleNotificationComponent } from '../business-examples/notification-showcase/simple-notification/simple-notification.component';
import { PaginationShowcaseComponent } from '../business-examples/pagination-showcase/pagination-showcase.component';
import { SelectFormsComponent } from '../business-examples/select-forms/select-forms.component';
import { SelectMultiSelectionComponent } from '../business-examples/select-multi-selection/select-multi-selection.component';
import { SelectNativeComponent } from '../business-examples/select-native/select-native.component';
import { SelectOptionGroupsMultiSelectionComponent } from '../business-examples/select-option-groups-multi-selection/select-option-groups-multi-selection.component';
import { SelectOptionGroupsComponent } from '../business-examples/select-option-groups/select-option-groups.component';
import { SelectReactiveFormsComponent } from '../business-examples/select-reactive-forms/select-reactive-forms.component';
import { SimpleContextmenuComponent } from '../business-examples/simple-contextmenu/simple-contextmenu.component';
import { SkippableProcessflowComponent } from '../business-examples/skippable-processflow/skippable-processflow.component';
import { GroupedColumnsTableComponent } from '../business-examples/table-showcase/grouped-columns-table/grouped-columns-table.component';
import { GroupedRowsTableComponent } from '../business-examples/table-showcase/grouped-rows-table/grouped-rows-table.component';
import { SimpleTableComponent } from '../business-examples/table-showcase/simple-table/simple-table.component';
import { SortableTableComponent } from '../business-examples/table-showcase/sortable-table/sortable-table.component';
import { TabsShowcaseComponent } from '../business-examples/tabs-showcase/tabs-showcase.component';
import { TextareaFormsShowcaseComponent } from '../business-examples/textarea-forms-showcase/textarea-forms-showcase.component';
import { TextareaNativeShowcaseComponent } from '../business-examples/textarea-native-showcase/textarea-native-showcase.component';
import { TextareaReactiveFormsWithSbbFieldShowcaseComponent } from '../business-examples/textarea-reactive-forms-with-sbbfield-showcase/textarea-reactive-forms-with-sbb-field-showcase.component';
import { TooltipCustomContentShowcaseComponent } from '../business-examples/tooltip-custom-content-showcase/tooltip-custom-content-showcase.component';
import { TooltipCustomIconShowcaseComponent } from '../business-examples/tooltip-custom-icon-showcase/tooltip-custom-icon-showcase.component';
import { TooltipHoverShowcaseComponent } from '../business-examples/tooltip-hover-showcase/tooltip-hover-showcase.component';
import { TooltipSimpleShowcaseComponent } from '../business-examples/tooltip-simple-showcase/tooltip-simple-showcase.component';
import { UsermenuShowcaseComponent } from '../business-examples/usermenu-showcase/usermenu-showcase.component';

@Component({
  selector: 'sbb-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
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
    breadcrumb: 'Breadcrumb',
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
    autocomplete: {
      'autocomplete-reactive-forms-showcase': new ComponentPortal(
        AutocompleteReactiveFormsShowcaseComponent
      ),
      'autocomplete-forms-showcase': new ComponentPortal(AutocompleteFormsShowcaseComponent),
      'autocomplete-hint-showcase': new ComponentPortal(AutocompleteHintShowcaseComponent),
      'autocomplete-option-group-showcase': new ComponentPortal(
        AutocompleteOptionGroupShowcaseComponent
      )
    },
    breadcrumb: {
      'breadcrumb-showcase': new ComponentPortal(BreadcrumbShowcaseComponent)
    },
    processflow: {
      'skippable-processflow': new ComponentPortal(SkippableProcessflowComponent)
    },
    contextmenu: {
      'simple-contextmenu': new ComponentPortal(SimpleContextmenuComponent)
    },
    tooltip: {
      'tooltip-simple-showcase': new ComponentPortal(TooltipSimpleShowcaseComponent),
      'tooltip-custom-content-showcase': new ComponentPortal(TooltipCustomContentShowcaseComponent),
      'tooltip-custom-icon-showcase': new ComponentPortal(TooltipCustomIconShowcaseComponent),
      'tooltip-hover-showcase': new ComponentPortal(TooltipHoverShowcaseComponent)
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
      'forms-chip-input': new ComponentPortal(FormsChipInputComponent),
      'reactive-forms-chip-input': new ComponentPortal(ReactiveFormsChipInputComponent),
      'disabled-chip-input': new ComponentPortal(DisabledChipInputComponent),
      'autocomplete-chip-input': new ComponentPortal(AutocompleteChipInputComponent)
    },
    select: {
      'select-reactive-forms': new ComponentPortal(SelectReactiveFormsComponent),
      'select-forms': new ComponentPortal(SelectFormsComponent),
      'select-native': new ComponentPortal(SelectNativeComponent),
      'select-multi-selection': new ComponentPortal(SelectMultiSelectionComponent),
      'select-option-groups': new ComponentPortal(SelectOptionGroupsComponent),
      'select-option-groups-multi-selection': new ComponentPortal(
        SelectOptionGroupsMultiSelectionComponent
      )
    },
    textarea: {
      'textarea-forms-showcase': new ComponentPortal(TextareaFormsShowcaseComponent),
      'textarea-reactive-forms-with-sbb-field-showcase': new ComponentPortal(
        TextareaReactiveFormsWithSbbFieldShowcaseComponent
      ),
      'textarea-native': new ComponentPortal(TextareaNativeShowcaseComponent)
    },
    datepicker: {
      'datepicker-simple-reactive-showcase': new ComponentPortal(
        DatepickerSimpleReactiveShowcaseComponent
      ),
      'datepicker-master-slave-showcase': new ComponentPortal(
        DatepickerMasterSlaveShowcaseComponent
      ),
      'datepicker-date-filter-showcase': new ComponentPortal(DatepickerDateFilterShowcaseComponent),
      'datepicker-standalone-forms-showcase': new ComponentPortal(
        DatepickerStandaloneFormsShowcaseComponent
      ),
      'datepicker-businessDateAdapter-showcase': new ComponentPortal(
        DatepickerBusinessDateAdapterShowcaseComponent
      )
    }
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}
