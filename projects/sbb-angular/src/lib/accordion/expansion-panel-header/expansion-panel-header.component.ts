import { FocusMonitor, FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  OnDestroy,
  ViewEncapsulation,
  HostBinding,
  HostListener,
} from '@angular/core';
import { merge, Subscription, EMPTY } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';


/**
 * `<sbb-expansion-panel-header>`
 *
 * This component corresponds to the header element of an `<sbb-expansion-panel>`.
 */
@Component({
  selector: 'sbb-expansion-panel-header',
  styleUrls: ['./expansion-panel-header.component.scss'],
  templateUrl: './expansion-panel-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelHeaderComponent implements OnDestroy, FocusableOption {

  @HostBinding('class.sbb-expansion-panel-header')
  panelHeaderClass = true;

  @HostBinding('attr.role')
  panelHeaderRole = 'button';

  @HostBinding('attr.id')
  panelHeaderAttrId: string = this.panel.headerId;

  @HostBinding('attr.tabindex')
  get tabIndex() { return this.disabled ? '-1' : '0'; }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled() { return this.panel.disabled; }

  private _parentChangeSubscription = Subscription.EMPTY;

  constructor(
    @Host() public panel: ExpansionPanelComponent,
    private _element: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef) {

    const accordionHideToggleChange = panel.accordion ?
      panel.accordion._stateChanges.pipe(filter(changes => !!changes.hideToggle)) : EMPTY;

    // Since the toggle state depends on an @Input on the panel, we
    // need to subscribe and trigger change detection manually.
    this._parentChangeSubscription = merge(
      panel.opened,
      panel.closed,
      accordionHideToggleChange,
      panel._inputChanges.pipe(filter(changes => !!(changes.hideToggle || changes.disabled)))
    )
      .subscribe(() => this._changeDetectorRef.markForCheck());

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
