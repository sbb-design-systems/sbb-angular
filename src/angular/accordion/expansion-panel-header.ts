import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostAttributeToken,
  HostListener,
  inject,
  Input,
  numberAttribute,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { TypeRef } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { EMPTY, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SbbExpansionPanel } from './expansion-panel';

/**
 * This component corresponds to the header element of an `<sbb-expansion-panel>`.
 */
@Component({
  selector: 'sbb-expansion-panel-header',
  templateUrl: './expansion-panel-header.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['tabIndex'],
  host: {
    class: 'sbb-expansion-panel-header sbb-expansion-panel-horizontal-padding',
    role: 'button',
    '[attr.id]': 'panel._headerId',
    '[attr.tabindex]': 'disabled ? -1 : tabIndex',
    '[attr.aria-controls]': '_getPanelId()',
    '[attr.aria-expanded]': '_isExpanded()',
    '[attr.aria-disabled]': 'disabled',
    '[class.sbb-expanded]': '_isExpanded()',
    '[class.sbb-disabled]': 'disabled',
  },
  imports: [SbbIconModule, AsyncPipe],
})
export class SbbExpansionPanelHeader implements AfterViewInit, OnDestroy, FocusableOption {
  panel: SbbExpansionPanel = inject(SbbExpansionPanel, { host: true });
  private _element = inject(ElementRef);
  private _focusMonitor = inject(FocusMonitor);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _document = inject<TypeRef<Document>>(DOCUMENT);

  @Input({ transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)) })
  tabIndex: number = 0;

  private _parentChangeSubscription = Subscription.EMPTY;

  constructor(...args: unknown[]);
  constructor() {
    const panel = this.panel;
    const tabIndex = inject(new HostAttributeToken('tabindex'), { optional: true });

    const accordionHideToggleChange = panel.accordion
      ? panel.accordion._stateChanges.pipe(filter((changes) => !!changes['hideToggle']))
      : EMPTY;
    this.tabIndex = parseInt(tabIndex || '', 10) || 0;

    // Since the toggle state depends on an @Input on the panel, we
    // need to subscribe and trigger change detection manually.
    this._parentChangeSubscription = merge(
      panel.opened,
      panel.closed,
      accordionHideToggleChange,
      panel._inputChanges.pipe(
        filter((changes) => !!(changes['hideToggle'] || changes['disabled'])),
      ),
    ).subscribe(() => this._changeDetectorRef.markForCheck());

    // Avoids focus being lost if the panel contained the focused element and was closed.
    panel.closed
      .pipe(filter(() => panel._containsFocus()))
      .subscribe(() => this._focusMonitor.focusVia(this._element, 'program'));
  }

  /**
   * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
   * @docs-private
   */
  get disabled() {
    return this.panel.disabled;
  }

  /** Toggles the expanded state of the panel. */
  @HostListener('click')
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
  @HostListener('keydown', ['$event'])
  _keydown(event: TypeRef<KeyboardEvent>) {
    switch (event.keyCode) {
      // Toggle for space and enter keys.
      case SPACE:
      case ENTER:
        if (!hasModifierKey(event) && this._isFocused()) {
          // See https://github.com/sbb-design-systems/sbb-angular/issues/377
          event.preventDefault();
          this._toggle();
        }
        break;
      default:
        if (this.panel.accordion) {
          this.panel.accordion._handleHeaderKeydown(event);
        }

        return;
    }
  }

  /**
   * Focuses the panel header. Implemented as a part of `FocusableOption`.
   * @param origin Origin of the action that triggered the focus.
   * @docs-private
   */
  focus(origin?: FocusOrigin, options?: FocusOptions) {
    if (origin) {
      this._focusMonitor.focusVia(this._element, origin, options);
    } else {
      this._element.nativeElement.focus(options);
    }
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._element).subscribe((origin) => {
      if (origin && this.panel.accordion) {
        this.panel.accordion._handleHeaderFocus(this);
      }
    });
  }

  ngOnDestroy() {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._element);
  }

  private _isFocused() {
    return this._document?.activeElement === this._element.nativeElement;
  }
}
