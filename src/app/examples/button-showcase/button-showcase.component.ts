import { Component, OnInit, Type } from '@angular/core';
import { IconDownloadComponent } from 'sbb-angular';

@Component({
  selector: 'sbb-button-showcase',
  templateUrl: './button-showcase.component.html',
  styleUrls: ['./button-showcase.component.scss'],
  entryComponents: [IconDownloadComponent]
})
export class ButtonShowcaseComponent implements OnInit {

  icoDownload: Type<{}> = IconDownloadComponent;

  constructor() { }

  ngOnInit() {
  }

}
