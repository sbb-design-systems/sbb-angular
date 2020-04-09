import { NgModule } from '@angular/core';

import { AccordionExamplesModule } from './accordion-examples/accordion-examples.module';
import { AutocompleteExamplesModule } from './autocomplete-examples/autocomplete-examples.module';
import { BadgeExamplesModule } from './badge-examples/badge-examples.module';
import { BreadcrumbExamplesModule } from './breadcrumb-examples/breadcrumb-examples.module';
import { ButtonExamplesModule } from './button-examples/button-examples.module';
import { CaptchaExamplesModule } from './captcha-examples/captcha-examples.module';
import { CheckboxExamplesModule } from './checkbox-examples/checkbox-examples.module';
import { CheckboxPanelExamplesModule } from './checkbox-panel-examples/checkbox-panel-examples.module';
import { DatepickerExamplesModule } from './datepicker-examples/datepicker-examples.module';
import { DropdownExamplesModule } from './dropdown-examples/dropdown-examples.module';
import { FieldExamplesModule } from './field-examples/field-examples.module';
import { FileSelectorExamplesModule } from './file-selector-examples/file-selector-examples.module';
import { GhettoboxExamplesModule } from './ghettobox-examples/ghettobox-examples.module';
import { LightboxExamplesModule } from './lightbox-examples/lightbox-examples.module';
import { LinksExamplesModule } from './links-examples/links-examples.module';
import { LoadingExamplesModule } from './loading-examples/loading-examples.module';
import { NotificationExamplesModule } from './notification-examples/notification-examples.module';
import { PaginationExamplesModule } from './pagination-examples/pagination-examples.module';
import { ProcessflowExamplesModule } from './processflow-examples/processflow-examples.module';
import { RadioButtonExamplesModule } from './radio-button-examples/radio-button-examples.module';
import { RadioButtonPanelExamplesModule } from './radio-button-panel-examples/radio-button-panel-examples.module';
import { SearchExamplesModule } from './search-examples/search-examples.module';
import { SelectExamplesModule } from './select-examples/select-examples.module';
import { TableExamplesModule } from './table-examples/table-examples.module';
import { TabsExamplesModule } from './tabs-examples/tabs-examples.module';
import { TagExamplesModule } from './tag-examples/tag-examples.module';
import { TextareaExamplesModule } from './textarea-examples/textarea-examples.module';
import { TextexpandExamplesModule } from './textexpand-examples/textexpand-examples.module';
import { TimeInputExamplesModule } from './time-input-examples/time-input-examples.module';
import { ToggleExamplesModule } from './toggle-examples/toggle-examples.module';
import { TooltipExamplesModule } from './tooltip-examples/tooltip-examples.module';
import { UsermenuExamplesModule } from './usermenu-examples/usermenu-examples.module';

const EXAMPLES = [
  ToggleExamplesModule,
  AccordionExamplesModule,
  AutocompleteExamplesModule,
  BadgeExamplesModule,
  BreadcrumbExamplesModule,
  ButtonExamplesModule,
  CaptchaExamplesModule,
  CheckboxExamplesModule,
  CheckboxPanelExamplesModule,
  DatepickerExamplesModule,
  DropdownExamplesModule,
  FieldExamplesModule,
  FileSelectorExamplesModule,
  GhettoboxExamplesModule,
  LightboxExamplesModule,
  LinksExamplesModule,
  LoadingExamplesModule,
  NotificationExamplesModule,
  PaginationExamplesModule,
  ProcessflowExamplesModule,
  RadioButtonExamplesModule,
  RadioButtonPanelExamplesModule,
  SearchExamplesModule,
  SelectExamplesModule,
  TableExamplesModule,
  TabsExamplesModule,
  TagExamplesModule,
  TextareaExamplesModule,
  TextexpandExamplesModule,
  TimeInputExamplesModule,
  TooltipExamplesModule,
  UsermenuExamplesModule
];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES
})
export class PublicExamplesModule {}
