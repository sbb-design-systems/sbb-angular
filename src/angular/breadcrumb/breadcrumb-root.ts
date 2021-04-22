import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: '[sbb-breadcrumb-root]',
  exportAs: 'sbbBreadcrumbRoot',
  template: `<sbb-icon svgIcon="kom:house-small"></sbb-icon>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbBreadcrumbRoot {}
