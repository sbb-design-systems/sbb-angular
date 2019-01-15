import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-textexpand-collapsed',
  templateUrl: './textexpand-collapsed.component.html',
  styleUrls: ['./textexpand-collapsed.component.scss']
})
export class TextexpandCollapsedComponent  {
  @HostBinding('hidden')
  visible = false;
}
