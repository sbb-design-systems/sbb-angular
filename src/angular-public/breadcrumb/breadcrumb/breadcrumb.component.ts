import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Overlay, ViewportRuler } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  NgZone,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  Breakpoints,
  SCALING_FACTOR_4K,
  SCALING_FACTOR_5K,
} from '@sbb-esta/angular-core/breakpoints';
import {
  SbbDropdown,
  SbbDropdownOrigin,
  SbbDropdownTrigger,
  SBB_DROPDOWN_SCROLL_STRATEGY,
} from '@sbb-esta/angular-public/dropdown';

/**
 * Describes a parent component that manages a list of options.
 * Contains properties that the options can inherit.
 * @docs-private
 */
export interface SbbBreadcrumbParent {
  levels: QueryList<SbbBreadcrumb>;
}

/** Injection token used to provide the parent component to options. */
export const SBB_BREADCRUMB_PARENT_COMPONENT = new InjectionToken<SbbBreadcrumbParent>(
  'SBB_BREADCRUMB_PARENT_COMPONENT'
);

export const SBB_BREADCRUMB_LEVEL_OFFSET = 60;

@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-breadcrumb sbb-icon-fit',
  },
})
export class SbbBreadcrumb extends SbbDropdownTrigger implements AfterViewInit {
  /** Refers to a dropdown instance. */
  @ContentChild(SbbDropdown) override dropdown: SbbDropdown;

  /** Trigger on the open of the dropdown contained in breadcrumb. */
  @ViewChild('breadcrumbTrigger') breadcrumbTrigger: ElementRef;

  /** Css class on a breadcrumb panel. */
  override panelClass: string = 'sbb-breadcrumb-panel';

  private _scalingFactor: number = 1;

  /** Checks if the current breadcrumb is the first child of his parent (breadcrumbs) */
  get isFirst(): boolean {
    return this._parent && this._parent.levels?.first === this;
  }

  /** Event emitted at the expansion of the dropdown. */
  @Output() expandEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Optional()
    @Inject(SBB_BREADCRUMB_PARENT_COMPONENT)
    private _parent: SbbBreadcrumbParent,
    private _breakpointObserver: BreakpointObserver,
    protected override _elementRef: ElementRef<HTMLInputElement>,
    protected override _overlay: Overlay,
    protected override _viewContainerRef: ViewContainerRef,
    protected override _zone: NgZone,
    protected override _changeDetectorRef: ChangeDetectorRef,
    @Inject(SBB_DROPDOWN_SCROLL_STRATEGY) protected override _scrollStrategy: any,
    @Optional() @Inject(DOCUMENT) protected override _document: any,
    protected override _viewportRuler?: ViewportRuler
  ) {
    super(
      _elementRef,
      _overlay,
      _viewContainerRef,
      _zone,
      _changeDetectorRef,
      _scrollStrategy,
      _document,
      _viewportRuler
    );
  }

  ngAfterViewInit() {
    if (this.dropdown) {
      this.connectedTo = new SbbDropdownOrigin(this.breadcrumbTrigger);
    }

    this._breakpointObserver
      .observe([Breakpoints.Desktop4k, Breakpoints.Desktop5k])
      .subscribe((result: BreakpointState) => {
        this._scalingFactor = 1;

        if (result.matches) {
          if (result.breakpoints[Breakpoints.Desktop4k]) {
            this._scalingFactor = SCALING_FACTOR_4K;
          }
          if (result.breakpoints[Breakpoints.Desktop5k]) {
            this._scalingFactor = SCALING_FACTOR_5K;
          }
        }
      });
  }

  /** Handles all keydown events on the select. */
  override _handleKeydown(event: KeyboardEvent): void {
    if (this.dropdown) {
      super._handleKeydown(event);
    }
  }

  expand($event: any) {
    this.expandEvent.emit();
    $event.stopPropagation();
  }

  protected override _getPanelWidth(): number | string {
    return this._getHostWidth() + SBB_BREADCRUMB_LEVEL_OFFSET * this._scalingFactor;
  }

  protected override _attachOverlay(): void {
    if (this.dropdown) {
      super._attachOverlay();
    }
  }
}
