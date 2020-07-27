import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NotificationSimpleConfig } from './notification-simple-config';
import { NotificationSimpleRef } from './notification-simple-ref';
import { NOTIFICATION_CONFIG } from './notification-simple.service';

@Component({
  selector: 'sbb-notification-simple',
  templateUrl: './notification-simple.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSimpleComponent {
  /** @docs-private */
  @ViewChild('error', { read: TemplateRef, static: true })
  errorIcon: TemplateRef<any>;

  /** @docs-private */
  @ViewChild('check', { read: TemplateRef, static: true })
  checkIcon: TemplateRef<any>;

  /** @docs-private */
  @ViewChild('info', { read: TemplateRef, static: true })
  infoIcon: TemplateRef<any>;

  @Input()
  set icon(notificationIcon: TemplateRef<any> | null) {
    this._icon = notificationIcon;
  }

  get icon(): TemplateRef<any> | null {
    if (this._icon) {
      return this._icon;
    }
    switch (this.config.type) {
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

  @Output()
  dismissed: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() private _notificationRef: NotificationSimpleRef<any>,
    @Inject(NOTIFICATION_CONFIG) public config: NotificationSimpleConfig
  ) {}

  dismiss() {
    this._notificationRef.dismiss(true);
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_readonly: BooleanInput;
  // tslint:enable: member-ordering
}
