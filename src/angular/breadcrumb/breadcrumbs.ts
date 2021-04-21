import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import {
  SbbMenuInheritedTriggerContext,
  SBB_MENU_INHERITED_TRIGGER_CONTEXT,
} from '@sbb-esta/angular/menu';

import { SbbBreadcrumb } from './breadcrumb';

const sbbMenuInheritedTriggerContext: SbbMenuInheritedTriggerContext = {
  type: 'breadcrumb',
  xPosition: 'after',
  xOffset: -30,
  xOffset4k: -45,
  xOffset5k: -60,
  yOffset: -14,
  yOffset4kTop: -24,
  yOffset4kBottom: -16,
  yOffset5kTop: -28,
  yOffset5kBottom: -33,
};

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
  providers: [
    { provide: SBB_MENU_INHERITED_TRIGGER_CONTEXT, useValue: sbbMenuInheritedTriggerContext },
  ],
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
