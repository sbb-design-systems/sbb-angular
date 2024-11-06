import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Inputs in a form
 * @order 30
 */
@Component({
  selector: 'sbb-input-form-example',
  templateUrl: 'input-form-example.html',
  styleUrls: ['input-form-example.css'],
  imports: [FormsModule, SbbFormFieldModule, SbbInputModule],
})
export class InputFormExample {}
