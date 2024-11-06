import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

/**
 * @title Button Overview Example
 * @order 10
 */
@Component({
  selector: 'sbb-button-overview-example',
  templateUrl: 'button-overview-example.html',
  imports: [SbbButtonModule, SbbCheckboxModule, FormsModule],
})
export class ButtonOverviewExample {
  disabled = false;
}
