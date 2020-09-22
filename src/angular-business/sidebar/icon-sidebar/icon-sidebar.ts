import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
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
})
export class SbbIconSidebarContent extends SbbSidebarContentBase {
  constructor(
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
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
    'attr.role': 'navigation',
    '[class.sbb-icon-sidebar-expanded]': 'expanded && !_container._mobile',
    '[class.sbb-icon-sidebar-collapsed]': '!expanded && !_container._mobile',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbIconSidebar extends SbbSidebarBase {
  /**
   * Whether the sidebar is expanded.
   */
  @Input()
  set expanded(value: boolean) {
    this.toggleExpanded(coerceBooleanProperty(value));
  }
  get expanded(): boolean {
    return this._expanded;
  }
  private _expanded = false;

  /** Event emitted when the icon sidebar expanded state is changed. */
  @Output() readonly expandedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  constructor(
    @Inject(SBB_SIDEBAR_CONTAINER) container: SbbIconSidebarContainer,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    super(container);
  }

  toggleExpanded(expanded: boolean = !this._expanded) {
    this._expanded = expanded;
    this.expandedChange.emit(this.expanded);
  }

  _mobileChanged(mobile: boolean): void {
    this._elementRef.nativeElement.querySelector(
      '.sbb-icon-sidebar-inner-container'
    )!.scrollLeft = 0;

    this._changeDetectorRef.markForCheck();
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_expanded: BooleanInput;
  // tslint:enable: member-ordering
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
})
export class SbbIconSidebarContainer extends SbbSidebarContainerBase<SbbIconSidebar>
  implements AfterContentInit, SbbSidebarMobileCapableContainer {
  /** All sidebars in the container. Includes sidebars from inside nested containers. */
  @ContentChildren(SbbIconSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allSidebars: QueryList<SbbIconSidebar>;

  @ContentChild(SbbIconSidebarContent) _content: SbbIconSidebarContent;
  @ViewChild(SbbIconSidebarContent) _userContent: SbbIconSidebarContent;

  constructor(
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    breakpointObserver: BreakpointObserver
  ) {
    super(ngZone, changeDetectorRef, breakpointObserver);
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this._sidebars.changes.pipe(startWith(null)).subscribe(() => {
      this._validateSidebars();
    });

    // Has to be called at last (needs sidebar to be set)
    this._watchBreakpointObserver();
  }
}
