import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { AccordionExampleComponent } from '../public-examples/accordion-examples/accordion-example/accordion-example.component';
import { AutocompleteFormsExampleComponent } from '../public-examples/autocomplete-examples/autocomplete-forms-example/autocomplete-forms-example.component';
import { AutocompleteHintExampleComponent } from '../public-examples/autocomplete-examples/autocomplete-hint-example/autocomplete-hint-example.component';
import { AutocompleteOptionGroupExampleComponent } from '../public-examples/autocomplete-examples/autocomplete-option-group-example/autocomplete-option-group-example.component';
import { AutocompleteReactiveFormsExampleComponent } from '../public-examples/autocomplete-examples/autocomplete-reactive-forms-example/autocomplete-reactive-forms-example.component';
import { BadgeExampleComponent } from '../public-examples/badge-examples/badge-example/badge-example.component';
import { BreadcrumbExampleComponent } from '../public-examples/breadcrumb-examples/breadcrumb-example/breadcrumb-example.component';
import { ButtonExampleComponent } from '../public-examples/button-examples/button-example/button-example.component';
import { CaptchaExampleComponent } from '../public-examples/captcha-examples/captcha-example/captcha-example.component';
import { CheckboxExampleComponent } from '../public-examples/checkbox-examples/checkbox-example/checkbox-example.component';
import { CheckboxPanelExampleComponent } from '../public-examples/checkbox-panel-examples/checkbox-panel-example/checkbox-panel-example.component';
import { DatepickerDateFilterExampleComponent } from '../public-examples/datepicker-examples/datepicker-date-filter-example/datepicker-date-filter-example.component';
import { DatepickerMasterSlaveExampleComponent } from '../public-examples/datepicker-examples/datepicker-master-slave-example/datepicker-master-slave-example.component';
import { DatepickerSimpleReactiveExampleComponent } from '../public-examples/datepicker-examples/datepicker-simple-reactive-example/datepicker-simple-reactive-example.component';
import { DatepickerStandaloneFormsExampleComponent } from '../public-examples/datepicker-examples/datepicker-standalone-forms-example/datepicker-standalone-forms-example.component';
import { DropdownExampleComponent } from '../public-examples/dropdown-examples/dropdown-example/dropdown-example.component';
import { FieldExampleComponent } from '../public-examples/field-examples/field-example/field-example.component';
import { FileSelectorExampleComponent } from '../public-examples/file-selector-examples/file-selector-example/file-selector-example.component';
import { GhettoboxExampleComponent } from '../public-examples/ghettobox-examples/ghettobox-example/ghettobox-example.component';
import { LightboxExampleComponent } from '../public-examples/lightbox-examples/lightbox-example/lightbox-example.component';
import { LinksExampleComponent } from '../public-examples/links-examples/links-example/links-example.component';
import { LoadingExampleComponent } from '../public-examples/loading-examples/loading-example/loading-example.component';
import { NotificationExampleComponent } from '../public-examples/notification-examples/notification-example/notification-example.component';
import { NavigationExampleComponent } from '../public-examples/pagination-examples/navigation-example/navigation-example.component';
import { PaginatorExampleComponent } from '../public-examples/pagination-examples/paginator-example/paginator-example.component';
import { ProcessflowExampleComponent } from '../public-examples/processflow-examples/processflow-example/processflow-example.component';
import { RadioButtonExampleComponent } from '../public-examples/radio-button-examples/radio-button-example/radio-button-example.component';
import { RadioButtonPanelExampleComponent } from '../public-examples/radio-button-panel-examples/radio-button-panel-example/radio-button-panel-example.component';
import { SearchExampleComponent } from '../public-examples/search-examples/search-example/search-example.component';
import { SelectFormsExampleComponent } from '../public-examples/select-examples/select-forms-example/select-forms-example.component';
import { SelectMultiSelectionExampleComponent } from '../public-examples/select-examples/select-multi-selection-example/select-multi-selection-example.component';
import { SelectNativeExampleComponent } from '../public-examples/select-examples/select-native-example/select-native-example.component';
import { SelectOptionGroupsExampleComponent } from '../public-examples/select-examples/select-option-groups-example/select-option-groups-example.component';
import { SelectOptionGroupsMultiSelectionExampleComponent } from '../public-examples/select-examples/select-option-groups-multi-selection-example/select-option-groups-multi-selection-example.component';
import { SelectReactiveFormsExampleComponent } from '../public-examples/select-examples/select-reactive-forms-example/select-reactive-forms-example.component';
import { TableExampleComponent } from '../public-examples/table-examples/table-example/table-example.component';
import { TabsExampleComponent } from '../public-examples/tabs-examples/tabs-example/tabs-example.component';
import { TagExampleComponent } from '../public-examples/tag-examples/tag-example/tag-example.component';
import { TextareaFormsExampleComponent } from '../public-examples/textarea-examples/textarea-forms-example/textarea-forms-example.component';
import { TextareaNativeExampleComponent } from '../public-examples/textarea-examples/textarea-native-example/textarea-native-example.component';
import { TextareaReactiveFormsWithSbbFieldExampleComponent } from '../public-examples/textarea-examples/textarea-reactive-forms-with-sbbfield-example/textarea-reactive-forms-with-sbb-field-example.component';
import { TextexpandExampleComponent } from '../public-examples/textexpand-examples/textexpand-example/textexpand-example.component';
import { TimeInputExampleComponent } from '../public-examples/time-input-examples/time-input-example/time-input-example.component';
import { ToggleExampleComponent } from '../public-examples/toggle-examples/toggle-example/toggle-example.component';
import { TooltipCustomContentExampleComponent } from '../public-examples/tooltip-examples/tooltip-custom-content-example/tooltip-custom-content-example.component';
import { TooltipCustomIconExampleComponent } from '../public-examples/tooltip-examples/tooltip-custom-icon-example/tooltip-custom-icon-example.component';
import { TooltipSimpleExampleComponent } from '../public-examples/tooltip-examples/tooltip-simple-example/tooltip-simple-example.component';
import { UsermenuExampleComponent } from '../public-examples/usermenu-examples/usermenu-example/usermenu-example.component';

