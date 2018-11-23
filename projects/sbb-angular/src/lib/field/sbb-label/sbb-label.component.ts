import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-label',
  templateUrl: './sbb-label.component.html',
  styleUrls: ['./sbb-label.component.scss']
})
export class SbbLabelComponent {
  /**
   * Label of a input text
   */
  @Input() for?: string;
}
