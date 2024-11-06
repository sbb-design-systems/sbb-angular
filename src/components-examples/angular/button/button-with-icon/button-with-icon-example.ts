import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';

/**
 * @title Button With Icon Example
 * @order 20
 */
@Component({
  selector: 'sbb-button-with-icon-example',
  templateUrl: 'button-with-icon-example.html',
  styleUrls: ['button-with-icon-example.css'],
  imports: [SbbButtonModule, SbbIconModule],
})
export class ButtonWithIconExample {}
