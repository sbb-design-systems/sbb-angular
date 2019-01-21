import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-textexpand-expanded',
  templateUrl: './textexpand-expanded.component.html',
  styleUrls: ['./textexpand-expanded.component.scss']
})
export class TextexpandExpandedComponent {
  @HostBinding('hidden')
  visible = true;

  @HostBinding('class') cssClass = 'sbb-textexpand-expanded';

}
