import { Component, OnInit, Type } from '@angular/core';
import { IconPlusComponent, IconArrowDownComponent } from 'sbb-angular';

@Component({
  selector: 'sbb-button-showcase',
  templateUrl: './button-showcase.component.html',
  styleUrls: ['./button-showcase.component.scss'],
  entryComponents: [IconPlusComponent, IconArrowDownComponent]
})
export class ButtonShowcaseComponent implements OnInit {

  icoPlus: Type<{}> = IconPlusComponent;
  icoArrowDown: Type<{}> = IconArrowDownComponent;

  constructor() { }

  ngOnInit() {
  }

}
