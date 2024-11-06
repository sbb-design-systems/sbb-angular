import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbRadioButtonPanelModule } from '@sbb-esta/angular/radio-button-panel';

/**
 * @title Simple Radio Button Panel
 * @order 10
 */
@Component({
  selector: 'sbb-radio-button-panel-simple-example',
  templateUrl: 'radio-button-panel-simple-example.html',
  imports: [
    SbbRadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbRadioButtonPanelModule,
    JsonPipe,
  ],
})
export class RadioButtonPanelSimpleExample {
  value = new FormControl('');
}
