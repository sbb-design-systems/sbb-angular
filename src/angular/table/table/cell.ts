import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';
import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Cell definition for the sbb-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: SbbCellDef }],
  standalone: true,
})
export class SbbCellDef extends CdkCellDef {}

/**
 * Header cell definition for the sbb-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: SbbHeaderCellDef }],
  standalone: true,
})
export class SbbHeaderCellDef extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the sbb-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[sbbFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: SbbFooterCellDef }],
  standalone: true,
})
export class SbbFooterCellDef extends CdkFooterCellDef {}

/**
 * Column definition for the sbb-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[sbbColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: SbbColumnDef },
    { provide: 'SBB_SORT_HEADER_COLUMN_DEF', useExisting: SbbColumnDef },
  ],
  standalone: true,
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
   * Group this column with the next column.
   * If set to true, the border to the next cell is hidden.
   */
  @Input()
  get groupWithNext(): boolean {
    return this._groupWithNext;
  }
  set groupWithNext(value: BooleanInput) {
    this._groupWithNext = coerceBooleanProperty(value);
  }
  private _groupWithNext: boolean = false;

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
  selector: 'sbb-header-cell, th[sbb-header-cell]',
  host: {
    class: 'sbb-header-cell',
    role: 'columnheader',
    '[class.sbb-table-group-with-next]': '_columnDef.groupWithNext',
  },
  standalone: true,
})
export class SbbHeaderCell extends CdkHeaderCell {
  constructor(
    public readonly _columnDef: SbbColumnDef,
    elementRef: ElementRef,
  ) {
    super(_columnDef, elementRef);
  }
}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbb-footer-cell, td[sbb-footer-cell]',
  host: {
    class: 'sbb-footer-cell',
    role: 'gridcell',
    '[class.sbb-table-group-with-next]': '_columnDef.groupWithNext',
  },
  standalone: true,
})
export class SbbFooterCell extends CdkFooterCell {
  constructor(
    public readonly _columnDef: SbbColumnDef,
    elementRef: ElementRef,
  ) {
    super(_columnDef, elementRef);
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'sbb-cell, td[sbb-cell]',
  host: {
    class: 'sbb-cell',
    role: 'gridcell',
    '[class.sbb-table-group-with-next]': '_columnDef.groupWithNext',
  },
  standalone: true,
})
export class SbbCell extends CdkCell {
  constructor(
    public readonly _columnDef: SbbColumnDef,
    elementRef: ElementRef,
  ) {
    super(_columnDef, elementRef);
  }
}
