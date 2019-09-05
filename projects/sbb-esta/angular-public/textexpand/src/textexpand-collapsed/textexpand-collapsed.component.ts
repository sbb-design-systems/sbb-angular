import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-textexpand-collapsed',
  templateUrl: './textexpand-collapsed.component.html',
  styleUrls: ['./textexpand-collapsed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextexpandCollapsedComponent {
  /**
   * Describes if textexpand-collapsed is hidden or not. Initially it isn't hidden.
   */
  @HostBinding('hidden')
  isHidden = false;

  /**
   * Css class of the textexpand-collapsed component.
   */
  @HostBinding('class.sbb-textexpand-collapsed') cssClass = true;
}
