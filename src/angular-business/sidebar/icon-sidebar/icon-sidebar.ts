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
  selector: 'sbb-icon-sidebar-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sbb-sidebar-content sbb-icon-sidebar-content sbb-scrollbar',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbIconSidebarContent extends SbbSidebarContentBase {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SbbIconSidebarContainer)) container: SbbIconSidebarContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
  }
}

@Component({
  selector: 'sbb-icon-sidebar',
  exportAs: 'sbbIconSidebar',
  templateUrl: './icon-sidebar.html',
  animations: [sbbSidebarAnimations.transformSidebar],
  host: {
    class: 'sbb-sidebar sbb-icon-sidebar',
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
export class SbbIconSidebar extends SbbSidebarBase {}

@Component({
  selector: 'sbb-icon-sidebar-container',
  exportAs: 'sbbIconSidebarContainer',
  templateUrl: './icon-sidebar-container.html',
  styleUrls: ['./icon-sidebar.css'],
  host: {
    class: 'sbb-sidebar-container sbb-icon-sidebar-container',
    '[class.sbb-sidebar-container-explicit-backdrop]': '_backdropOverride',
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
export class SbbIconSidebarContainer extends SbbSidebarContainerBase {
  static ngAcceptInputType_hasBackdrop: BooleanInput;
  @ContentChildren(SbbIconSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allSidebars: QueryList<SbbIconSidebar>;

  @ContentChild(SbbIconSidebarContent) _content: SbbIconSidebarContent;
  @ViewChild(SbbIconSidebarContent) _userContent: SbbIconSidebarContent;
}
