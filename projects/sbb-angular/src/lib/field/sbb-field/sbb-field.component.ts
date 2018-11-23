import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-field',
  templateUrl: './sbb-field.component.html',
  styleUrls: ['./sbb-field.component.scss']
})
export class SbbFieldComponent {
  /**
   * Class property to verify if a label exists
   */
  @Input() label?: string;
  /**
   * Label of a input text
   */
  @Input() for?: string;
}
