/**
 * Cell definition for the sbb-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef
} from '@angular/cdk/table';
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[sbbCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: CellDefDirective }]
})
export class CellDefDirective extends CdkCellDef {}

/**
 * Header cell definition for the sbb-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: HeaderCellDefDirective }]
})
export class HeaderCellDefDirective extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the sbb-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: FooterCellDefDirective }]
})
export class FooterCellDefDirective extends CdkFooterCellDef {}

/**
 * Column definition for the sbb-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[sbbColumnDef]',
  inputs: ['sticky'],
  providers: [
    { provide: CdkColumnDef, useExisting: ColumnDefDirective },
    { provide: 'SORT_HEADER_COLUMN_DEF', useExisting: ColumnDefDirective }
  ]
})
export class ColumnDefDirective extends CdkColumnDef {
  static ngAcceptInputTypeSticky: boolean | string | null | undefined = undefined;
  static ngAcceptInputTypeStickyEnd: boolean | string | null | undefined = undefined;
  /** Unique name for this column. */
  @Input('sbbColumnDef') name: string;
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbbHeaderCell, th[sbbHeaderCell]'
})
export class HeaderCellDirective extends CdkHeaderCell {
  @HostBinding('class.sbb-header-cell') sbbHeaderCell = true;
  @HostBinding('attr.role') gridCell = 'gridcell';

  constructor(columnDef: CdkColumnDef, elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`sbb-column-${columnDef.cssClassFriendlyName}`);
  }
}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbbFooterCell, td[sbbFooterCell]'
})
export class FooterCellDirective extends CdkFooterCell {
  @HostBinding('class.sbb-footer-cell') sbbFooterCell = true;
  @HostBinding('attr.role') gridCell = 'gridcell';

  constructor(columnDef: CdkColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`sbb-column-${columnDef.cssClassFriendlyName}`);
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbbCell, td[sbbCell]'
})
export class CellDirective extends CdkCell {
  @HostBinding('class.sbb-cell') sbbCell = true;
  @HostBinding('attr.role') gridCell = 'gridcell';

  constructor(columnDef: CdkColumnDef, elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`sbb-column-${columnDef.cssClassFriendlyName}`);
  }
}
