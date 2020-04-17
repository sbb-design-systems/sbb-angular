import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-textexpand-expanded',
  templateUrl: './textexpand-expanded.component.html',
  styleUrls: ['./textexpand-expanded.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextexpandExpandedComponent {
  /**
   * Describes if textexpand-expanded is hidden or not. Initially it is hidden.
   */
  @HostBinding('hidden')
  isHidden = true;

  /**
   * Css class of the textexpand-expanded component.
   */
  @HostBinding('class.sbb-textexpand-expanded') cssClass = true;
}
