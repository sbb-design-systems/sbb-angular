import { Component,  OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-autocomplete-showcase',
  templateUrl: './autocomplete-showcase.component.html',
  styleUrls: ['./autocomplete-showcase.component.scss']
})
export class AutocompleteShowcaseComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filter: '';

  ngOnInit() {
    this.myControl.valueChanges.subscribe((newValue) => {
      this.filter = newValue;
    });
  }
}
