import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostListener,
  Inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { TypeRef } from '@sbb-esta/angular-core/common-behaviors';
import { EMPTY, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { sbbExpansionAnimations } from '../accordion/accordion-animations';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';

/**
 * `<sbb-expansion-panel-header>`
 *
 * This component corresponds to the header element of an `<sbb-expansion-panel>`.
 */
@Component({
  selector: 'sbb-expansion-panel-header',
  styleUrls: ['./expansion-panel-header.component.css'],
  templateUrl: './expansion-panel-header.component.html',
  animations: [sbbExpansionAnimations.indicatorRotate],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-expansion-panel-header',
    role: 'button',
    '[attr.id]': 'panel.headerId',
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.aria-controls]': '_getPanelId()',
    '[attr.aria-expanded]': '_isExpanded()',
    '[attr.aria-disabled]': 'panel.disabled',
    '[class.sbb-expansion-panel-header-hide-toggle]': '!this.showToggle()',
    '[class.sbb-expanded]': '_isExpanded()',
    '[class.sbb-expansion-panel-header-disabled]': 'panel.disabled',
  },
})
export class ExpansionPanelHeaderComponent implements OnDestroy, FocusableOption {
  /** @deprecated internal detail */
  panelHeaderClass = true;
  /** @deprecated internal detail */
  panelHeaderRole = 'button';
  /** @deprecated internal detail */
  panelHeaderAttrId: string = this.panel.headerId;
  /** @deprecated internal detail */
  get tabIndex() {
    return this.disabled ? '-1' : '0';
  }
  /** @deprecated internal detail */
  get ariaDisabled() {
    return this.panel.disabled;
  }
  /** @deprecated internal detail */
  get getPanelId(): string {
    return this.panel.id;
  }
  /** @deprecated internal detail */
  get hasNoToggle(): boolean {
    return !this.showToggle();
  }
  /** @deprecated internal detail */
  get isExpanded(): boolean {
    return this.panel.expanded;
  }

  /**
   * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
   * @docs-private
   */
  get disabled() {
    return this.panel.disabled;
  }

  private _parentChangeSubscription = Subscription.EMPTY;

  private _document: Document;

  constructor(
    /**
     * Class property that refers to the ExpansionPanelComponent.
     */
    @Host() public panel: ExpansionPanelComponent,
    private _element: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document?: any
  ) {
    const accordionHideToggleChange = panel.accordion
      ? panel.accordion._stateChanges.pipe(filter((changes) => !!changes.hideToggle))
      : EMPTY;

    // Since the toggle state depends on an @Input on the panel, we
    // need to subscribe and trigger change detection manually.
    this._parentChangeSubscription = merge(
      panel.opened,
      panel.closed,
      accordionHideToggleChange,
      panel._inputChanges.pipe(filter((changes) => !!(changes.hideToggle || changes.disabled)))
    ).subscribe(() => this._changeDetectorRef.markForCheck());

    // Avoids focus being lost if the panel contained the focused element and was closed.
    panel.closed
      .pipe(filter(() => panel.containsFocus()))
      .subscribe(() => _focusMonitor.focusVia(_element.nativeElement, 'program'));

    _focusMonitor.monitor(_element.nativeElement).subscribe((origin) => {
      if (origin && panel.accordion) {
        panel.accordion.handleHeaderFocus(this);
      }
    });

    this._document = document;
  }

  /**
   * Toggles the expanded state of the panel.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  @HostListener('click')
  toggle(): void {
    this.panel.toggle();
  }

  /**
   * Gets the expanded state string of the panel.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  getExpandedState(): string {
    return this.panel.getExpandedState();
  }

  /**
   * Gets whether the expand indicator should be shown.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  showToggle(): boolean {
    return !this.panel.hideToggle && !this.panel.disabled;
  }

  /**
   * Handle keydown event calling to toggle() if appropriate.
   * @deprecated internal detail
   * TODO: Prefix with _
   */
  @HostListener('keydown', ['$event'])
  keydown(event: TypeRef<KeyboardEvent>) {
    switch (event.keyCode) {
      // Toggle for space and enter keys.
      case SPACE:
      case ENTER:
        if (this._isFocused()) {
          event.preventDefault();
          this.toggle();
        }
        break;
      default:
        if (this.panel.accordion) {
          this.panel.accordion.handleHeaderKeydown(event);
        }

        return;
    }
  }

  /**
   * Focuses the panel header. Implemented as a part of `FocusableOption`.
   * @param origin Origin of the action that triggered the focus.
   * @docs-private
   */
  focus(origin: FocusOrigin = 'program') {
    this._focusMonitor.focusVia(this._element.nativeElement, origin);
  }

  ngOnDestroy() {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._element.nativeElement);
  }

  /** Gets whether the panel is expanded. */
  _isExpanded(): boolean {
    return this.panel.expanded;
  }

  /** Gets the panel id. */
  _getPanelId(): string {
    return this.panel.id;
  }

  private _isFocused() {
    return this._document?.activeElement === this._element.nativeElement;
  }
}
