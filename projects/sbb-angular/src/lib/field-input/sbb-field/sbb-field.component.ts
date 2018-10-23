import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-field',
  templateUrl: './sbb-field.component.html',
  styleUrls: ['./sbb-field.component.scss']
})
export class SbbFieldComponent {

  @Input() label?: string;
  @Input() for?: string;

  constructor() { }
}