@Component({
  selector: 'sbb-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
  providers: [{ provide: ExampleProvider, useExisting: PublicComponent }]
})
export class PublicComponent implements ExampleProvider {
  formComponents = {
    autocomplete: 'Autocomplete',
    captcha: 'Captcha',
    checkbox: 'Checkbox',
    'checkbox-panel': 'Checkbox Panel',
    datepicker: 'Datepicker',
    field: 'Field',
    'file-selector': 'File Selector',
    'radio-button': 'Radiobutton',
    'radio-button-panel': 'Radiobutton Panel',
    search: 'Search',
    select: 'Select',
    tag: 'Tag',
    textarea: 'Textarea',
    'time-input': 'Time Input',
    toggle: 'Toggle'
  };
  layoutComponents = {
    accordion: 'Accordion',
    breadcrumb: 'Breadcrumb',
    ghettobox: 'Ghettobox',
    notification: 'Notification',
    pagination: 'Pagination',
    processflow: 'Processflow',
    table: 'Table',
    tabs: 'Tabs',
    textexpand: 'Textexpand',
    usermenu: 'Usermenu'
  };
  buttonAndIndicatorComponents = {
    badge: 'Badge',
    button: 'Button',
    links: 'Links',
    loading: 'Loading'
  };
  popupsAndModals = {
    dropdown: 'Dropdown',
    lightbox: 'Lightbox',
    tooltip: 'Tooltip'
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
    captcha: { 'captcha-example': new ComponentPortal(CaptchaExampleComponent) },
    checkbox: { 'checkbox-example': new ComponentPortal(CheckboxExampleComponent) },
    'checkbox-panel': {
      'checkbox-panel-example': new ComponentPortal(CheckboxPanelExampleComponent)
    },
    datepicker: {
      'datepicker-simple-reactive-example': new ComponentPortal(
        DatepickerSimpleReactiveExampleComponent
      ),
      'datepicker-master-slave-example': new ComponentPortal(DatepickerMasterSlaveExampleComponent),
      'datepicker-date-filter-example': new ComponentPortal(DatepickerDateFilterExampleComponent),
      'datepicker-standalone-forms-example': new ComponentPortal(
        DatepickerStandaloneFormsExampleComponent
      )
    },
    field: { 'field-example': new ComponentPortal(FieldExampleComponent) },
    'file-selector': {
      'file-selector-example': new ComponentPortal(FileSelectorExampleComponent)
    },
    'radio-button': { 'radio-button-example': new ComponentPortal(RadioButtonExampleComponent) },
    'radio-button-panel': {
      'radio-button-panel-example': new ComponentPortal(RadioButtonPanelExampleComponent)
    },
    search: { 'search-example': new ComponentPortal(SearchExampleComponent) },
    select: {
      'select-reactive-forms-example': new ComponentPortal(SelectReactiveFormsExampleComponent),
      'select-forms-example': new ComponentPortal(SelectFormsExampleComponent),
      'select-native-example': new ComponentPortal(SelectNativeExampleComponent),
      'select-multi-selection-example': new ComponentPortal(SelectMultiSelectionExampleComponent),
      'select-option-groups-example': new ComponentPortal(SelectOptionGroupsExampleComponent),
      'select-option-groups-multi-selection-example': new ComponentPortal(
        SelectOptionGroupsMultiSelectionExampleComponent
      )
    },
    tag: { 'tag-example': new ComponentPortal(TagExampleComponent) },
    textarea: {
      'textarea-forms-example': new ComponentPortal(TextareaFormsExampleComponent),
      'textarea-reactive-forms-with-sbb-field-example': new ComponentPortal(
        TextareaReactiveFormsWithSbbFieldExampleComponent
      ),
      'textarea-native-example': new ComponentPortal(TextareaNativeExampleComponent)
    },
    'time-input': { 'time-input-example': new ComponentPortal(TimeInputExampleComponent) },
    toggle: { 'toggle-example': new ComponentPortal(ToggleExampleComponent) },
    accordion: { 'accordion-example': new ComponentPortal(AccordionExampleComponent) },
    breadcrumb: { 'breadcrumb-example': new ComponentPortal(BreadcrumbExampleComponent) },
    ghettobox: { 'ghettobox-example': new ComponentPortal(GhettoboxExampleComponent) },
    notification: { 'notification-example': new ComponentPortal(NotificationExampleComponent) },
    pagination: {
      'paginator-example': new ComponentPortal(PaginatorExampleComponent),
      'navigation-example': new ComponentPortal(NavigationExampleComponent)
    },
    processflow: { 'processflow-example': new ComponentPortal(ProcessflowExampleComponent) },
    table: { 'table-example': new ComponentPortal(TableExampleComponent) },
    tabs: { 'tabs-example': new ComponentPortal(TabsExampleComponent) },
    textexpand: { 'textexpand-example': new ComponentPortal(TextexpandExampleComponent) },
    usermenu: { 'usermenu-example': new ComponentPortal(UsermenuExampleComponent) },
    badge: { 'badge-example': new ComponentPortal(BadgeExampleComponent) },
    button: { 'button-example': new ComponentPortal(ButtonExampleComponent) },
    links: { 'links-example': new ComponentPortal(LinksExampleComponent) },
    loading: { 'loading-example': new ComponentPortal(LoadingExampleComponent) },
    dropdown: { 'dropdown-example': new ComponentPortal(DropdownExampleComponent) },
    lightbox: { 'lightbox-example': new ComponentPortal(LightboxExampleComponent) },
    tooltip: {
      'tooltip-simple-example': new ComponentPortal(TooltipSimpleExampleComponent),
      'tooltip-custom-content-example': new ComponentPortal(TooltipCustomContentExampleComponent),
      'tooltip-custom-icon-example': new ComponentPortal(TooltipCustomIconExampleComponent)
    }
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}
