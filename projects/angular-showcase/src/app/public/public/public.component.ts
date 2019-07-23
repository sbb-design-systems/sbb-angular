import { Component } from '@angular/core';

import { MarkdownProvider } from '../../shared/markdown-provider';

@Component({
  selector: 'sbb-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
  providers: [{ provide: MarkdownProvider, useExisting: PublicComponent }]
})
export class PublicComponent extends MarkdownProvider {
  formComponents = {
    autocomplete: 'Autocomplete',
    captcha: 'Captcha',
    checkbox: 'Checkbox',
    checkboxpanel: 'Checkbox Panel',
    datepicker: 'Datepicker',
    field: 'Field',
    fileselector: 'File Selector',
    radiobutton: 'Radiobutton',
    radiobuttonpanel: 'Radiobutton Panel',
    search: 'Search',
    select: 'Select',
    tag: 'Tag',
    textarea: 'Textarea',
    timeinput: 'Time Input',
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

  downloadMarkdown(path: string): Promise<string> {
    return import(`../markdown/${path}.html`);
  }
}
