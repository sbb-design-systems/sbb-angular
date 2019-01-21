import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-textexpand-expanded',
  templateUrl: './textexpand-expanded.component.html',
  styleUrls: ['./textexpand-expanded.component.scss']
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
  @HostBinding('class') cssClass = 'sbb-textexpand-expanded';

}
