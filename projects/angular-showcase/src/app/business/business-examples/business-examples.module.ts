import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { ContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { DialogModule } from '@sbb-esta/angular-business/dialog';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { HeaderModule } from '@sbb-esta/angular-business/header';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';
import { RadioButtonModule } from '@sbb-esta/angular-business/radio-button';
import { TabsModule } from '@sbb-esta/angular-business/tabs';
import { SbbSortModule } from '@sbb-esta/angular-business/table';
import { TableModule } from '@sbb-esta/angular-business/table';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { UserMenuModule } from '@sbb-esta/angular-business/usermenu';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import {
  DialogShowcaseComponent,
  DialogShowcaseExample2Component,
  DialogShowcaseExample2ContentComponent,
  DialogShowcaseExample3Component,
  DialogShowcaseExampleComponent,
  DialogShowcaseExampleContentComponent
} from './dialog-showcase/dialog-showcase.component';
import { PaginationShowcaseComponent } from './pagination-showcase/pagination-showcase.component';
import { SimpleContextmenuComponent } from './simple-contextmenu/simple-contextmenu.component';
import { SkippableProcessflowComponent } from './skippable-processflow/skippable-processflow.component';
import { PersonListComponent } from './tabs-showcase/person/person-list/person-list.component';
import { TabsShowcaseComponent } from './tabs-showcase/tabs-showcase.component';
import {
  TableShowcase1Component,
  TableShowcase2Component,
  TableShowcase3Component,
  TableShowcaseComponent
} from './table-showcase/table-showcase.component';
import { TableActionsShowcaseComponent } from './table-showcase/table-actions-showcase/table-actions-showcase.component';
import { TableGroupedColumnsShowcaseComponent } from './table-showcase/table-grouped-columns-showcase/table-grouped-columns-showcase.component';
import { TableGroupedRowsShowcaseComponent } from './table-showcase/table-grouped-rows-showcase/table-grouped-rows-showcase.component';
import { TableSimpleShowcaseComponent } from './table-showcase/table-simple-showcase/table-simple-showcase.component';
import { TableSortShowcaseComponent } from './table-showcase/table-sort-showcase/table-sort-showcase.component';
import { ActionsTableComponent } from './table-showcase/actions-table/actions-table.component';
import { GroupedColumnsTableComponent } from './table-showcase/grouped-columns-table/grouped-columns-table.component';
import { GroupedRowsTableComponent } from './table-showcase/grouped-rows-table/grouped-rows-table.component';
import { SimpleTableComponent } from './table-showcase/simple-table/simple-table.component';
import { SortableTableComponent } from './table-showcase/sortable-table/sortable-table.component';
import { TooltipShowcaseComponent } from './tooltip-showcase/tooltip-showcase.component';
import { UsermenuShowcaseComponent } from './usermenu-showcase/usermenu-showcase.component';

const exampleComponents = [
  SimpleContextmenuComponent,
  SkippableProcessflowComponent,
  TooltipShowcaseComponent,
  UsermenuShowcaseComponent,
  TableShowcaseComponent,
  TableShowcase1Component,
  TableShowcase2Component,
  PersonListComponent,
  TabsShowcaseComponent,
  UsermenuShowcaseComponent,
  DialogShowcaseComponent,
  DialogShowcaseExampleComponent,
  DialogShowcaseExampleContentComponent,
  DialogShowcaseExample2Component,
  DialogShowcaseExample2ContentComponent,
  DialogShowcaseExample3Component,
  PaginationShowcaseComponent,
  TableShowcase2Component,
  TableShowcase3Component,
  TableSimpleShowcaseComponent,
  TableActionsShowcaseComponent,
  TableGroupedRowsShowcaseComponent,
  TableSortShowcaseComponent,
  TableGroupedColumnsShowcaseComponent,
  SimpleTableComponent,
  ActionsTableComponent,
  GroupedRowsTableComponent,
  SortableTableComponent,
  GroupedColumnsTableComponent
];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IconCollectionModule,
    ButtonModule,
    CheckboxModule,
    ContextmenuModule,
    FieldModule,
    HeaderModule,
    ProcessflowModule,
    TooltipModule,
    TabsModule,
    UserMenuModule,
    DialogModule,
    RadioButtonModule,
    PaginationModule,
    UserMenuModule,
    TableModule
  ]
})
export class BusinessExamplesModule {}
