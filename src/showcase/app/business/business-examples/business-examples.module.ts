import { NgModule } from '@angular/core';

import { AccordionExamplesModule } from './accordion-examples/accordion-examples.module';
import { AutocompleteExamplesModule } from './autocomplete-examples/autocomplete-examples.module';
import { BreadcrumbExamplesModule } from './breadcrumb-examples/breadcrumb-examples.module';
import { ButtonExamplesModule } from './button-examples/button-examples.module';
import { CheckboxExamplesModule } from './checkbox-examples/checkbox-examples.module';
import { ChipExamplesModule } from './chip-examples/chip-examples.module';
import { ContextmenuExamplesModule } from './contextmenu-examples/contextmenu-examples.module';
import { DatepickerExamplesModule } from './datepicker-examples/datepicker-examples.module';
import { DialogExamplesModule } from './dialog-examples/dialog-examples.module';
import { DropdownExamplesModule } from './dropdown-examples/dropdown-examples.module';
import { FieldExamplesModule } from './field-examples/field-examples.module';
import { FileSelectorExamplesModule } from './file-selector-examples/file-selector-examples.module';
import { LinksExamplesModule } from './links-examples/links-examples.module';
import { LoadingExamplesModule } from './loading-examples/loading-examples.module';
import { NotificationExamplesModule } from './notification-examples/notification-examples.module';
import { PaginationExamplesModule } from './pagination-examples/pagination-examples.module';
import { ProcessflowExamplesModule } from './processflow-examples/processflow-examples.module';
import { RadioButtonExamplesModule } from './radio-button-examples/radio-button-examples.module';
import { SelectExamplesModule } from './select-examples/select-examples.module';
import { StatusExamplesModule } from './status-examples/status-examples.module';
import { TableExamplesModule } from './table-examples/table-examples.module';
import { TabsExamplesModule } from './tabs-examples/tabs-examples.module';
import { TextareaExamplesModule } from './textarea-examples/textarea-examples.module';
import { TextexpandExamplesModule } from './textexpand-examples/textexpand-examples.module';
import { TimeInputExamplesModule } from './time-input-examples/time-input-examples.module';
import { TooltipExamplesModule } from './tooltip-examples/tooltip-examples.module';
import { UsermenuExamplesModule } from './usermenu-examples/usermenu-examples.module';

const EXAMPLES = [
  AccordionExamplesModule,
  AutocompleteExamplesModule,
  BreadcrumbExamplesModule,
  ButtonExamplesModule,
  CheckboxExamplesModule,
  ChipExamplesModule,
  ContextmenuExamplesModule,
  DatepickerExamplesModule,
  DialogExamplesModule,
  DropdownExamplesModule,
  FieldExamplesModule,
  FileSelectorExamplesModule,
  LinksExamplesModule,
  LoadingExamplesModule,
  NotificationExamplesModule,
  PaginationExamplesModule,
  ProcessflowExamplesModule,
  RadioButtonExamplesModule,
  SelectExamplesModule,
  StatusExamplesModule,
  TableExamplesModule,
  TabsExamplesModule,
  TextareaExamplesModule,
  TextexpandExamplesModule,
  TimeInputExamplesModule,
  TooltipExamplesModule,
  UsermenuExamplesModule,
];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES,
})
export class BusinessExamplesModule {}
