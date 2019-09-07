import { Directive } from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';

/**
 * @deprecated Use sbbIcon instead
 */
// tslint:disable-next-line:directive-selector
@Directive({
  selector: '[sbbNotificationIcon]',
  providers: [{ provide: IconDirective, useExisting: NotificationIconDirective }]
})
export class NotificationIconDirective {}
