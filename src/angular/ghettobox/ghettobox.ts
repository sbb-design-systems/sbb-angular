import { AnimationEvent } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { sbbGhettoboxAnimations } from './ghettobox-animations';

/** Ghettobox states used for the animation */
export type SbbGhettoboxState = 'visible' | 'removed';

/** Ghettobox deleted custom event  */
export interface SbbGhettoboxEvent {
  ghettobox: SbbGhettobox;
}

let nextId = 0;

@Component({
  selector: 'sbb-ghettobox, a[sbbGhettobox]',
  templateUrl: './ghettobox.html',
  styleUrls: ['./ghettobox.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [sbbGhettoboxAnimations.addRemove],
  host: {
    class: 'sbb-ghettobox',
    tabindex: '0',
    '[id]': 'id',
    '[attr.hidden]': '_closed ? true : null',
    '[attr.aria-hidden]': '_closed ? true : null',
    '[attr.role]': '!_closed ? "alert" : null',
    '[class.sbb-ghettobox-link]': '_isNativeLink',
    '[@addDelete]': '_animationState',
  },
})
export class SbbGhettobox {
  /** The id of this element. */
  @Input() id: string = `sbb-ghettobox-${nextId++}`;

  /** The animaation state of this ghettobox. */
  _animationState: SbbGhettoboxState = 'visible';

  /** Whether this ghettobox is closed. */
  _closed: boolean = false;

  /** Set to true, if the host element is an <a> element. */
  _isNativeLink: boolean = false;

  /** Emitted when a ghettobox is to be removed. */
  @Output() readonly removed: EventEmitter<SbbGhettoboxEvent> =
    new EventEmitter<SbbGhettoboxEvent>();

  /**
   * The indicator icon, which will be shown before the content.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. indicatorIcon="kom:plus-small"
   */
  @Input() indicatorIcon: string = 'fpl:info';

  constructor(private _changeDetector: ChangeDetectorRef, elementRef: ElementRef<HTMLElement>) {
    if (elementRef.nativeElement.nodeName.toLowerCase() === 'a') {
      this._isNativeLink = true;
    }
  }

  /** Remove this ghettobox. */
  remove(): void {
    this._animationState = 'removed';
  }

  /** Handles the click on the close button. */
  _handleClose(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.remove();
  }

  /** @docs-private */
  @HostListener('@addDelete.done', ['$event'])
  _handleAnimation(event: AnimationEvent) {
    const { phaseName, toState } = event;

    if (phaseName === 'done' && toState === 'removed') {
      this._closed = true;
      this._changeDetector.markForCheck();
      this.removed.next({ ghettobox: this });
    }
  }
}
