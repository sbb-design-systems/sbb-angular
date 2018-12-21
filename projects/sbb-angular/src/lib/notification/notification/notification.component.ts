import { Component, OnInit, HostBinding, Input, TemplateRef, ContentChild } from '@angular/core';
import { NotificationIconDirective } from '../notification-icon.directive';

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

  @Input()
  @ContentChild(NotificationIconDirective, { read: TemplateRef })
  icon: TemplateRef<any>;

  @Input() message: string;

  @Input() jumpMarks?: JumpMark[];

  @HostBinding('class.sbb-notification-has-jump-marks')
  get hasJumpMarks() {
    return this.jumpMarks && this.jumpMarks.length;
  }
}
