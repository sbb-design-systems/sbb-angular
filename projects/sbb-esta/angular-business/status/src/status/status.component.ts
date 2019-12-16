import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StatusType } from './status-type.enum';

@Component({
  selector: 'sbb-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  public readonly validType = StatusType.VALID;
  public readonly warningType = StatusType.WARNING;
  public readonly invalidType = StatusType.INVALID;

  /**
   * Set the status message shown on the right side.
   */
  @Input() message: string;

  /**
   * If the type is set the icon of this status is shown
   */
  @Input() type: StatusType;

  /**
   * Set the status tooltip text. If the text is set then the tooltip appears on hover.
   */
  @Input() tooltipText: string;

  /**
   * Set the status tooltip open delay in milliseconds.
   */
  @Input()
  public tooltipOpenDelay: number;

  /**
   * Set the status tooltip close delay in milliseconds.
   */
  @Input()
  public tooltipCloseDelay: number;

  /**
   * Returns true if an existing type is set.
   */
  public hasType(): boolean {
    return (
      this.type &&
      (this.type === this.validType ||
        this.type === this.warningType ||
        this.type === this.invalidType)
    );
  }
}
