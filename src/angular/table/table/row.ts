import {
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';

// We can't reuse `CDK_ROW_TEMPLATE` because it's incompatible with local compilation mode.
const ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;

/**
 * Header row definition for the sbb-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[sbbHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: SbbHeaderRowDef }],
  inputs: ['columns: sbbHeaderRowDef', 'sticky: sbbHeaderRowDefSticky'],
})
export class SbbHeaderRowDef extends CdkHeaderRowDef {}

/**
 * Footer row definition for the sbb-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[sbbFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: SbbFooterRowDef }],
  inputs: ['columns: sbbFooterRowDef', 'sticky: sbbFooterRowDefSticky'],
})
export class SbbFooterRowDef extends CdkFooterRowDef {}

/**
 * Data row definition for the sbb-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[sbbRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: SbbRowDef }],
  inputs: ['columns: sbbRowDefColumns', 'when: sbbRowDefWhen'],
})
export class SbbRowDef<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-header-row, tr[sbb-header-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'sbb-header-row',
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: SbbHeaderRow }],
})
export class SbbHeaderRow extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-footer-row, tr[sbb-footer-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'sbb-footer-row',
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbFooterRow',
  providers: [{ provide: CdkFooterRow, useExisting: SbbFooterRow }],
})
export class SbbFooterRow extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-row, tr[sbb-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'sbb-row',
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbRow',
  providers: [{ provide: CdkRow, useExisting: SbbRow }],
})
export class SbbRow extends CdkRow {}
