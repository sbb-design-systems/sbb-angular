import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Basic Inputs
 * @order 10
 */
@Component({
  selector: 'sbb-input-overview-example',
  styleUrls: ['input-overview-example.css'],
  templateUrl: 'input-overview-example.html',
  imports: [FormsModule, SbbFormFieldModule, SbbInputModule],
})
export class InputOverviewExample {}
