import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'sbb-autocomplete-option-group-example',
  templateUrl: './autocomplete-option-group-example.component.html',
})
export class AutocompleteOptionGroupExampleComponent implements OnInit {
  myControlStatic = new FormControl('one');

  options: Observable<string[]>;

  staticOptions: string[] = ['static option one', 'static option two'];

  ngOnInit() {
    this.options = this.myControlStatic.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((newValue) =>
        newValue.length <= 2
          ? []
          : options.filter(
              (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
            )
      )
    );
  }
}

const options: string[] = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty ',
  'twenty one',
  'twenty two',
  'twenty three',
  'twenty four',
  'twenty five',
  'twenty six',
  'twenty seven',
  'twenty eight',
  'twenty nine',
  'thirty ',
  'thirty one',
  'thirty two',
  'thirty three',
  'thirty four',
  'thirty five',
  'thirty six',
  'thirty seven',
  'thirty eight',
  'thirty nine',
  'forty ',
  'forty one',
  'forty two',
  'forty three',
  'forty four',
  'forty five',
  'forty six',
  'forty seven',
  'forty eight',
  'forty nine',
];
