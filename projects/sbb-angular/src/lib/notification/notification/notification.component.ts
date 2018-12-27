import { Component, OnInit, HostBinding, Input, TemplateRef, ContentChild, ViewChild } from '@angular/core';
import { NotificationIconDirective } from '../notification-icon.directive';
import { IconCheckComponent } from '../../svg-icons-components/campaigns/greenclass/sbb-icon-check.component';
import { IconExclamationMarkComponent } from '../../svg-icons-components/svg-icons-components';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface JumpMark {
  title: string;
  elementId: string;
}

@Component({
  selector: 'sbb-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  /** @docs-private */
  @HostBinding('class.sbb-notification')
  baseCssClass = true;


  @HostBinding('class.sbb-notification-success')
  get typeSuccess(): boolean {
    return this.type === NotificationType.SUCCESS;
  }

  @HostBinding('class.sbb-notification-error')
  get typeError(): boolean {
    return this.type === NotificationType.ERROR;
  }

  @Input()
  type = NotificationType.SUCCESS;

  @ViewChild('error',  { read: TemplateRef })
  errorIcon: TemplateRef<any>;

  @ViewChild('check',  { read: TemplateRef })
  checkIcon: TemplateRef<any>;

  /** The icon to be used into the notification left side.
   *  By default uses two icons for SUCCESS or ERROR notification type,
   *  but the user can define his own icon using the {@link NotificationIconDirective} directive.
   */
  @Input()
  @ContentChild(NotificationIconDirective, { read: TemplateRef })
  set icon(notificationIcon: TemplateRef<any>) {
    this._icon = notificationIcon;
  }
  get icon() {
    if (!this._icon) {
      return this.type === NotificationType.SUCCESS ? this.checkIcon : this.errorIcon;
    }
    return this._icon;
  }
  _icon: TemplateRef<any>;

  /** Message displayed into the notification content */
  @Input() message: string;

  /** List of in page links displayed on the bottom of the notification */
  @Input() jumpMarks?: JumpMark[];

  /** @docs-private */
  @HostBinding('class.sbb-notification-has-jump-marks')
  get hasJumpMarks() {
    return this.jumpMarks && this.jumpMarks.length;
  }
}
