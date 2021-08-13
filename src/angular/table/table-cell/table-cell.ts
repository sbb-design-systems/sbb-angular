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
  CdkHeaderCellDef,
} from '@angular/cdk/table';
import { Directive, Input } from '@angular/core';

/**
 * Cell definition for the sbb-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: SbbCellDef }],
})
export class SbbCellDef extends CdkCellDef {}

/**
 * Header cell definition for the sbb-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: SbbHeaderCellDef }],
})
export class SbbHeaderCellDef extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the sbb-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: SbbFooterCellDef }],
})
export class SbbFooterCellDef extends CdkFooterCellDef {}

/**
 * Column definition for the sbb-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[sbbColumnDef]',
  inputs: ['sticky'],
  providers: [
    { provide: CdkColumnDef, useExisting: SbbColumnDef },
    { provide: 'SBB_SORT_HEADER_COLUMN_DEF', useExisting: SbbColumnDef },
  ],
})
export class SbbColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('sbbColumnDef')
  override get name(): string {
    return this._name;
  }
  override set name(name: string) {
    this._setNameInput(name);
  }

  /**
   * Add "sbb-column-" prefix in addition to "cdk-column-" prefix.
   * In the future, this will only add "sbb-column-" and columnCssClassName
   * will change from type string[] to string.
   * @docs-private
   */
  protected override _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName!.push(`sbb-column-${this.cssClassFriendlyName}`);
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbbHeaderCell, th[sbbHeaderCell]',
  host: {
    class: 'sbb-header-cell',
    role: 'gridcell',
  },
})
export class SbbHeaderCell extends CdkHeaderCell {}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbbFooterCell, td[sbbFooterCell]',
  host: {
    class: 'sbb-footer-cell',
    role: 'gridcell',
  },
})
export class SbbFooterCell extends CdkFooterCell {}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbbCell, td[sbbCell]',
  host: {
    class: 'sbb-cell',
    role: 'gridcell',
  },
})
export class SbbCell extends CdkCell {}
