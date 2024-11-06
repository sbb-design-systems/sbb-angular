import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbToggleModule } from '@sbb-esta/angular/toggle';

/**
 * @title Toggle Template Driven
 * @order 20
 */
@Component({
  selector: 'sbb-toggle-template-driven-example',
  templateUrl: 'toggle-template-driven-example.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SbbToggleModule,
    FormsModule,
    SbbIconModule,
    SbbFormFieldModule,
    SbbDatepickerModule,
    SbbInputModule,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleTemplateDrivenExample {
  model = 'SingleJourney';
}
