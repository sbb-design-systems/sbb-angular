import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-autocomplete-showcase',
  templateUrl: './autocomplete-showcase.component.html',
  styleUrls: ['./autocomplete-showcase.component.scss']
})
export class AutocompleteShowcaseComponent {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

}
