import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: '[sbb-breadcrumb-root]',
  exportAs: 'sbbBreadcrumbRoot',
  templateUrl: './breadcrumb-root.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbBreadcrumbRoot {}
