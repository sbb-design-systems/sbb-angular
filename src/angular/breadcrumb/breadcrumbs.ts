// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  inject,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import {
  SbbMenuInheritedTriggerContext,
  SBB_MENU_INHERITED_TRIGGER_CONTEXT,
} from '@sbb-esta/angular/menu';

import { SbbBreadcrumb } from './breadcrumb';

export const _sbbBreadcrumbMenuInheritedTriggerContext: SbbMenuInheritedTriggerContext = {
  type: 'breadcrumb',
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
    {
      provide: SBB_MENU_INHERITED_TRIGGER_CONTEXT,
      useValue: _sbbBreadcrumbMenuInheritedTriggerContext,
    },
  ],
  standalone: true,
  imports: [SbbBreadcrumb],
})
export class SbbBreadcrumbs {
  _labelExpand: string = $localize`:Button with three dots to show all breadcrumb levels@@sbbBreadcrumbExpand:Show entire path`;

  /** List of all user defined SbbBreadcrumb entries. */
  @ContentChildren(SbbBreadcrumb) levels: QueryList<SbbBreadcrumb>;

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

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
    this._changeDetectorRef.markForCheck();
  }
}
