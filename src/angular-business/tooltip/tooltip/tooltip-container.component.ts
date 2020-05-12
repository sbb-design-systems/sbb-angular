import { AnimationEvent } from '@angular/animations';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { sbbTooltipAnimations } from './tooltip-animations';

/** Possible visibility states of a tooltip. */
export type TooltipVisibility = 'initial' | 'visible' | 'hidden';

/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
@Component({
  selector: 'sbb-tooltip-container',
  templateUrl: './tooltip-container.component.html',
  styleUrls: ['./tooltip.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sbbTooltipAnimations.tooltipState]
})
export class TooltipContainerComponent implements OnDestroy {
  /**
   * @docs-private
   */
  @HostBinding('attr.aria-hidden') ariaHidden = true;

  /**
   * Forces the element to have a layout in IE and Edge. This fixes issues where the element
   * won't be rendered if the animations are disabled or there is no web animations polyfill.
   * @docs-private
   */
  @HostBinding('style.zoom')
  get styleZoom(): number | null {
    return this._visibility === 'visible' ? 1 : null;
  }

  /** Current connectionPositionPair of overlayRef */
  _connectionPositionPair: ConnectionPositionPair;

  /** Message to display in the tooltip */
  message: string;

  /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
  tooltipClass: string | string[] | Set<string> | { [key: string]: any };

  /** The timeout ID of any current timer set to show the tooltip */
  _showTimeoutId: any;

  /** The timeout ID of any current timer set to hide the tooltip */
  _hideTimeoutId: any;

  /** Property watched by the animation framework to show or hide the tooltip */
  _visibility: TooltipVisibility = 'initial';

  /** Whether interactions on the page should close the tooltip */
  private _closeOnInteraction: boolean = false;

  /** Subject for notifying that the tooltip has been hidden from the view */
  private readonly _onHide: Subject<any> = new Subject();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Shows the tooltip with an animation originating from the provided origin
   * @param delay Amount of milliseconds to the delay showing the tooltip.
   */
  show(delay: number): void {
    // Cancel the delayed hide if it is scheduled
    if (this._hideTimeoutId) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = null;
    }

    // Body interactions should cancel the tooltip if there is a delay in showing.
    this._closeOnInteraction = true;
    this._showTimeoutId = setTimeout(() => {
      this._visibility = 'visible';
      this._showTimeoutId = null;

      // Mark for check so if any parent component has set the
      // ChangeDetectionStrategy to OnPush it will be checked anyways
      this._markForCheck();
    }, delay);
  }

  /**
   * Begins the animation to hide the tooltip after the provided delay in ms.
   * @param delay Amount of milliseconds to delay showing the tooltip.
   */
  hide(delay: number): void {
    // Cancel the delayed show if it is scheduled
    if (this._showTimeoutId) {
      clearTimeout(this._showTimeoutId);
      this._showTimeoutId = null;
    }

    this._hideTimeoutId = setTimeout(() => {
      this._visibility = 'hidden';
      this._hideTimeoutId = null;

      // Mark for check so if any parent component has set the
      // ChangeDetectionStrategy to OnPush it will be checked anyways
      this._markForCheck();
    }, delay);
  }

  /** Returns an observable that notifies when the tooltip has been hidden from view. */
  afterHidden(): Observable<void> {
    return this._onHide.asObservable();
  }

  /** Whether the tooltip is being displayed. */
  isVisible(): boolean {
    return this._visibility === 'visible';
  }

  ngOnDestroy() {
    this._onHide.complete();
  }

  _animationStart() {
    this._closeOnInteraction = false;
  }

  _animationDone(event: AnimationEvent): void {
    const toState = event.toState as TooltipVisibility;

    if (toState === 'hidden' && !this.isVisible()) {
      this._onHide.next();
    }

    if (toState === 'visible' || toState === 'hidden') {
      this._closeOnInteraction = true;
    }
  }

  /**
   * Interactions on the HTML body should close the tooltip immediately
   */
  @HostListener('body:click')
  _handleBodyInteraction(): void {
    if (this._closeOnInteraction) {
      this.hide(0);
    }
  }

  /**
   * Marks that the tooltip needs to be checked in the next change detection run.
   * Mainly used for rendering the initial text before positioning a tooltip, which
   * can be problematic in components with OnPush change detection.
   */
  _markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }
}
