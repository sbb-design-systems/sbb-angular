import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  /**
   * Set the status message shown on the right side.
   */
  @Input() message: string;

  /**
   * Set the status tooltip text. If the text is set then the tooltip appears on hover.
   */
  @Input() tooltipText: string;
}
