import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-button-example',
  templateUrl: './button-example.component.html'
})
export class ButtonExampleComponent {
  buttonForm = new FormGroup({
    mode: new FormControl('primary'),
    disabled: new FormControl(false)
  });

  modes = ['primary', 'secondary', 'ghost', 'alternative', 'icon'];
}
