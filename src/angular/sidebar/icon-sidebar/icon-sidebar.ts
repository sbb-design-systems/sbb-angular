// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Output,
  QueryList,
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
  standalone: true,
})
export class SbbIconSidebarContent extends SbbSidebarContentBase {
  constructor(
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone,
  ) {
    super(elementRef, scrollDispatcher, ngZone);
  }
}

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
  standalone: true,
  imports: [CdkScrollable, SbbIcon],
})
export class SbbIconSidebar extends SbbSidebarBase {
  _labelCollapse: string = $localize`:Label to 'collapse' icon sidebar@@sbbSidebarCollapse:Collapse`;

  _labelExpand: string = $localize`:Label to 'expand' icon sidebar@@sbbSidebarExpand:Expand`;

  /** Whether the sidebar is expanded. */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: BooleanInput) {
    this.toggleExpanded(coerceBooleanProperty(value));
  }
  private _expanded = false;

  /** Event emitted when the icon sidebar expanded state is changed. */
  @Output() readonly expandedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  constructor(
    @Inject(SBB_SIDEBAR_CONTAINER) container: SbbIconSidebarContainer,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
  ) {
    super(container);
  }

  toggleExpanded(expanded: boolean = !this._expanded) {
    this._expanded = expanded;
    this.expandedChange.emit(this.expanded);
  }

  _mobileChanged(mobile: boolean): void {
    this._elementRef.nativeElement.querySelector('.sbb-icon-sidebar-inner-container')!.scrollLeft =
      0;

    this._changeDetectorRef.markForCheck();
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
  standalone: true,
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
  override _allSidebars: QueryList<SbbIconSidebar>;

  @ContentChild(SbbIconSidebarContent) override _content: SbbIconSidebarContent;
  @ViewChild(SbbIconSidebarContent) override _userContent: SbbIconSidebarContent;

  constructor(
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    breakpointObserver: BreakpointObserver,
  ) {
    super(ngZone, changeDetectorRef, breakpointObserver);
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    this._sidebars.changes.pipe(startWith(null)).subscribe(() => {
      this._validateSidebars();
    });

    // Has to be called at last (needs sidebar to be set)
    this._watchBreakpointObserver();
  }
}
