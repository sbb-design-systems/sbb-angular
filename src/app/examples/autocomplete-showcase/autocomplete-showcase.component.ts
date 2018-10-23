import { Component } from '@angular/core';
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
  testValue: ShowcaseOption = new ShowcaseOption('Test 2', 'test2');

  constructor() {
    this.optionList.push(new ShowcaseOption('Test 1', 'test1'));
    this.optionList.push(new ShowcaseOption('Test 2', 'test2'));
    this.optionList.push(new ShowcaseOption('Test 3', 'test3'));
    this.optionList.push(new ShowcaseOption('Test 4', 'test4'));
    this.optionList.push(new ShowcaseOption('Test 5', 'test5'));
    this.optionList.push(new ShowcaseOption('Test 6', 'test6'));
    this.optionList.push(new ShowcaseOption('Test 7', 'test7'));
    this.optionList.push(new ShowcaseOption('Test 8', 'test8'));
    this.optionList.push(new ShowcaseOption('Test 9', 'test9'));
    this.optionList.push(new ShowcaseOption('Test 10', 'test10'));
    this.optionList.push(new ShowcaseOption('Test 11', 'test11'));
    this.optionList.push(new ShowcaseOption('Test 12', 'test12'));
    this.optionList.push(new ShowcaseOption('Test 13', 'test13'));
    this.optionList.push(new ShowcaseOption('Test 14', 'test14'));
    this.optionList.push(new ShowcaseOption('Test 15', 'test15'));
    this.optionList.push(new ShowcaseOption('Test 16', 'test16'));
    this.optionList.push(new ShowcaseOption('Test 17', 'test17'));

  }


}
