import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { mixinVariant } from '@sbb-esta/angular/core';
import {
  SbbMenuInheritedTriggerContext,
  SBB_MENU_INHERITED_TRIGGER_CONTEXT,
} from '@sbb-esta/angular/menu';

import { SbbBreadcrumb } from './breadcrumb';

// Boilerplate for applying mixins to SbbBreadcrumbs.
/** @docs-private */
// tslint:disable-next-line: naming-convention
const _SbbBreadcrumbsMixinBase = mixinVariant(class {});

const sbbMenuInheritedTriggerContext: SbbMenuInheritedTriggerContext = {
  type: 'breadcrumb',
  xPosition: 'after',
  xOffset: -30,
  yOffset: -14,
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
    'aria-label': 'breadcrumbs',
    '[class.sbb-breadcrumbs-expanded]': 'this.expanded',
  },
  providers: [
    { provide: SBB_MENU_INHERITED_TRIGGER_CONTEXT, useValue: sbbMenuInheritedTriggerContext },
  ],
})
export class SbbBreadcrumbs extends _SbbBreadcrumbsMixinBase {
  /** List of all user defined SbbBreadcrumb entries. */
  @ContentChildren(SbbBreadcrumb) levels: QueryList<SbbBreadcrumb>;

  /** Whether the sbb-breadcrumbs are expanded or not in mobile view */
  get expanded(): boolean {
    if (this.levels.length > 1) {
      return this._expanded;
    }
    // If there is only one level, always display all breadcrumb entries
    return true;
  }
  private _expanded = false;

  expand() {
    this._expanded = true;
  }
}
