import { JsonPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteSelectedEvent } from '@sbb-esta/angular/autocomplete';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbChipEvent, SbbChipInput, SbbChipInputEvent } from '@sbb-esta/angular/chips';
import { SbbChipsModule } from '@sbb-esta/angular/chips';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

export interface Fruit {
  name: string;
  color: string;
}

/**
 * @title Chips With Custom Chip Token Handlers and Autocomplete
 * @order 5
 */
@Component({
  selector: 'sbb-chips-input-custom-handler-autocomplete-example',
  templateUrl: 'chips-input-custom-handler-autocomplete-example.html',
  standalone: true,
  imports: [
    SbbFormFieldModule,
    SbbChipsModule,
    FormsModule,
    ReactiveFormsModule,
    SbbAutocompleteModule,
    SbbOptionModule,
    JsonPipe,
  ],
})
export class ChipsInputCustomHandlerAutocompleteExample {
  @ViewChild(SbbChipInput) chipInput?: SbbChipInput;

  readonly availableFruits: Fruit[] = [
    { name: 'Lemon', color: 'yellow' },
    { name: 'Lime', color: 'green' },
    { name: 'Apple', color: 'red' },
  ];
  favoriteFruits = new FormControl<Set<Fruit>>(new Set());
  get remainingFruits() {
    return this.availableFruits.filter((fruit) => !this.favoriteFruits.value!.has(fruit));
  }
  get favoriteFruitsAsArray() {
    return [...this.favoriteFruits.value!];
  }

  add(inputEvent: SbbChipInputEvent): void {
    const value = (inputEvent.value || '').trim();
    if (!value) {
      return;
    }
    const foundFruit = this.availableFruits.find(
      (fruit) => fruit.name.toUpperCase() === value.toUpperCase(),
    );
    if (!foundFruit) {
      alert('fruit not available');
      return;
    }
    this._addValueToControl(foundFruit);
  }

  addFromAutocomplete(event: SbbAutocompleteSelectedEvent): void {
    const chosenFruit = event.option.value;
    this._addValueToControl(chosenFruit);
  }

  private _addValueToControl(foundFruit: Fruit) {
    this.favoriteFruits.patchValue(new Set([...this.favoriteFruits.value!, foundFruit]));
    this.favoriteFruits.markAsDirty();
    this.chipInput?.clear();
  }

  remove(chipEvent: SbbChipEvent): void {
    const fruitToDelete = chipEvent.chip.value as Fruit;
    const fruitsCopy = new Set(this.favoriteFruits.value);
    fruitsCopy.delete(fruitToDelete);
    this.favoriteFruits.patchValue(fruitsCopy);
    this.favoriteFruits.markAsDirty();
  }

  formatFruit = (value: Fruit): string => {
    return `${value.name} (${value.color})`;
  };
}
