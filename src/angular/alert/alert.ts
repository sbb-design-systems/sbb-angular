// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { AnimationEvent } from '@angular/animations';
import { _IdGenerator } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { sbbAlertAnimations } from './alert-animations';

/** Alert states used for the animation */
export type SbbAlertState = 'visible' | 'dismissed';

/** Alert deleted custom event  */
export interface SbbAlertEvent {
  alert: SbbAlert;
}

@Component({
  selector: 'sbb-alert, a[sbbAlert]',
  templateUrl: './alert.html',
  styleUrls: ['./alert.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [sbbAlertAnimations.showDismiss],
  host: {
    class: 'sbb-alert',
    '[id]': 'id',
    '[attr.hidden]': '_closed ? true : null',
    '[attr.aria-hidden]': '_closed ? true : null',
    '[attr.role]': '!_closed ? "alert" : null',
    '[class.sbb-alert-link]': '_isNativeLink',
    '[@showDismiss]': '_animationState',
  },
  imports: [SbbIconModule],
})
export class SbbAlert {
  private _changeDetector = inject(ChangeDetectorRef);

  _labelClose: string = $localize`:Hidden button label to close the alert@@sbbAlertCloseAlert:Close message`;

  /** The id of this element. */
  @Input() id: string = inject(_IdGenerator).getId('sbb-alert-');

  /** The animation state of this alert. */
  _animationState: SbbAlertState = 'visible';

  /** Whether this alert is closed. */
  _closed: boolean = false;

  /** Set to true, if the host element is an <a> element. */
  _isNativeLink: boolean = false;

  /** Emitted when a alert is to be dismissed. */
  @Output() readonly dismissed: EventEmitter<SbbAlertEvent> = new EventEmitter<SbbAlertEvent>();

  /**
   * The indicator icon, which will be shown before the content.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="plus-small"
   */
  @Input() svgIcon: string = 'info';

  constructor(...args: unknown[]);
  constructor() {
    const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    if (elementRef.nativeElement.nodeName.toLowerCase() === 'a') {
      this._isNativeLink = true;
    }
  }

  /** Dismiss this alert. */
  dismiss(): void {
    this._animationState = 'dismissed';
  }

  /** Handles the click on the close button. */
  _handleDismiss(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dismiss();
  }

  @HostListener('@showDismiss.done', ['$event'])
  _handleAnimation(event: AnimationEvent) {
    const { phaseName, toState } = event;

    if (phaseName === 'done' && toState === 'dismissed') {
      this._closed = true;
      this._changeDetector.markForCheck();
      this.dismissed.next({ alert: this });
    }
  }
}
