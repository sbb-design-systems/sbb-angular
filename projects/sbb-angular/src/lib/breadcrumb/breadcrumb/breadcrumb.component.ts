import {
  Component,
  AfterViewInit,
  ContentChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  HostBinding,
  ViewChild,
  ElementRef,
  EventEmitter,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
  Inject,
  Optional,
  InjectionToken,
  QueryList
} from '@angular/core';

import { DropdownTriggerDirective, DROPDOWN_SCROLL_STRATEGY } from '../../dropdown/dropdown-trigger.directive';
import { DropdownOriginDirective } from '../../dropdown/dropdown-origin.directive';
import { DropdownComponent } from '../../dropdown/dropdown/dropdown.component';
import { Overlay, ViewportRuler } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Breakpoints, ScalingFactor4k, ScalingFactor5k } from '../../breakpoints/breakpoints';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


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
export const SBB_BREADCRUMB_PARENT_COMPONENT =
  new InjectionToken<BreadcrumbParentComponent>('SBB_BREADCRUMB_PARENT_COMPONENT');


const BREADCRUMB_LEVEL_OFFSET = 60;

@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent extends DropdownTriggerDirective implements AfterViewInit {

  /**
   * Refers to a dropdown istance.
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

  private breadcrumbPanelWidth: any;


  constructor(@Optional() @Inject(SBB_BREADCRUMB_PARENT_COMPONENT) private _parent: BreadcrumbParentComponent,
    private breakpointObserver: BreakpointObserver,
    protected element: ElementRef<HTMLInputElement>,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
    protected zone: NgZone,
    protected changeDetectorRef: ChangeDetectorRef,
    @Inject(DROPDOWN_SCROLL_STRATEGY) protected scrollStrategy,
    @Optional() @Inject(DOCUMENT) protected _document: any,
    protected viewportRuler?: ViewportRuler) {
    super(element, overlay, viewContainerRef, zone, changeDetectorRef, scrollStrategy, _document, viewportRuler);
  }

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
  expandEvent: EventEmitter<any> = new EventEmitter<any>();


  ngAfterViewInit() {
    if (this.dropdown) {
      this.connectedTo = new DropdownOriginDirective(this.breadcrumbTrigger);
    }

    this.breakpointObserver
      .observe([Breakpoints.Desktop4k, Breakpoints.Desktop5k])
      .subscribe((result: BreakpointState) => {
        let scalingFactor = 1;

        if (result.matches) {
          if (result.breakpoints[Breakpoints.Desktop4k]) {
            scalingFactor = ScalingFactor4k;
          }
          if (result.breakpoints[Breakpoints.Desktop5k]) {
            scalingFactor = ScalingFactor5k;
          }
        }
        this.breadcrumbPanelWidth = this.getHostWidth() + BREADCRUMB_LEVEL_OFFSET * scalingFactor;

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

  protected getPanelWidth(): number | string {
    return this.breadcrumbPanelWidth;
  }

  protected attachOverlay(): void {
    if (this.dropdown) {
      super.attachOverlay();
    }
  }

}
