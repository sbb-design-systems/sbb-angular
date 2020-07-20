import { Component } from '@angular/core';

@Component({
  selector: 'sbb-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
})
export class BusinessComponent {
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
    'notification-simple': 'Simple Notification',
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
}
