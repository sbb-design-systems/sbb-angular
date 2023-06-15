import { Component } from '@angular/core';
import { SbbStatusModule } from '@sbb-esta/angular/status';

/**
 * @title Status With Message
 * @order 20
 */
@Component({
  selector: 'sbb-status-with-message-example',
  templateUrl: 'status-with-message-example.html',
  standalone: true,
  imports: [SbbStatusModule],
})
export class StatusWithMessageExample {}
