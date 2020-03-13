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
  HostBinding,
  Inject,
  InjectionToken,
  NgZone,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {
  Breakpoints,
  SCALING_FACTOR_4K,
  SCALING_FACTOR_5K
} from '@sbb-esta/angular-core/breakpoints';
import {
  DROPDOWN_SCROLL_STRATEGY,
  DropdownComponent,
  DropdownOriginDirective,
  DropdownTriggerDirective
} from '@sbb-esta/angular-public/dropdown';

/**
 * Describes a parent component that manages a list of options.
 * Contains properties that the options can inherit.
 * @docs-private
 */
export interface BreadcrumbParentComponent {
  levels: QueryList<BreadcrumbComponent>;
}

/**
 * Injection token used to provide the parent component to options.
 */
export const SBB_BREADCRUMB_PARENT_COMPONENT = new InjectionToken<BreadcrumbParentComponent>(
  'SBB_BREADCRUMB_PARENT_COMPONENT'
);

export const BREADCRUMB_LEVEL_OFFSET = 60;

@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent extends DropdownTriggerDirective implements AfterViewInit {
  /**
   * Refers to a dropdown instance.
   */
  @ContentChild(DropdownComponent) dropdown: DropdownComponent;

  /**
   * Trigger on the open of the dropdown contained in breadcrumb.
   */
  @ViewChild('breadcrumbTrigger') breadcrumbTrigger: ElementRef;

  /**
   * Css class of a sbb-breadcrumb.
   */
  @HostBinding('class.sbb-breadcrumb')
  cssClass = true;

  /**
   * Css class on a breadcrumb panel.
   */
  panelClass = 'sbb-breadcrumb-panel';

  private _scalingFactor: number = 1;

  /**
   * Checks if the current breadcrumb is the first child of his parent (breadcrumbs)
   */
  get isFirst(): boolean {
    if (this._parent && this._parent.levels.first) {
      return this === this._parent.levels.first;
    }
    return false;
  }

  /**
   * Event emitted at the expansion of the dropdown.
   */
  @Output() expandEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Optional()
    @Inject(SBB_BREADCRUMB_PARENT_COMPONENT)
    private _parent: BreadcrumbParentComponent,
    private _breakpointObserver: BreakpointObserver,
    protected _elementRef: ElementRef<HTMLInputElement>,
    protected _overlay: Overlay,
    protected _viewContainerRef: ViewContainerRef,
    protected _zone: NgZone,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Inject(DROPDOWN_SCROLL_STRATEGY) protected _scrollStrategy,
    @Optional() @Inject(DOCUMENT) protected _document: any,
    protected _viewportRuler?: ViewportRuler
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
      this.connectedTo = new DropdownOriginDirective(this.breadcrumbTrigger);
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
  handleKeydown(event: KeyboardEvent): void {
    if (this.dropdown) {
      super.handleKeydown(event);
    }
  }

  expand($event: any) {
    this.expandEvent.emit();
    $event.stopPropagation();
  }

  protected _getPanelWidth(): number | string {
    return this._getHostWidth() + BREADCRUMB_LEVEL_OFFSET * this._scalingFactor;
  }

  protected _attachOverlay(): void {
    if (this.dropdown) {
      super._attachOverlay();
    }
  }
}
