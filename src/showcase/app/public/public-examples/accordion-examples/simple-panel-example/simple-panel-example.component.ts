import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-simple-panel-example',
  templateUrl: './simple-panel-example.component.html',
})
export class SimplePanelExampleComponent {
  panelMode = 'panel 1';
  panels = ['panel 1', 'panel 2', 'panel 3', 'panel 4', 'panel 5'];
  accordionForm: FormGroup;

  radioOptions = [
    {
      name: 'Open all',
      value: 'openAll',
    },
    {
      name: 'Close all',
      value: 'closeAll',
    },
  ];

  constructor() {
    this.accordionForm = new FormGroup({
      panelMode: new FormControl(this.panelMode),
    });
  }
}
