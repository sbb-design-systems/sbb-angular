export * from './table.module';

export * from './table/table-data-source';
export * from './table/table.component';
export * from './sort/sort-direction';
export * from './sort-header/sort-header.component';
export * from './sort/sort.component';
export * from './sort-header/sort-animations';
export * from './text-column/text-column.component';
export * from './table-cell/table-cell.component';
export * from './table-row/table-row.component';
/** @deprecated Remove with v12 */
export { SbbTableModule as TableModule } from './table.module';
/** @deprecated Remove with v12 */
export { SbbSortDirection as SortDirection } from './sort/sort-direction';
/** @deprecated Remove with v12 */
export { SbbSort as Sort } from './sort/sort.component';
/** @deprecated Remove with v12 */
export {
  SbbArrowViewState as ArrowViewState,
  SbbArrowViewStateTransition as ArrowViewStateTransition,
} from './sort-header/sort-header.component';
/** @deprecated Remove with v12 */
export { SbbTableFilter as TableFilter } from './table/table-data-source';
/** @deprecated Remove with v12 */
export { SbbTable as TableComponent } from './table/table.component';
/** @deprecated Remove with v12 */
export {
  SbbCellDef as CellDefDirective,
  SbbHeaderCellDef as HeaderCellDefDirective,
  SbbFooterCellDef as FooterCellDefDirective,
  SbbColumnDef as ColumnDefDirective,
  SbbHeaderCell as HeaderCellDirective,
  SbbFooterCell as FooterCellDirective,
  SbbCell as CellDirective,
} from './table-cell/table-cell.component';
/** @deprecated Remove with v12 */
export {
  SbbHeaderRowDef as HeaderRowDefDirective,
  SbbFooterRowDef as FooterRowDefDirective,
  SbbRowDef as RowDefDirective,
  SbbHeaderRow as HeaderRowComponent,
  SbbFooterRow as FooterRowComponent,
  SbbRow as RowComponent,
} from './table-row/table-row.component';
/** @deprecated Remove with v12 */
export { SbbTextColumn as TextColumnComponent } from './text-column/text-column.component';
