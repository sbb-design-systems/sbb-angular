import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
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
  Input,
  NgZone,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';

import { SbbDrawer, SbbDrawerContainer, SbbDrawerContent, SBB_DRAWER_CONTAINER } from './drawer';
import { sbbDrawerAnimations } from './drawer-animations';

@Component({
  selector: 'sbb-sidebar-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sbb-drawer-content sbb-sidebar-content',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbSidebarContent extends SbbDrawerContent {
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
  templateUrl: './drawer.html',
  animations: [sbbDrawerAnimations.transformDrawer],
  host: {
    class: 'sbb-drawer sbb-sidebar',
    tabIndex: '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.sbb-drawer-over]': 'mode === "over"',
    '[class.sbb-drawer-push]': 'mode === "push"',
    '[class.sbb-drawer-side]': 'mode === "side"',
    '[class.sbb-drawer-opened]': 'opened',
    '[class.sbb-sidebar-fixed]': 'fixedInViewport',
    '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
    '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbSidebar extends SbbDrawer {
  /** Whether the sidebar is fixed in the viewport. */
  @Input()
  get fixedInViewport(): boolean {
    return this._fixedInViewport;
  }
  set fixedInViewport(value) {
    this._fixedInViewport = coerceBooleanProperty(value);
  }

  /**
   * The gap between the top of the sidebar and the top of the viewport when the sidebar is in fixed
   * mode.
   */
  @Input()
  get fixedTopGap(): number {
    return this._fixedTopGap;
  }
  set fixedTopGap(value) {
    this._fixedTopGap = coerceNumberProperty(value);
  }

  /**
   * The gap between the bottom of the sidebar and the bottom of the viewport when the sidebar is in
   * fixed mode.
   */
  @Input()
  get fixedBottomGap(): number {
    return this._fixedBottomGap;
  }
  set fixedBottomGap(value) {
    this._fixedBottomGap = coerceNumberProperty(value);
  }

  static ngAcceptInputType_fixedInViewport: BooleanInput;
  static ngAcceptInputType_fixedTopGap: NumberInput;
  static ngAcceptInputType_fixedBottomGap: NumberInput;
  private _fixedInViewport = false;
  private _fixedTopGap = 0;
  private _fixedBottomGap = 0;
}

@Component({
  selector: 'sbb-sidebar-container',
  exportAs: 'sbbSidebarContainer',
  templateUrl: './sidebar-container.html',
  styleUrls: ['./drawer.css'],
  host: {
    class: 'sbb-drawer-container sbb-sidebar-container',
    '[class.sbb-drawer-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SBB_DRAWER_CONTAINER,
      useExisting: SbbSidebarContainer,
    },
  ],
})
export class SbbSidebarContainer extends SbbDrawerContainer {
  static ngAcceptInputType_hasBackdrop: BooleanInput;
  @ContentChildren(SbbSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allDrawers: QueryList<SbbSidebar>;

  @ContentChild(SbbSidebarContent) _content: SbbSidebarContent;
}
