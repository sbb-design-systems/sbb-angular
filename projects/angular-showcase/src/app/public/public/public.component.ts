import { HttpClient } from '@angular/common/http';
import { Component, Type } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { MarkdownProvider } from '../../shared/markdown-provider';
import { AccordionShowcaseComponent } from '../examples/accordion-showcase/accordion-showcase.component';
import { AutocompleteShowcaseComponent } from '../examples/autocomplete-showcase/autocomplete-showcase.component';
import { BadgeShowcaseComponent } from '../examples/badge-showcase/badge-showcase.component';
import { BreadcrumbShowcaseComponent } from '../examples/breadcrumb-showcase/breadcrumb-showcase.component';
import { ButtonShowcaseComponent } from '../examples/button-showcase/button-showcase.component';
import { CaptchaShowcaseComponent } from '../examples/captcha-showcase/captcha-showcase.component';
import { CheckboxPanelShowcaseComponent } from '../examples/checkbox-panel-showcase/checkbox-panel-showcase.component';
import { CheckboxShowcaseComponent } from '../examples/checkbox-showcase/checkbox-showcase.component';
import { DatepickerShowcaseComponent } from '../examples/datepicker-showcase/datepicker-showcase.component';
import { DropdownShowcaseComponent } from '../examples/dropdown-showcase/dropdown-showcase.component';
import { FieldShowcaseComponent } from '../examples/field-showcase/field-showcase.component';
import { FileSelectorShowcaseComponent } from '../examples/file-selector-showcase/file-selector-showcase.component';
import { GhettoboxShowcaseComponent } from '../examples/ghettobox-showcase/ghettobox-showcase.component';
import { LightboxShowcaseComponent } from '../examples/lightbox-showcase/lightbox-showcase.component';
import { LinksShowcaseComponent } from '../examples/links-showcase/links-showcase.component';
import { LoadingShowcaseComponent } from '../examples/loading-showcase/loading-showcase.component';
import { NotificationShowcaseComponent } from '../examples/notification-showcase/notification-showcase.component';
import { PaginationShowcaseComponent } from '../examples/pagination-showcase/pagination-showcase.component';
import { ProcessflowShowcaseComponent } from '../examples/processflow-showcase/processflow-showcase.component';
import { RadioButtonPanelShowcaseComponent } from '../examples/radio-button-panel-showcase/radio-button-panel-showcase.component';
import { RadioButtonShowcaseComponent } from '../examples/radio-button-showcase/radio-button-showcase.component';
import { SearchShowcaseComponent } from '../examples/search-showcase/search-showcase.component';
import { SelectShowcaseComponent } from '../examples/select-showcase/select-showcase.component';
import { TableShowcaseComponent } from '../examples/table-showcase/table-showcase.component';
import { TabsShowcaseComponent } from '../examples/tabs-showcase/tabs-showcase.component';
import { TagShowcaseComponent } from '../examples/tag-showcase/tag-showcase.component';
import { TextareaShowcaseComponent } from '../examples/textarea-showcase/textarea-showcase.component';
import { TextexpandShowcaseComponent } from '../examples/textexpand-showcase/textexpand-showcase.component';
import { TimeInputShowcaseComponent } from '../examples/time-input-showcase/time-input-showcase.component';
import { ToggleShowcaseComponent } from '../examples/toggle-showcase/toggle-showcase.component';
import { TooltipShowcaseComponent } from '../examples/tooltip-showcase/tooltip-showcase.component';
import { UserMenuShowcaseComponent } from '../examples/usermenu-showcase/usermenu-showcase.component';

@Component({
  selector: 'sbb-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
  providers: [
    { provide: MarkdownProvider, useExisting: PublicComponent },
    { provide: ExampleProvider, useExisting: PublicComponent }
  ]
})
export class PublicComponent implements MarkdownProvider, ExampleProvider {
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
  private _examples = {
    autocomplete: AutocompleteShowcaseComponent,
    captcha: CaptchaShowcaseComponent,
    checkbox: CheckboxShowcaseComponent,
    'checkbox-panel': CheckboxPanelShowcaseComponent,
    datepicker: DatepickerShowcaseComponent,
    field: FieldShowcaseComponent,
    'file-selector': FileSelectorShowcaseComponent,
    'radio-button': RadioButtonShowcaseComponent,
    'radio-button-panel': RadioButtonPanelShowcaseComponent,
    search: SearchShowcaseComponent,
    select: SelectShowcaseComponent,
    tag: TagShowcaseComponent,
    textarea: TextareaShowcaseComponent,
    'time-input': TimeInputShowcaseComponent,
    toggle: ToggleShowcaseComponent,
    accordion: AccordionShowcaseComponent,
    breadcrumb: BreadcrumbShowcaseComponent,
    ghettobox: GhettoboxShowcaseComponent,
    notification: NotificationShowcaseComponent,
    pagination: PaginationShowcaseComponent,
    processflow: ProcessflowShowcaseComponent,
    table: TableShowcaseComponent,
    tabs: TabsShowcaseComponent,
    textexpand: TextexpandShowcaseComponent,
    usermenu: UserMenuShowcaseComponent,
    badge: BadgeShowcaseComponent,
    button: ButtonShowcaseComponent,
    links: LinksShowcaseComponent,
    loading: LoadingShowcaseComponent,
    dropdown: DropdownShowcaseComponent,
    lightbox: LightboxShowcaseComponent,
    tooltip: TooltipShowcaseComponent
  };

  constructor(private _http: HttpClient) {}

  downloadMarkdown(path: string): Promise<string> {
    return this._http
      .get(`assets/docs/angular-public/${path}.html`, { responseType: 'text' })
      .toPromise();
  }

  resolveExample<TComponent = any>(component: string): Type<TComponent> {
    return this._examples[component];
  }
}
