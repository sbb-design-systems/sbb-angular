import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sbb-label',
  templateUrl: './sbb-label.component.html',
  styleUrls: ['./sbb-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SbbLabelComponent {
  /**
   * Label of a input text
   */
  @Input() for?: string;
}
