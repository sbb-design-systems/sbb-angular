import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbToggleModule } from '@sbb-esta/angular/toggle';

/**
 * @title Toggle Triple
 * @order 40
 */
@Component({
  selector: 'sbb-toggle-triple-example',
  templateUrl: 'toggle-triple-example.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [SbbToggleModule, FormsModule, ReactiveFormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleTripleExample {
  journey = new FormControl('option1');
}
