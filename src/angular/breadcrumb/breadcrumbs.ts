import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';

import { SbbBreadcrumb } from './breadcrumb';

@Component({
  selector: 'sbb-breadcrumbs',
  exportAs: 'sbbBreadcrumbs',
  templateUrl: './breadcrumbs.html',
  styleUrls: ['./breadcrumbs.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-breadcrumbs',
    role: 'navigation',
    '[class.sbb-breadcrumbs-expanded]': 'this.expanded',
    'aria-label': 'Breadcrumb',
  },
})
export class SbbBreadcrumbs {
  /** Refers to BreadcrumbComponents instance. */
  @ContentChildren(SbbBreadcrumb) levels: QueryList<SbbBreadcrumb>;

  /** Status expanded of a sbb-breadcrumbs. */
  get expanded(): boolean {
    if (this.levels.length > 2) {
      return this._expanded;
    }
    // If there is only the home icon and one level, always display all breadcrumb entries
    return true;
  }
  private _expanded = false;

  expand() {
    this._expanded = true;
  }
}
