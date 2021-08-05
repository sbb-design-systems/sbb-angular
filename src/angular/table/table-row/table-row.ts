/**
 * Header row definition for the sbb-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
import {
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CDK_ROW_TEMPLATE,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';

@Directive({
  selector: '[sbbHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: SbbHeaderRowDef }],
  inputs: ['columns: sbbHeaderRowDef', 'sticky: sbbHeaderRowDefSticky'],
})
export class SbbHeaderRowDef extends CdkHeaderRowDef {
  static ngAcceptInputTypeSticky: boolean | string | null | undefined = undefined;
}

/**
 * Footer row definition for the sbb-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[sbbFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: SbbFooterRowDef }],
  inputs: ['columns: sbbFooterRowDef', 'sticky: sbbFooterRowDefSticky'],
})
export class SbbFooterRowDef extends CdkFooterRowDef {
  static ngAcceptInputTypeSticky: boolean | string | null | undefined = undefined;
}

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

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-header-row, tr[sbbHeaderRow]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: SbbHeaderRow }],
  host: {
    class: 'sbb-header-row',
    role: 'row',
  },
})
export class SbbHeaderRow extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-footer-row, tr[sbbFooterRow]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbFooterRow',
  providers: [{ provide: CdkFooterRow, useExisting: SbbFooterRow }],
  host: {
    class: 'sbb-footer-row',
    role: 'row',
  },
})
export class SbbFooterRow extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-row, tr[sbbRow]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbRow',
  providers: [{ provide: CdkRow, useExisting: SbbRow }],
  host: {
    class: 'sbb-row',
    role: 'row',
  },
})
export class SbbRow extends CdkRow {}
