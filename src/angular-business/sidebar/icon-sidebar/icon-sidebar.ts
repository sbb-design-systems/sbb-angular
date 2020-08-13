import { AnimationEvent } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { sbbIconSidebarAnimations } from '@sbb-esta/angular-business/sidebar/icon-sidebar/icon-sidebar-animations';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, startWith, takeUntil } from 'rxjs/operators';

import {
  ISbbSidebarContentMarginChanges,
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
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbIconSidebarContent extends SbbSidebarContentBase {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SbbIconSidebarContainer)) public _container: SbbIconSidebarContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(changeDetectorRef, _container, elementRef, scrollDispatcher, ngZone);
  }
}

@Component({
  selector: 'sbb-icon-sidebar',
  exportAs: 'sbbIconSidebar',
  templateUrl: './icon-sidebar.html',
  animations: [sbbIconSidebarAnimations.transformIconSidebar],
  host: {
    class: 'sbb-sidebar sbb-icon-sidebar sbb-sidebar-side sbb-sidebar-opened',
    tabIndex: '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.sbb-sidebar-expanded]': 'expanded',
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
  private _expanded = true;

  /** @docs-private **/
  _showExpandedLabel = false;

  /** Emits whenever the sidebar has started animating. */
  _animationStarted = new Subject<AnimationEvent>();

  /** Emits whenever the sidebar is done animating. */
  _animationEnd = new Subject<AnimationEvent>();

  /** Current state of the sidebar animation. */
  // @HostBinding is used in the class as it is expected to be extended.  Since @Component decorator
  // metadata is not inherited by child classes, instead the host binding data is defined in a way
  // that can be inherited.
  // tslint:disable:no-host-decorator-in-concrete
  @HostBinding('@width')
  _animationState: 'open-instant' | 'open' | 'void' = 'open-instant';

  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  // tslint:disable-next-line:no-host-decorator-in-concrete
  @HostListener('@width.start', ['$event'])
  _animationStartListener(event: AnimationEvent) {
    this._animationStarted.next(event);
  }

  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  // tslint:disable-next-line:no-host-decorator-in-concrete
  @HostListener('@width.done', ['$event'])
  _animationDoneListener(event: AnimationEvent) {
    this._animationEnd.next(event);
  }

  constructor(
    platform: Platform,
    @Inject(SBB_SIDEBAR_CONTAINER)
    container: SbbIconSidebarContainer
  ) {
    super(platform, container);

    // We need a Subject with distinctUntilChanged, because the `done` event
    // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
    this._animationEnd
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe((event: AnimationEvent) => {
        const { fromState, toState } = event;

        if (
          (toState.indexOf('open') === 0 && fromState === 'void') ||
          (toState === 'void' && fromState.indexOf('open') === 0)
        ) {
          this._showExpandedLabel = !this.expanded;
        }
      });
  }

  toggleExpanded(expanded: boolean = !this._expanded) {
    this._expanded = expanded;

    if (this._expanded) {
      this._showExpandedLabel = false;
      this._animationState = this._enableAnimations ? 'open' : 'open-instant';
    } else {
      this._animationState = 'void';
    }
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
    class: 'sbb-sidebar-container sbb-icon-sidebar-container',
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
  implements AfterContentInit, ISbbSidebarContentMarginChanges {
  @ContentChildren(SbbIconSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allSidebars: QueryList<SbbIconSidebar>;

  @ContentChild(SbbIconSidebarContent) _content: SbbIconSidebarContent;
  @ViewChild(SbbIconSidebarContent) _userContent: SbbIconSidebarContent;

  /**
   * Margins to be applied to the content. These are used to push / shrink the sidebar content when a
   * sidebar is open. We use margin rather than transform even for push mode because transform breaks
   * fixed position elements inside of the transformed element.
   */
  _contentMargins: { left: number | null } = { left: null };

  readonly _contentMarginChanges = new Subject<{ left: number | null }>();

  constructor(
    private _element: ElementRef<HTMLElement>,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {
    super(ngZone, changeDetectorRef, viewportRuler);
  }

  /**
   * Recalculates and updates the inline styles for the content. Note that this should be used
   * sparingly, because it causes a reflow.
   */
  updateContentMargins() {
    let left = 48; // TODO: try to add it to css classes

    if (this._sidebar && this._sidebar.expanded) {
      left = 200; // TODO: try to add it to css classes
    }

    if (left !== this._contentMargins.left) {
      this._contentMargins = { left };

      // Pull back into the NgZone since in some cases we could be outside. We need to be careful
      // to do it only when something changed, otherwise we can end up hitting the zone too often.
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this._sidebars.changes.pipe(startWith(null)).subscribe(() => {
      this._validateSidebars();

      this._sidebars.forEach((sidebar: SbbIconSidebar) => {
        this._watchExpandedToggle(sidebar);
      });

      this.updateContentMargins();

      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Subscribes to sidebar events in order to set a class on the main container element when the
   * sidebar is open and the backdrop is visible. This ensures any overflow on the container element
   * is properly hidden.
   */
  private _watchExpandedToggle(sidebar: SbbIconSidebar): void {
    sidebar._animationStarted
      .pipe(
        filter((event: AnimationEvent) => event.fromState !== event.toState),
        takeUntil(this._sidebars.changes)
      )
      .subscribe((event: AnimationEvent) => {
        // Set the transition class on the container so that the animations occur. This should not
        // be set initially because animations should only be triggered via a change in state.
        if (event.toState !== 'open-instant' && this._animationMode !== 'NoopAnimations') {
          this._element.nativeElement.classList.add('sbb-sidebar-transition');
        }

        this.updateContentMargins();
        this._changeDetectorRef.markForCheck();
      });
  }
}
