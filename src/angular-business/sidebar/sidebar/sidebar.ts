import { BooleanInput } from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  forwardRef,
  Inject,
  NgZone,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { sbbSidebarAnimations } from '../sidebar-animations';
import {
  SbbSidebarBase,
  SbbSidebarContainerBase,
  SbbSidebarContentBase,
  SBB_SIDEBAR_CONTAINER,
} from '../sidebar-base';

@Component({
  selector: 'sbb-sidebar-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sbb-sidebar-content sbb-sidebar-content sbb-scrollbar',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbSidebarContent extends SbbSidebarContentBase {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SbbSidebarContainer)) container: SbbSidebarContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
  }
}

@Component({
  selector: 'sbb-sidebar',
  exportAs: 'sbbSidebar',
  templateUrl: './sidebar.html',
  animations: [sbbSidebarAnimations.transformSidebar],
  host: {
    class: 'sbb-sidebar sbb-sidebar',
    tabIndex: '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.sbb-sidebar-over]': 'mode === "over"',
    '[class.sbb-sidebar-push]': 'mode === "push"',
    '[class.sbb-sidebar-side]': 'mode === "side"',
    '[class.sbb-sidebar-opened]': 'opened',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbSidebar extends SbbSidebarBase {}

@Component({
  selector: 'sbb-sidebar-container',
  exportAs: 'sbbSidebarContainer',
  templateUrl: './sidebar-container.html',
  styleUrls: ['./sidebar.css'],
  host: {
    class: 'sbb-sidebar-container sbb-sidebar-container',
    '[class.sbb-sidebar-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SBB_SIDEBAR_CONTAINER,
      useExisting: SbbSidebarContainer,
    },
  ],
})
export class SbbSidebarContainer extends SbbSidebarContainerBase {
  static ngAcceptInputType_hasBackdrop: BooleanInput;
  @ContentChildren(SbbSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allSidebars: QueryList<SbbSidebar>;

  @ContentChild(SbbSidebarContent) _content: SbbSidebarContent;
  @ViewChild(SbbSidebarContent) _userContent: SbbSidebarContent;
}
