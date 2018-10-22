import { Component, OnInit } from '@angular/core';
import { ShowcaseOption } from './showcase-option.model';

@Component({
  selector: 'sbb-autocomplete-showcase',
  templateUrl: './autocomplete-showcase.component.html',
  styleUrls: ['./autocomplete-showcase.component.scss']
})
export class AutocompleteShowcaseComponent {

  optionList: Array<ShowcaseOption> = [];
  staticOptions: Array<ShowcaseOption> = [
    new ShowcaseOption('static test 1', 'test1')
  ];
  testValue = 'Te';

  constructor() {
    this.optionList.push(new ShowcaseOption('Test 1', 'test1'));
    this.optionList.push(new ShowcaseOption('Test 2', 'test2'));
    this.optionList.push(new ShowcaseOption('Test 3', 'test3'));
    this.optionList.push(new ShowcaseOption('Test 4', 'test4'));
    this.optionList.push(new ShowcaseOption('Test 5', 'test5'));
  }

}
