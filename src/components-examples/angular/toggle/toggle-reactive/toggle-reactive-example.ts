import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbToggleModule } from '@sbb-esta/angular/toggle';

/**
 * @title Toggle Reactive
 * @order 10
 */
@Component({
  selector: 'sbb-toggle-reactive-example',
  templateUrl: 'toggle-reactive-example.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    SbbToggleModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbFormFieldModule,
    SbbDatepickerModule,
    SbbInputModule,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleReactiveExample {
  journey = new FormControl('ReturnJourney');
}
