// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { startWith } from 'rxjs/operators';

import {
  SbbSidebarBase,
  SbbSidebarContainerBase,
  SbbSidebarContentBase,
  SbbSidebarMobileCapableContainer,
  SBB_SIDEBAR_CONTAINER,
} from '../sidebar-base';

export function throwSbbDuplicatedIconSidebarError() {
  throw Error(
    `Only one icon-sidebar as direct descendant of sidebar container at once is allowed'`,
  );
}

@Component({
  selector: 'sbb-icon-sidebar-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sbb-icon-sidebar-content sbb-scrollbar',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CdkScrollable,
      useExisting: SbbIconSidebarContent,
    },
  ],
})
export class SbbIconSidebarContent extends SbbSidebarContentBase {}

@Component({
  selector: 'sbb-icon-sidebar',
  exportAs: 'sbbIconSidebar',
  templateUrl: './icon-sidebar.html',
  host: {
    class: 'sbb-icon-sidebar',
    tabIndex: '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    role: 'navigation',
    '[class.sbb-icon-sidebar-expanded]': 'expanded && !_container._mobile',
    '[class.sbb-icon-sidebar-collapsed]': '!expanded && !_container._mobile',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkScrollable, SbbIcon],
})
export class SbbIconSidebar extends SbbSidebarBase {
  private _changeDetectorRef = inject(ChangeDetectorRef);

  _container: SbbIconSidebarContainer = inject<SbbIconSidebarContainer>(SBB_SIDEBAR_CONTAINER);

  _labelCollapse: string = $localize`:Label to 'collapse' icon sidebar@@sbbSidebarCollapse:Collapse`;

  _labelExpand: string = $localize`:Label to 'expand' icon sidebar@@sbbSidebarExpand:Expand`;

  /** Whether the sidebar is expanded. */
  @Input({ transform: booleanAttribute })
  get expanded(): boolean {
    return this._expanded();
  }
  set expanded(value: boolean) {
    this.toggleExpanded(value);
  }
  private _expanded = signal(false);

  /** Event emitted when the icon sidebar expanded state is changed. */
  @Output() readonly expandedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  constructor(...args: unknown[]);
  constructor() {
    super();
  }

  toggleExpanded(expanded: boolean = !this._expanded()) {
    this._expanded.set(expanded);
    this.expandedChange.emit(this.expanded);
  }

  _mobileChanged(mobile: boolean): void {
    this._elementRef.nativeElement.querySelector('.sbb-icon-sidebar-inner-container')!.scrollLeft =
      0;

    this._updatePositionInParent(this.position);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * On mobile devices, the position of the sidebar is always 'start'.
   * @docs-private
   */
  override _updatePositionInParent(position: 'start' | 'end') {
    if (this._container._mobile) {
      super._updatePositionInParent('start');
    } else {
      super._updatePositionInParent(position);
    }
  }
}

@Component({
  selector: 'sbb-icon-sidebar-container',
  exportAs: 'sbbIconSidebarContainer',
  templateUrl: './icon-sidebar-container.html',
  styleUrls: ['./icon-sidebar.css'],
  host: {
    class: 'sbb-icon-sidebar-container',
    '[class.sbb-icon-sidebar-container-mobile]': '_mobile',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SBB_SIDEBAR_CONTAINER,
      useExisting: SbbIconSidebarContainer,
    },
  ],
  imports: [SbbIconSidebarContent],
})
export class SbbIconSidebarContainer
  extends SbbSidebarContainerBase<SbbIconSidebar>
  implements AfterContentInit, SbbSidebarMobileCapableContainer
{
  /** All sidebars in the container. Includes sidebars from inside nested containers. */
  @ContentChildren(SbbIconSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  // We need an initializer here to avoid a TS error.
  override _allSidebars: QueryList<SbbIconSidebar> = undefined!;
  @ContentChild(SbbIconSidebarContent) override _content: SbbIconSidebarContent = undefined!;
  @ViewChild(SbbIconSidebarContent) override _userContent: SbbIconSidebarContent = undefined!;

  constructor(...args: unknown[]);
  constructor() {
    super();
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    this._sidebars.changes.pipe(startWith(null)).subscribe(() => {
      this._validateSidebars();
    });

    // Has to be called at last (needs sidebar to be set)
    this._watchBreakpointObserver();
  }

  /** Validate the state of the icon sidebar children components. */
  override _validateSidebars() {
    super._validateSidebars();

    if (this._sidebars.length > 1 && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwSbbDuplicatedIconSidebarError();
    }
  }
}
