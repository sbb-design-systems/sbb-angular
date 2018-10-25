import { Component, ChangeDetectorRef } from '@angular/core';
import { ShowcaseOption } from './showcase-option.model';
import { Subject, Observable, from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

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
  filteredList: ShowcaseOption[];

  search$: Subject<string>;
  asyncFilteredList: ShowcaseOption[];

  constructor(private changeDetectionRef: ChangeDetectorRef) {
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
    this.filteredList = new Array().concat(this.optionList);
    this.asyncFilteredList = this.optionList;

  }


  private filterByText(inputedText: string) {
    return this.optionList.filter((value) => {
      return value.getLabel().toLocaleLowerCase().indexOf(inputedText.toLocaleLowerCase()) > -1;
    });
  }

  filterSync(inputedText: string) {
    this.filteredList = this.filterByText(inputedText);
  }

  filterAsync(inputedText: string) {
    this.asyncFilteredList = [];
    if (!this.search$) {
      this.search$ = new Subject<string>();
      this.search$.pipe(debounceTime(500))
        .pipe(distinctUntilChanged())
        .pipe(switchMap(searchTerm => this.filterByText(searchTerm)))
        .subscribe(result => {
          this.asyncFilteredList.push(result);
        });
    }
    this.search$.next(inputedText);
  }

}
