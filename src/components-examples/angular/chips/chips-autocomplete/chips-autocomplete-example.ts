import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/**
 * @title Chips Autocomplete
 * @order 4
 */
@Component({
  selector: 'sbb-chips-autocomplete-example',
  templateUrl: 'chips-autocomplete-example.html',
})
export class ChipsAutocompleteExample {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedFruits = new FormControl(['Lemon']);
  allFruits = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  // FruitInputCtrl is only used to track value changes in order to update autocomplete list
  fruitInputCtrl = new FormControl();
  filteredFruits: Observable<string[]> = this.fruitInputCtrl.valueChanges.pipe(
    startWith(null),
    map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
  );

  private _filter(value: string): string[] {
    return this.allFruits.filter((fruit) => fruit.toUpperCase().indexOf(value.toUpperCase()) === 0);
  }
}
