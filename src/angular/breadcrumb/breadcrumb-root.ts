import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

@Component({
  selector: '[sbb-breadcrumb-root]',
  exportAs: 'sbbBreadcrumbRoot',
  templateUrl: './breadcrumb-root.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SbbIconModule],
})
export class SbbBreadcrumbRoot {}
