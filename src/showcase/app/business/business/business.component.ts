import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { AutocompleteDisplayWithExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-display-with-example/autocomplete-display-with-example.component';
import { AutocompleteFormsExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-forms-example/autocomplete-forms-example.component';
import { AutocompleteHintExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-hint-example/autocomplete-hint-example.component';
import { AutocompleteLocaleNormalizerExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-locale-normalizer-example/autocomplete-locale-normalizer-example.component';
import { AutocompleteOptionGroupExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-option-group-example/autocomplete-option-group-example.component';
import { AutocompleteReactiveFormsExampleComponent } from '../business-examples/autocomplete-examples/autocomplete-reactive-forms-example/autocomplete-reactive-forms-example.component';
import { BreadcrumbExampleComponent } from '../business-examples/breadcrumb-examples/breadcrumb-example/breadcrumb-example.component';
import { ButtonExampleComponent } from '../business-examples/button-examples/button-example/button-example.component';
import { CheckboxExampleComponent } from '../business-examples/checkbox-examples/checkbox-example/checkbox-example.component';
import { AutocompleteChipInputExampleComponent } from '../business-examples/chip-examples/autocomplete-chip-input-example/autocomplete-chip-input-example.component';
import { DisabledChipInputExampleComponent } from '../business-examples/chip-examples/disabled-chip-input-example/disabled-chip-input-example.component';
import { FormsChipInputExampleComponent } from '../business-examples/chip-examples/forms-chip-input-example/forms-chip-input-example.component';
import { ReactiveFormsChipInputExampleComponent } from '../business-examples/chip-examples/reactive-forms-chip-input-example/reactive-forms-chip-input-example.component';
import { SimpleContextmenuExampleComponent } from '../business-examples/contextmenu-examples/simple-contextmenu-example/simple-contextmenu-example.component';
import { DatepickerBusinessDateAdapterExampleComponent } from '../business-examples/datepicker-examples/datepicker-business-date-adapter-example/datepicker-business-date-adapter-example.component';
import { DatepickerDateFilterExampleComponent } from '../business-examples/datepicker-examples/datepicker-date-filter-example/datepicker-date-filter-example.component';
import { DatepickerMasterSlaveExampleComponent } from '../business-examples/datepicker-examples/datepicker-master-slave-example/datepicker-master-slave-example.component';
import { DatepickerSimpleReactiveExampleComponent } from '../business-examples/datepicker-examples/datepicker-simple-reactive-example/datepicker-simple-reactive-example.component';
import { DatepickerStandaloneFormsExampleComponent } from '../business-examples/datepicker-examples/datepicker-standalone-forms-example/datepicker-standalone-forms-example.component';
import { DialogExampleComponent } from '../business-examples/dialog-examples/dialog-example/dialog-example.component';
import { MultipleModeDefaultFileSelectorExampleComponent } from '../business-examples/file-selector-examples/multiple-mode-default-file-selector-example/multiple-mode-default-file-selector-example.component';
import { MultipleModePersistentFileSelectorExampleComponent } from '../business-examples/file-selector-examples/multiple-mode-persistent-file-selector-example/multiple-mode-persistent-file-selector-example.component';
import { SimpleFileSelectorExampleComponent } from '../business-examples/file-selector-examples/simple-file-selector-example/simple-file-selector-example.component';
import { IconLinkExampleComponent } from '../business-examples/links-examples/icon-link-example/icon-link-example.component';
import { SimpleLinkExampleComponent } from '../business-examples/links-examples/simple-link-example/simple-link-example.component';
import { LoadingExampleComponent } from '../business-examples/loading-examples/loading-example/loading-example.component';
import { ClosableNotificationExampleComponent } from '../business-examples/notification-examples/closable-notification-example/closable-notification-example.component';
import { CustomIconNotificationExampleComponent } from '../business-examples/notification-examples/custom-icon-notification-example/custom-icon-notification-example.component';
import { JumpmarkNotificationExampleComponent } from '../business-examples/notification-examples/jumpmark-notification-example/jumpmark-notification-example.component';
import { SimpleNotificationExampleComponent } from '../business-examples/notification-examples/simple-notification-example/simple-notification-example.component';
import { NavigationExampleComponent } from '../business-examples/pagination-examples/navigation-example/navigation-example.component';
import { PaginatorExampleComponent } from '../business-examples/pagination-examples/paginator-example/paginator-example.component';
import { SkippableProcessflowExampleComponent } from '../business-examples/processflow-examples/skippable-processflow-example/skippable-processflow-example.component';
import { RadioButtonExampleComponent } from '../business-examples/radio-button-examples/radio-button-example/radio-button-example.component';
import { SelectFormsExampleComponent } from '../business-examples/select-examples/select-forms-example/select-forms-example.component';
import { SelectMultiSelectionExampleComponent } from '../business-examples/select-examples/select-multi-selection-example/select-multi-selection-example.component';
import { SelectNativeExampleComponent } from '../business-examples/select-examples/select-native-example/select-native-example.component';
import { SelectOptionGroupsExampleComponent } from '../business-examples/select-examples/select-option-groups-example/select-option-groups-example.component';
import { SelectOptionGroupsMultiSelectionExampleComponent } from '../business-examples/select-examples/select-option-groups-multi-selection-example/select-option-groups-multi-selection-example.component';
import { SelectReactiveFormsExampleComponent } from '../business-examples/select-examples/select-reactive-forms-example/select-reactive-forms-example.component';
import { FilterSortPaginatorTableExampleComponent } from '../business-examples/table-examples/filter-sort-paginator-table-example/filter-sort-paginator-table-example.component';
import { GroupedColumnsTableExampleComponent } from '../business-examples/table-examples/grouped-columns-table-example/grouped-columns-table-example.component';
import { GroupedRowsAndColumnsTableExampleComponent } from '../business-examples/table-examples/grouped-rows-and-columns-table-example/grouped-rows-and-columns-table-example.component';
import { PaginatorTableExampleComponent } from '../business-examples/table-examples/paginator-table-example/paginator-table-example.component';
import { SelectableTableExampleComponent } from '../business-examples/table-examples/selectable-table-example/selectable-table-example.component';
import { SimpleTableExampleComponent } from '../business-examples/table-examples/simple-table-example/simple-table-example.component';
import { SortableTableExampleComponent } from '../business-examples/table-examples/sortable-table-example/sortable-table-example.component';
import { TabsExampleComponent } from '../business-examples/tabs-examples/tabs-example/tabs-example.component';
import { TextareaFormsExampleComponent } from '../business-examples/textarea-examples/textarea-forms-example/textarea-forms-example.component';
import { TextareaNativeExampleComponent } from '../business-examples/textarea-examples/textarea-native-example/textarea-native-example.component';
import { TextareaReactiveFormsWithSbbFieldExampleComponent } from '../business-examples/textarea-examples/textarea-reactive-forms-with-sbbfield-example/textarea-reactive-forms-with-sbb-field-example.component';
import { TextexpandExampleComponent } from '../business-examples/textexpand-examples/textexpand-example/textexpand-example.component';
import { TooltipCustomContentExampleComponent } from '../business-examples/tooltip-examples/tooltip-custom-content-example/tooltip-custom-content-example.component';
import { TooltipCustomIconExampleComponent } from '../business-examples/tooltip-examples/tooltip-custom-icon-example/tooltip-custom-icon-example.component';
import { TooltipHoverExampleComponent } from '../business-examples/tooltip-examples/tooltip-hover-example/tooltip-hover-example.component';
import { TooltipSimpleExampleComponent } from '../business-examples/tooltip-examples/tooltip-simple-example/tooltip-simple-example.component';
import { UsermenuExampleComponent } from '../business-examples/usermenu-examples/usermenu-example/usermenu-example.component';

@Component({
  selector: 'sbb-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
  providers: [{ provide: ExampleProvider, useExisting: BusinessComponent }],
})
export class BusinessComponent implements ExampleProvider {
  formComponents = {
    autocomplete: 'Autocomplete',
    checkbox: 'Checkbox',
    chip: 'Chip Input',
    datepicker: 'Datepicker',
    field: 'Field',
    'file-selector': 'File Selector',
    'radio-button': 'Radiobutton',
    select: 'Select',
    textarea: 'Textarea',
    textexpand: 'Textexpand',
    'time-input': 'Time Input',
  };
  navigationComponents = {
    header: 'Header',
  };
  layoutComponents = {
    accordion: 'Accordion',
    breadcrumb: 'Breadcrumb',
    pagination: 'Pagination',
    notification: 'Notification',
    processflow: 'Processflow',
    tabs: 'Tabs',
    usermenu: 'Usermenu',
    table: 'Table',
  };
  buttonAndIndicatorComponents = {
    button: 'Button',
    contextmenu: 'Contextmenu',
    links: 'Links',
    loading: 'Loading',
  };
  popupsAndModals = {
    tooltip: 'Tooltip',
    dialog: 'Dialog',
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
      ),
      'autocomplete-display-with-example': new ComponentPortal(
        AutocompleteDisplayWithExampleComponent
      ),
      'autocomplete-locale-normalizer-example': new ComponentPortal(
        AutocompleteLocaleNormalizerExampleComponent
      ),
    },
    breadcrumb: {
      'breadcrumb-example': new ComponentPortal(BreadcrumbExampleComponent),
    },
    checkbox: {
      'checkbox-example': new ComponentPortal(CheckboxExampleComponent),
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
      ),
    },
    processflow: {
      'skippable-processflow-example': new ComponentPortal(SkippableProcessflowExampleComponent),
    },
    contextmenu: {
      'simple-contextmenu-example': new ComponentPortal(SimpleContextmenuExampleComponent),
    },
    tooltip: {
      'tooltip-simple-example': new ComponentPortal(TooltipSimpleExampleComponent),
      'tooltip-custom-content-example': new ComponentPortal(TooltipCustomContentExampleComponent),
      'tooltip-custom-icon-example': new ComponentPortal(TooltipCustomIconExampleComponent),
      'tooltip-hover-example': new ComponentPortal(TooltipHoverExampleComponent),
    },
    usermenu: {
      'usermenu-example': new ComponentPortal(UsermenuExampleComponent),
    },
    tabs: {
      'tabs-example': new ComponentPortal(TabsExampleComponent),
    },
    dialog: {
      'dialog-example': new ComponentPortal(DialogExampleComponent),
    },
    pagination: {
      'paginator-example': new ComponentPortal(PaginatorExampleComponent),
      'navigation-example': new ComponentPortal(NavigationExampleComponent),
    },
    notification: {
      'simple-notification-example': new ComponentPortal(SimpleNotificationExampleComponent),
      'custom-icon-notification-example': new ComponentPortal(
        CustomIconNotificationExampleComponent
      ),
      'jumpmark-notification-example': new ComponentPortal(JumpmarkNotificationExampleComponent),
      'closable-notification-example': new ComponentPortal(ClosableNotificationExampleComponent),
    },
    table: {
      'simple-table-example': new ComponentPortal(SimpleTableExampleComponent),
      'grouped-columns-table-example': new ComponentPortal(GroupedColumnsTableExampleComponent),
      'grouped-rows-and-columns-table-example': new ComponentPortal(
        GroupedRowsAndColumnsTableExampleComponent
      ),
      'sortable-table-example': new ComponentPortal(SortableTableExampleComponent),
      'paginator-table-example': new ComponentPortal(PaginatorTableExampleComponent),
      'selectable-table-example': new ComponentPortal(SelectableTableExampleComponent),
      'filter-sort-paginator-table-example': new ComponentPortal(
        FilterSortPaginatorTableExampleComponent
      ),
    },
    chip: {
      'forms-chip-input-example': new ComponentPortal(FormsChipInputExampleComponent),
      'reactive-forms-chip-input-example': new ComponentPortal(
        ReactiveFormsChipInputExampleComponent
      ),
      'disabled-chip-input-example': new ComponentPortal(DisabledChipInputExampleComponent),
      'autocomplete-chip-input-example': new ComponentPortal(AutocompleteChipInputExampleComponent),
    },
    'radio-button': {
      'radio-button-example': new ComponentPortal(RadioButtonExampleComponent),
    },
    select: {
      'select-reactive-forms-example': new ComponentPortal(SelectReactiveFormsExampleComponent),
      'select-forms-example': new ComponentPortal(SelectFormsExampleComponent),
      'select-native-example': new ComponentPortal(SelectNativeExampleComponent),
      'select-multi-selection-example': new ComponentPortal(SelectMultiSelectionExampleComponent),
      'select-option-groups-example': new ComponentPortal(SelectOptionGroupsExampleComponent),
      'select-option-groups-multi-selection-example': new ComponentPortal(
        SelectOptionGroupsMultiSelectionExampleComponent
      ),
    },
    textarea: {
      'textarea-forms-example': new ComponentPortal(TextareaFormsExampleComponent),
      'textarea-reactive-forms-with-sbb-field-example': new ComponentPortal(
        TextareaReactiveFormsWithSbbFieldExampleComponent
      ),
      'textarea-native-example': new ComponentPortal(TextareaNativeExampleComponent),
    },
    'file-selector': {
      'simple-file-selector-example': new ComponentPortal(SimpleFileSelectorExampleComponent),
      'multiple-mode-default-file-selector-example': new ComponentPortal(
        MultipleModeDefaultFileSelectorExampleComponent
      ),
      'multiple-mode-persistent-file-selector-example': new ComponentPortal(
        MultipleModePersistentFileSelectorExampleComponent
      ),
    },
    button: { 'button-example': new ComponentPortal(ButtonExampleComponent) },
    links: {
      'simple-link-example': new ComponentPortal(SimpleLinkExampleComponent),
      'icon-link-example': new ComponentPortal(IconLinkExampleComponent),
    },
    textexpand: { 'textexpand-example': new ComponentPortal(TextexpandExampleComponent) },
    loading: { 'loading-example': new ComponentPortal(LoadingExampleComponent) },
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}
