import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { EMPTY, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelHeaderComponent implements OnDestroy, FocusableOption {
  /**
   * Class property that refers to the attribute class of the header panel.
   */
  @HostBinding('class.sbb-expansion-panel-header')
  panelHeaderClass = true;
  /**
   * Class property that refers to the role of the header panel.
   */
  @HostBinding('attr.role')
  panelHeaderRole = 'button';
  /**
   * Class property that refers to the identifier of the header panel.
   */
  @HostBinding('attr.id')
  panelHeaderAttrId: string = this.panel.headerId;

  @HostBinding('attr.tabindex')
  get tabIndex() {
    return this.disabled ? '-1' : '0';
  }
  /**
   * Class property that gets the status disabled of the panel.
   */
  @HostBinding('attr.aria-disabled')
  get ariaDisabled() {
    return this.panel.disabled;
  }

  private _parentChangeSubscription = Subscription.EMPTY;

  constructor(
    /**
     * Class property that refers to the ExpansionPanelComponent.
     */
    @Host() public panel: ExpansionPanelComponent,
    private _element: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    const accordionHideToggleChange = panel.accordion
      ? panel.accordion._stateChanges.pipe(filter(changes => !!changes.hideToggle))
      : EMPTY;

    // Since the toggle state depends on an @Input on the panel, we
    // need to subscribe and trigger change detection manually.
    this._parentChangeSubscription = merge(
      panel.opened,
      panel.closed,
      accordionHideToggleChange,
      panel._inputChanges.pipe(filter(changes => !!(changes.hideToggle || changes.disabled)))
    ).subscribe(() => this._changeDetectorRef.markForCheck());

    // Avoids focus being lost if the panel contained the focused element and was closed.
    panel.closed
      .pipe(filter(() => panel.containsFocus()))
      .subscribe(() => _focusMonitor.focusVia(_element.nativeElement, 'program'));

    _focusMonitor.monitor(_element.nativeElement).subscribe(origin => {
      if (origin && panel.accordion) {
        panel.accordion.handleHeaderFocus(this);
      }
    });
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
  toggle(): void {
    this.panel.toggle();
  }

  /** Gets whether the panel is expanded. */
  @HostBinding('attr.aria-expanded')
  @HostBinding('class.sbb-expanded')
  get isExpanded(): boolean {
    return this.panel.expanded;
  }

  /** Gets the expanded state string of the panel. */
  getExpandedState(): string {
    return this.panel.getExpandedState();
  }

  /** Gets the panel id. */
  @HostBinding('attr.aria-controls')
  get getPanelId(): string {
    return this.panel.id;
  }
  /**
   * Class property that identifies a header panel without toggle.
   */
  @HostBinding('class.sbb-no-toggle')
  get hasNoToggle(): boolean {
    return !this.showToggle();
  }

  /** Gets whether the expand indicator should be shown. */
  showToggle(): boolean {
    return !this.panel.hideToggle && !this.panel.disabled;
  }

  /** Handle keydown event calling to toggle() if appropriate. */
  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    switch (event.keyCode) {
      // Toggle for space and enter keys.
      case SPACE:
      case ENTER:
        event.preventDefault();
        this.toggle();
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
}
