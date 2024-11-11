import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbIconModule } from '@sbb-esta/angular/icon';

/**
 * @title Icon Button Example
 * @order 50
 */
@Component({
  selector: 'sbb-icon-button-example',
  templateUrl: 'icon-button-example.html',
  imports: [SbbButtonModule, SbbIconModule, SbbCheckboxModule, FormsModule],
})
export class IconButtonExample {
  disabled = false;
}
