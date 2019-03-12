import {
  Component,
  AfterViewInit,
  ContentChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  EventEmitter,
  Host,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
  Inject,
  Optional,
  InjectionToken,
  QueryList,
  AfterContentInit
} from '@angular/core';

import { DropdownTriggerDirective, DROPDOWN_SCROLL_STRATEGY } from '../../dropdown/dropdown-trigger.directive';
import { DropdownOriginDirective } from '../../dropdown/dropdown-origin.directive';
import { DropdownComponent } from '../../dropdown/dropdown/dropdown.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { Overlay, ViewportRuler } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';

const DESKTOP_4K_BREAKPOINT = 2561;
const DESKTOP_5K_BREAKPOINT = 3841;
const BREADCRUMB_LEVEL_OFFSET = 60;
const SCALING_FACTOR_4K = 1.5;
const SCALING_FACTOR_5K = 2;

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


@Component({
  selector: 'sbb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent extends DropdownTriggerDirective implements AfterViewInit {

  @ContentChild(DropdownComponent) dropdown: DropdownComponent;

  @ViewChild('breadcrumbTrigger') breadcrumbTrigger: ElementRef;

  @HostBinding('class.sbb-breadcrumb')
  cssClass = true;

  panelClass = 'sbb-breadcrumb-panel';

  constructor(@Optional() @Inject(SBB_BREADCRUMB_PARENT_COMPONENT) private _parent: BreadcrumbParentComponent,
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

  get isFirst(): boolean {
    if (this._parent && this._parent.levels.first) {
      return this === this._parent.levels.first;
    }
    return false;
  }

  expandEvent: EventEmitter<any> = new EventEmitter<any>();


  ngAfterViewInit() {
    if (this.dropdown) {
      this.connectedTo = new DropdownOriginDirective(this.breadcrumbTrigger);
    }
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
    let scalingFactor = 1;
    if (this.viewportRuler.getViewportSize().width > DESKTOP_4K_BREAKPOINT) {
      scalingFactor = SCALING_FACTOR_4K;
    }
    if (this.viewportRuler.getViewportSize().width > DESKTOP_5K_BREAKPOINT) {
      scalingFactor = SCALING_FACTOR_5K;
    }
    return this.getHostWidth() + (BREADCRUMB_LEVEL_OFFSET * scalingFactor);
  }

  protected attachOverlay(): void {
    if (this.dropdown) {
      super.attachOverlay();
    }
  }

}
