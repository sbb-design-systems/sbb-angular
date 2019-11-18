/**
 * Header row definition for the sbb-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
import {
  CDK_ROW_TEMPLATE,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef
} from '@angular/cdk/table';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Directive({
  selector: '[sbbHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: HeaderRowDefDirective }],
  inputs: ['columns: sbbHeaderRowDef', 'sticky: sbbHeaderRowDefSticky']
})
export class HeaderRowDefDirective extends CdkHeaderRowDef {
  static ngAcceptInputTypeSticky: boolean | string | null | undefined = undefined;
}

/**
 * Footer row definition for the sbb-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[sbbFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: FooterRowDefDirective }],
  inputs: ['columns: sbbFooterRowDef', 'sticky: sbbFooterRowDefSticky']
})
export class FooterRowDefDirective extends CdkFooterRowDef {
  static ngAcceptInputTypeSticky: boolean | string | null | undefined = undefined;
}

/**
 * Data row definition for the sbb-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[sbbRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: RowDefDirective }],
  inputs: ['columns: sbbRowDefColumns', 'when: sbbRowDefWhen']
})
export class RowDefDirective<T> extends CdkRowDef<T> {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-header-row, tr[sbbHeaderRow]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: HeaderRowComponent }]
})
export class HeaderRowComponent extends CdkHeaderRow {
  @HostBinding('class.sbb-header-row') sbbHeaderRow = true;
  @HostBinding('attr.role') row = 'row';
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-footer-row, tr[sbbFooterRow]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbFooterRow',
  providers: [{ provide: CdkFooterRow, useExisting: FooterRowComponent }]
})
export class FooterRowComponent extends CdkFooterRow {
  @HostBinding('class.sbb-footer-row') sbbFooterRow = true;
  @HostBinding('attr.role') row = 'row';
}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sbb-row, tr[sbbRow]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbRow',
  providers: [{ provide: CdkRow, useExisting: RowComponent }]
})
export class RowComponent extends CdkRow implements AfterViewInit {
  @HostBinding('class.sbb-row') sbbRow = true;
  @HostBinding('attr.role') row = 'row';

  @ViewChild('colgroup', { static: false })
  colgroup: any;

  ngAfterViewInit(): void {
    console.log(this.colgroup);
  }
}
