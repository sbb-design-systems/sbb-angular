import { Component } from '@angular/core';
import { SbbTimeInputModule } from '@sbb-esta/angular/time-input';

/**
 * @title Simple Time Input
 * @order 10
 */
@Component({
  selector: 'sbb-simple-time-input-example',
  templateUrl: 'simple-time-input-example.html',
  imports: [SbbTimeInputModule],
})
export class SimpleTimeInputExample {}
