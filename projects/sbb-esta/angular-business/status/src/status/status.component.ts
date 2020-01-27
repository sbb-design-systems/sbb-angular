import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  public readonly validType = 'valid';
  public readonly warningType = 'warning';
  public readonly invalidType = 'invalid';

  /**
   * Set the status message shown on the right side.
   */
  @Input() message: string;

  /**
   * If the type is set the icon of this status is shown
   */
  @Input() type: string;

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
