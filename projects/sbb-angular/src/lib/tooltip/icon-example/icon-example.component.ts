import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-icon-example',
  templateUrl: './icon-example.component.html',
  styleUrls: ['./icon-example.component.scss']
})
export class IconExampleComponent implements OnInit {

  @HostBinding('class') cssClass = 'sbb-icon-example';

  constructor() { }

  ngOnInit() {
  }

}
