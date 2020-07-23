import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';

/**
 * @deprecated use strings directly
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
}

/**
 * @deprecated use strings directly
 */
export enum NotificationToastPosition {
  TOPLEFT = 'top-left',
  TOPRIGHT = 'top-right',
  BOTTOMLEFT = 'bottom-left',
  BOTTOMRIGHT = 'bottom-right',
}

export interface JumpMark {
  /** Title of an element in jump marks. */
  title: string;
  /** Identifier of an element in jump marks. */
  elementId?: string;
  callback?: (event$: any, jumpMark: JumpMark) => void;
}

@Component({
  selector: 'sbb-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-notification sbb-icon-fit',
    '[class.sbb-notification-success]': `this.type === 'success'`,
    '[class.sbb-notification-info]': `this.type === 'info'`,
    '[class.sbb-notification-error]': `this.type === 'error'`,
    '[class.sbb-notification-warn]': `this.type === 'warn'`,
    '[class.sbb-notification-has-jump-marks]': 'this.jumpMarks && this.jumpMarks.length',
    '[class.sbb-notification-toast-top-left]': `this.toastPosition === 'top-left'`,
    '[class.sbb-notification-toast-top-right]': `this.toastPosition === 'top-right'`,
    '[class.sbb-notification-toast-bottom-left]': `this.toastPosition === 'bottom-left'`,
    '[class.sbb-notification-toast-bottom-right]': `this.toastPosition === 'bottom-right'`,
    '[attr.aria-hidden]': 'this.ariaHidden',
    '[hidden]': 'this.hidden',
  },
})
export class NotificationComponent {
  /**
   *  @docs-private
   *  @deprecated internal detail
   */
  baseCssClass = true;

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get typeSuccess(): boolean {
    return this.type === NotificationType.SUCCESS;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get typeInfo(): boolean {
    return this.type === NotificationType.INFO;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get typeError(): boolean {
    return this.type === NotificationType.ERROR;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get typeWarn(): boolean {
    return this.type === NotificationType.WARN;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get hasJumpMarks() {
    return this.jumpMarks && this.jumpMarks.length;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get positionTopLeft(): boolean {
    return this.toastPosition === NotificationToastPosition.TOPLEFT;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get positionTopRight(): boolean {
    return this.toastPosition === NotificationToastPosition.TOPRIGHT;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get positionBottomLeft(): boolean {
    return this.toastPosition === NotificationToastPosition.BOTTOMLEFT;
  }

  /**
   * @docs-private
   * @deprecated internal detail
   */
  get positionBottomRight(): boolean {
    return this.toastPosition === NotificationToastPosition.BOTTOMRIGHT;
  }

  ariaHidden: 'false' | 'true';

  get hidden() {
    return this.ariaHidden === 'true';
  }

  /** Type of notification. */
  @Input()
  type: 'success' | 'info' | 'error' | 'warn' = 'success';

  /** Position of toast. */
  @Input()
  toastPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /**
   * Whether the notification is closable or not
   * Readonly true: notifications can't be closed
   * Readonly false: notifications can be closed
   */
  @Input()
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  get readonly() {
    return this._readonly;
  }

  private _readonly = false;

  /** @docs-private */
  @ViewChild('error', { read: TemplateRef, static: true })
  errorIcon: TemplateRef<any>;

  /** @docs-private */
  @ViewChild('check', { read: TemplateRef, static: true })
  checkIcon: TemplateRef<any>;

  /** @docs-private */
  @ViewChild('info', { read: TemplateRef, static: true })
  infoIcon: TemplateRef<any>;

  /**
   * The icon to be used into the notification left side.
   * By default uses three icons for SUCCESS, ERROR or INFO notification type,
   * but the user can use his own icon using the NotificationIconDirective.
   */
  @Input()
  set icon(notificationIcon: TemplateRef<any> | null) {
    this._icon = notificationIcon;
  }
  get icon() {
    if (this._contentIcon) {
      return this._contentIcon;
    } else if (this._icon) {
      return this._icon;
    }
    switch (this.type) {
      case 'success':
        return this.checkIcon;
      case 'error':
      case 'warn':
        return this.errorIcon;
      case 'info':
        return this.infoIcon;
      default:
        return null;
    }
  }
  private _icon: TemplateRef<any> | null;

  /**
   * icon placed in template
   * @docs-private
   */
  @ContentChild(IconDirective, { read: TemplateRef })
  _contentIcon: TemplateRef<any>;

  /** List of in page links displayed on the bottom of the notification */
  @Input() jumpMarks?: JumpMark[];

  /**
   * Observable which emits when the notification was closed
   */
  @Output()
  dismissed: EventEmitter<boolean> = new EventEmitter();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Used to scroll to an element identified by a jump mark
   *
   * @param $event click event
   * @param jumpMark jump mark after the notification message
   */
  scrollTo($event: any, jumpMark: JumpMark) {
    $event.preventDefault();
    if (jumpMark.elementId) {
      document.querySelector(jumpMark.elementId)?.scrollIntoView({ behavior: 'smooth' });
    }
    if (jumpMark.callback) {
      jumpMark.callback($event, jumpMark);
    }
  }

  /**
   * Close notification
   */
  dismiss() {
    this.ariaHidden = 'true';
    this.dismissed.emit(false);
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_readonly: BooleanInput;
  // tslint:enable: member-ordering
}
