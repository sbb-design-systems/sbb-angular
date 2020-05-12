import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-button-example',
  templateUrl: './button-example.component.html',
})
export class ButtonExampleComponent {
  buttonForm = new FormGroup({
    mode: new FormControl('primary'),
    icon: new FormControl('arrow'),
    disabled: new FormControl(false),
  });

  icons = ['arrow', 'plus', 'download'];

  modes = ['primary', 'secondary', 'ghost', 'frameless'];
}
