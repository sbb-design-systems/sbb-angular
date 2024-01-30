import { AnimationEvent } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { mixinVariant } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { sbbNotificationAnimations } from './notification-animations';
import { SbbNotificationIcon } from './notification-directives';

export interface SbbJumpMark {
  /** Title of an element in jump marks. */
  title: string;
  /** Identifier of an element in jump marks. */
  elementId?: string;
  /** Callback to be called on click on the jump mark. */
  callback?: (event$: any, jumpMark: SbbJumpMark) => void;
}

/** The supported types of notifications. */
export type SbbNotificationType = 'success' | 'info' | 'info-light' | 'warn' | 'error';

/** Notification event.  */
export interface SbbNotificationEvent {
  notification: SbbNotification;
}

// Boilerplate for applying mixins to SbbNotification.
// tslint:disable-next-line: naming-convention
const _SbbNotificationMixinBase = mixinVariant(class {});

let nextId = 0;

@Component({
  selector: 'sbb-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sbbNotificationAnimations.showDismiss],
  host: {
    class: 'sbb-notification',
    '[class.sbb-notification-success]': `type === 'success'`,
    '[class.sbb-notification-info]': `type === 'info'`,
    '[class.sbb-notification-info-light]': `type === 'info-light'`,
    '[class.sbb-notification-error]': `type === 'error'`,
    '[class.sbb-notification-warn]': `type === 'warn'`,
    '[class.sbb-notification-has-jump-marks]': 'jumpMarks && jumpMarks.length',
    '[id]': 'id',
    '[attr.hidden]': '_closed ? true : null',
    '[attr.aria-hidden]': '_closed ? true : null',
    '[@showDismiss]': '_animationState',
  },
  standalone: true,
  imports: [SbbIcon, AsyncPipe],
})
export class SbbNotification extends _SbbNotificationMixinBase implements OnChanges {
  /** Whether this notification is closed. */
  _closed: boolean = false;

  /** The animation state of this notification. */
  _animationState: 'visible' | 'dismissed' = 'visible';

  /** The id of this element. */
  @Input() id: string = `sbb-notification-${nextId++}`;

  /**
   * Type of notification.
   * In standard design, the types 'warn' and 'error' are equal.
   */
  @Input() type: SbbNotificationType = 'success';

  /**
   * Whether the notification is closable.
   * This only work for lean design, as with standard it is always readonly.
   */
  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _readonly = false;

  /**
   * The icon to be used for the notification.
   * Must be a valid svgIcon input for sbb-icon.
   */
  @Input() svgIcon: string | null;

  /** List of in page links displayed on the bottom of the notification */
  @Input() jumpMarks?: SbbJumpMark[];

  /** Observable which emits when the notification was closed */
  @Output() readonly dismissed: EventEmitter<SbbNotificationEvent> = new EventEmitter();

  /** Provided icon directive, if available. */
  @ContentChild(SbbNotificationIcon, { static: true }) _notificationIcon?: SbbNotificationIcon;

  /** An observable of the current icon. */
  _svgIcon: Observable<string>;

  /** Subject for the current indicator icon. */
  private _svgIconSubject = new BehaviorSubject<string | null>(null);

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    super();
    this._svgIcon = combineLatest([this.variant, this._svgIconSubject]).pipe(
      map(([variant, icon]) => {
        if (icon) {
          return icon;
        } else if (this.type === 'success') {
          return 'tick-small';
        } else if (this.type === 'error') {
          return variant === 'standard' ? 'sign-exclamation-point-small' : 'sign-x-small';
        } else if (this.type === 'warn') {
          return 'sign-exclamation-point-small';
        } else {
          return 'circle-information-small';
        }
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.svgIcon && changes.svgIcon.currentValue !== changes.svgIcon.previousValue) {
      this._svgIconSubject.next(this.svgIcon);
    }
  }

  /**
   * Used to scroll to an element identified by a jump mark
   */
  _scrollTo(event: MouseEvent, jumpMark: SbbJumpMark) {
    event.preventDefault();
    if (jumpMark.elementId) {
      document.querySelector(jumpMark.elementId)?.scrollIntoView({ behavior: 'smooth' });
    }
    if (jumpMark.callback) {
      jumpMark.callback(event, jumpMark);
    }
  }

  /** Close notification */
  dismiss() {
    this._animationState = 'dismissed';
  }

  /** @docs-private */
  @HostListener('@showDismiss.done', ['$event'])
  _handleAnimation(event: AnimationEvent) {
    const { phaseName, toState } = event;

    if (phaseName === 'done' && toState === 'dismissed') {
      this._closed = true;
      this._changeDetectorRef.markForCheck();
      this.dismissed.next({ notification: this });
    }
  }
}
