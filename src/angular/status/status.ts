import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';

@Component({
  selector: 'sbb-status',
  templateUrl: './status.html',
  styleUrls: ['./status.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-status',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  standalone: true,
  imports: [NgClass, SbbIcon],
})
export class SbbStatus {
  /** The optional icon type, which can be valid, warning or invalid. */
  @Input() type: 'valid' | 'warning' | 'invalid';
  /** Set the status message shown on the right side. */
  @Input() message: string;
  /** Used to set the 'aria-label' attribute on the underlying icon element. */
  @Input('aria-label') ariaLabel: string = '';
  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  @Input('aria-labelledby') ariaLabelledby: string | null = null;
  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  @Input('aria-describedby') ariaDescribedby: string | null = null;

  /** @docs-private */
  get _iconClass() {
    return this.type ? { [`sbb-status-icon-${this.type}`]: true } : {};
  }
}
