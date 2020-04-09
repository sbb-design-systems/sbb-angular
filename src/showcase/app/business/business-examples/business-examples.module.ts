import { NgModule } from '@angular/core';

import { AutocompleteExamplesModule } from './autocomplete-examples/autocomplete-examples.module';
import { ChipExamplesModule } from './chip-examples/chip-examples.module';
import { ContextmenuExamplesModule } from './contextmenu-examples/contextmenu-examples.module';
import { DialogExamplesModule } from './dialog-examples/dialog-examples.module';
import { NotificationExamplesModule } from './notification-examples/notification-examples.module';
import { PaginationExamplesModule } from './pagination-examples/pagination-examples.module';
import { ProcessflowExamplesModule } from './processflow-examples/processflow-examples.module';
import { SelectExamplesModule } from './select-examples/select-examples.module';
import { TableExamplesModule } from './table-examples/table-examples.module';
import { TabsExamplesModule } from './tabs-examples/tabs-examples.module';
import { TextareaExamplesModule } from './textarea-examples/textarea-examples.module';
import { TooltipExamplesModule } from './tooltip-examples/tooltip-examples.module';
import { UsermenuExamplesModule } from './usermenu-examples/usermenu-examples.module';

const EXAMPLES = [
  AutocompleteExamplesModule,
  ChipExamplesModule,
  ContextmenuExamplesModule,
  DialogExamplesModule,
  NotificationExamplesModule,
  PaginationExamplesModule,
  ProcessflowExamplesModule,
  SelectExamplesModule,
  TableExamplesModule,
  TabsExamplesModule,
  TextareaExamplesModule,
  TooltipExamplesModule,
  UsermenuExamplesModule
];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES
})
export class BusinessExamplesModule {}
