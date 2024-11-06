import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Textarea Native
 * @order 30
 */
@Component({
  selector: 'sbb-textarea-native-example',
  templateUrl: 'textarea-native-example.html',
  imports: [SbbFormFieldModule, SbbInputModule, FormsModule, JsonPipe],
})
export class TextareaNativeExample {
  textarea: string = 'SBB';
}
