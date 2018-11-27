import {
  Component,
  Input,
  HostBinding,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges } from '@angular/core';

@Component({
  selector: 'sbb-field',
  templateUrl: './sbb-field.component.html',
  styleUrls: ['./sbb-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbFieldComponent implements OnInit, OnChanges {
  /**
   * Class property to verify if a label exists
   */
  @Input() label?: string;
  /**
   * Label of a input text
   */
  @Input() for?: string;
  /**
  * mode set the length of the input field
  */
  @Input() mode: 'default' | 'short' | 'medium' | 'long' = 'default';
  /**
   * Take css classes as input from the consumer
   */
  @Input() class = '';
  /**
   * Sets css classes for field mode
   */
  @HostBinding('class') fieldModeClass: string;

  ngOnInit() {
    this.fieldModeClass = `${this.class} sbb-input-field-${this.mode}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode.currentValue !== changes.mode.previousValue) {
      this.fieldModeClass = `${this.class} sbb-input-field-${this.mode}`;
    }
  }
}
