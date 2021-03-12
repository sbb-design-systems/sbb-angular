import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { TypeRef } from '@sbb-esta/angular/core';
import { EMPTY, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { sbbExpansionAnimations } from '../accordion-animations';
import { SbbExpansionPanel } from '../expansion-panel/expansion-panel';

/**
 * `<sbb-expansion-panel-header>`
 *
 * This component corresponds to the header element of an `<sbb-expansion-panel>`.
 */
@Component({
  selector: 'sbb-expansion-panel-header',
  styleUrls: ['./expansion-panel-header.css'],
  templateUrl: './expansion-panel-header.html',
  animations: [sbbExpansionAnimations.indicatorRotate],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-expansion-panel-header',
    role: 'button',
    '[attr.id]': 'panel._headerId',
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.aria-controls]': '_getPanelId()',
    '[attr.aria-expanded]': '_isExpanded()',
    '[attr.aria-disabled]': 'disabled',
    '[class.sbb-expansion-panel-header-hide-toggle]': '!_showToggle()',
    '[class.sbb-expanded]': '_isExpanded()',
    '[class.sbb-disabled]': 'disabled',
    '(click)': '_toggle()',
    '(keydown)': '_keydown($event)',
  },
})
export class SbbExpansionPanelHeader implements OnDestroy, FocusableOption {
  /**
   * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
   * @docs-private
   */
  get disabled() {
    return this.panel.disabled;
  }

  private _parentChangeSubscription = Subscription.EMPTY;

  constructor(
    /** Class property that refers to the ExpansionPanelComponent. */
    @Host() public panel: SbbExpansionPanel,
    private _element: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document?: TypeRef<Document>
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
      .pipe(filter(() => panel._containsFocus()))
      .subscribe(() => _focusMonitor.focusVia(_element.nativeElement, 'program'));

    _focusMonitor.monitor(_element.nativeElement).subscribe((origin) => {
      if (origin && panel.accordion) {
        panel.accordion.handleHeaderFocus(this);
      }
    });

    this._document = document;
  }

  /** Toggles the expanded state of the panel. */
  _toggle(): void {
    if (!this.disabled) {
      this.panel.toggle();
    }
  }

  /** Gets whether the panel is expanded. */
  _isExpanded(): boolean {
    return this.panel.expanded;
  }

  /** Gets the expanded state string of the panel. */
  _getExpandedState(): string {
    return this.panel._getExpandedState();
  }

  /** Gets the panel id. */
  _getPanelId(): string {
    return this.panel.id;
  }

  /** Gets whether the expand indicator should be shown. */
  _showToggle(): boolean {
    return !this.panel.hideToggle && !this.panel.disabled;
  }

  /** Handle keydown event calling to toggle() if appropriate. */
  _keydown(event: TypeRef<KeyboardEvent>) {
    switch (event.keyCode) {
      // Toggle for space and enter keys.
      case SPACE:
      case ENTER:
        if (!hasModifierKey(event) && this._isFocused()) {
          event.preventDefault();
          this._toggle();
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
  focus(origin: FocusOrigin = 'program', options?: FocusOptions) {
    this._focusMonitor.focusVia(this._element.nativeElement, origin, options);
  }

  ngOnDestroy() {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._element.nativeElement);
  }

  private _isFocused() {
    return this._document?.activeElement === this._element.nativeElement;
  }
}
