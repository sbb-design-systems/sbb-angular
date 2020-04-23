import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { AutocompleteFormsExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-forms-example/autocomplete-forms-example.component';
import { AutocompleteHintExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-hint-example/autocomplete-hint-example.component';
import { AutocompleteOptionGroupExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-option-group-example/autocomplete-option-group-example.component';
import { AutocompleteReactiveFormsExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-reactive-forms-example/autocomplete-reactive-forms-example.component';
import { BreadcrumbExampleComponent } from '../business-examples/breadcrumb-examples/breadcrumb-example/breadcrumb-example.component';
import { CheckboxExampleComponent } from '../business-examples/checkbox-examples/checkbox-example/checkbox-example.component';
import { AutocompleteChipInputComponent } from '../business-examples/chip-examples/autocomplete-chip-input/autocomplete-chip-input.component';
import { DisabledChipInputComponent } from '../business-examples/chip-examples/disabled-chip-input/disabled-chip-input.component';
import { FormsChipInputComponent } from '../business-examples/chip-examples/forms-chip-input/forms-chip-input.component';
import { ReactiveFormsChipInputComponent } from '../business-examples/chip-examples/reactive-forms-chip-input/reactive-forms-chip-input.component';
import { SimpleContextmenuComponent } from '../business-examples/contextmenu-examples/simple-contextmenu/simple-contextmenu.component';
import { DatepickerBusinessDateAdapterExampleComponent } from '../business-examples/datepicker-examples/datepicker-business-date-adapter-example/datepicker-business-date-adapter-example.component';
import { DatepickerDateFilterExampleComponent } from '../business-examples/datepicker-examples/datepicker-date-filter-example/datepicker-date-filter-example.component';
import { DatepickerMasterSlaveExampleComponent } from '../business-examples/datepicker-examples/datepicker-master-slave-example/datepicker-master-slave-example.component';
import { DatepickerSimpleReactiveExampleComponent } from '../business-examples/datepicker-examples/datepicker-simple-reactive-example/datepicker-simple-reactive-example.component';
import { DatepickerStandaloneFormsExampleComponent } from '../business-examples/datepicker-examples/datepicker-standalone-forms-example/datepicker-standalone-forms-example.component';
import { DialogExampleComponent } from '../business-examples/dialog-examples/dialog-example/dialog-example.component';
import { ClosableNotificationComponent } from '../business-examples/notification-examples/closable-notification/closable-notification.component';
import { CustomIconNotificationComponent } from '../business-examples/notification-examples/custom-icon-notification/custom-icon-notification.component';
import { JumpmarkNotificationComponent } from '../business-examples/notification-examples/jumpmark-notification/jumpmark-notification.component';
import { SimpleNotificationComponent } from '../business-examples/notification-examples/simple-notification/simple-notification.component';
import { PaginationExampleComponent } from '../business-examples/pagination-examples/pagination-example/pagination-example.component';
import { SkippableProcessflowComponent } from '../business-examples/processflow-examples/skippable-processflow/skippable-processflow.component';
import { SelectFormsComponent } from '../business-examples/select-examples/select-forms/select-forms.component';
import { SelectMultiSelectionComponent } from '../business-examples/select-examples/select-multi-selection/select-multi-selection.component';
import { SelectNativeComponent } from '../business-examples/select-examples/select-native/select-native.component';
import { SelectOptionGroupsMultiSelectionComponent } from '../business-examples/select-examples/select-option-groups-multi-selection/select-option-groups-multi-selection.component';
import { SelectOptionGroupsComponent } from '../business-examples/select-examples/select-option-groups/select-option-groups.component';
import { SelectReactiveFormsComponent } from '../business-examples/select-examples/select-reactive-forms/select-reactive-forms.component';
import { GroupedColumnsTableComponent } from '../business-examples/table-examples/grouped-columns-table/grouped-columns-table.component';
import { GroupedRowsTableComponent } from '../business-examples/table-examples/grouped-rows-table/grouped-rows-table.component';
import { SimpleTableComponent } from '../business-examples/table-examples/simple-table/simple-table.component';
import { SortableTableComponent } from '../business-examples/table-examples/sortable-table/sortable-table.component';
import { TabsExampleComponent } from '../business-examples/tabs-examples/tabs-example/tabs-example.component';
import { TextareaFormsExampleComponent } from '../business-examples/textarea-examples/textarea-forms-example/textarea-forms-example.component';
import { TextareaNativeExampleComponent } from '../business-examples/textarea-examples/textarea-native-example/textarea-native-example.component';
import { TextareaReactiveFormsWithSbbFieldExampleComponent } from '../business-examples/textarea-examples/textarea-reactive-forms-with-sbbfield-example/textarea-reactive-forms-with-sbb-field-example.component';
import { TooltipCustomContentExampleComponent } from '../business-examples/tooltip-examples/tooltip-custom-content-example/tooltip-custom-content-example.component';
import { TooltipCustomIconExampleComponent } from '../business-examples/tooltip-examples/tooltip-custom-icon-example/tooltip-custom-icon-example.component';
import { TooltipHoverExampleComponent } from '../business-examples/tooltip-examples/tooltip-hover-example/tooltip-hover-example.component';
import { TooltipSimpleExampleComponent } from '../business-examples/tooltip-examples/tooltip-simple-example/tooltip-simple-example.component';
import { UsermenuExampleComponent } from '../business-examples/usermenu-examples/usermenu-example/usermenu-example.component';

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
      'autocomplete-reactive-forms-example': new ComponentPortal(
        AutocompleteReactiveFormsExampleComponent
      ),
      'autocomplete-forms-example': new ComponentPortal(AutocompleteFormsExampleComponent),
      'autocomplete-hint-example': new ComponentPortal(AutocompleteHintExampleComponent),
      'autocomplete-option-group-example': new ComponentPortal(
        AutocompleteOptionGroupExampleComponent
      )
    },
    breadcrumb: {
      'breadcrumb-example': new ComponentPortal(BreadcrumbExampleComponent)
    },
    checkbox: {
      'checkbox-example': new ComponentPortal(CheckboxExampleComponent)
    },
    datepicker: {
      'datepicker-simple-reactive-example': new ComponentPortal(
        DatepickerSimpleReactiveExampleComponent
      ),
      'datepicker-master-slave-example': new ComponentPortal(DatepickerMasterSlaveExampleComponent),
      'datepicker-date-filter-example': new ComponentPortal(DatepickerDateFilterExampleComponent),
      'datepicker-standalone-forms-example': new ComponentPortal(
        DatepickerStandaloneFormsExampleComponent
      ),
      'datepicker-business-date-adapter-example': new ComponentPortal(
        DatepickerBusinessDateAdapterExampleComponent
      )
    },
    processflow: {
      'skippable-processflow': new ComponentPortal(SkippableProcessflowComponent)
    },
    contextmenu: {
      'simple-contextmenu': new ComponentPortal(SimpleContextmenuComponent)
    },
    tooltip: {
      'tooltip-simple-example': new ComponentPortal(TooltipSimpleExampleComponent),
      'tooltip-custom-content-example': new ComponentPortal(TooltipCustomContentExampleComponent),
      'tooltip-custom-icon-example': new ComponentPortal(TooltipCustomIconExampleComponent),
      'tooltip-hover-example': new ComponentPortal(TooltipHoverExampleComponent)
    },
    usermenu: {
      'usermenu-example': new ComponentPortal(UsermenuExampleComponent)
    },
    tabs: {
      'tabs-example': new ComponentPortal(TabsExampleComponent)
    },
    dialog: {
      'dialog-example': new ComponentPortal(DialogExampleComponent)
    },
    pagination: {
      'pagination-example': new ComponentPortal(PaginationExampleComponent)
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
      'textarea-forms-example': new ComponentPortal(TextareaFormsExampleComponent),
      'textarea-reactive-forms-with-sbb-field-example': new ComponentPortal(
        TextareaReactiveFormsWithSbbFieldExampleComponent
      ),
      'textarea-native': new ComponentPortal(TextareaNativeExampleComponent)
    }
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}
