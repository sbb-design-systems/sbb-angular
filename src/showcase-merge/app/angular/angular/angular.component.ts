import { Component } from '@angular/core';

@Component({
  selector: 'sbb-angular',
  templateUrl: './angular.component.html',
})
export class AngularComponent {
  formComponents = {
    autocomplete: 'Autocomplete',
    captcha: 'Captcha',
    checkbox: 'Checkbox',
    'checkbox-panel': 'Checkbox Panel',
    datepicker: 'Datepicker',
    'form-field': 'Form Field',
    'file-selector': 'File Selector',
    'radio-button': 'Radiobutton',
    'radio-button-panel': 'Radiobutton Panel',
    search: 'Search',
    select: 'Select',
    tag: 'Tag',
    textarea: 'Textarea',
    'time-input': 'Time Input',
    toggle: 'Toggle',
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
    usermenu: 'Usermenu',
  };
  buttonAndIndicatorComponents = {
    badge: 'Badge',
    button: 'Button',
    links: 'Links',
    loading: 'Loading',
  };
  popupsAndModals = {
    dropdown: 'Dropdown',
    lightbox: 'Lightbox',
    tooltip: 'Tooltip',
  };
}
