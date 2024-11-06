import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbChipEvent, SbbChipInputEvent } from '@sbb-esta/angular/chips';
import { SbbChipsModule } from '@sbb-esta/angular/chips';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

export interface Fruit {
  name: string;
  color: string;
}

const availableFruits: Fruit[] = [
  { name: 'Lemon', color: 'yellow' },
  { name: 'Lime', color: 'green' },
  { name: 'Apple', color: 'red' },
];

/**
 * @title Chips With Custom Chip Token Handlers
 * @order 4
 */
@Component({
  selector: 'sbb-chips-input-custom-handler-example',
  templateUrl: 'chips-input-custom-handler-example.html',
  imports: [SbbFormFieldModule, SbbChipsModule, FormsModule, ReactiveFormsModule, JsonPipe],
})
export class ChipsInputCustomHandlerExample {
  readonly separatorKeysCodes = [ENTER, COMMA];
  favoriteFruits = new FormControl<Set<Fruit>>(new Set(availableFruits.slice(0, 1)));
  get favoriteFruitsAsArray() {
    return [...this.favoriteFruits.value!];
  }

  add(inputEvent: SbbChipInputEvent): void {
    const value = (inputEvent.value || '').trim();
    if (!value) {
      return;
    }

    const foundFruit = availableFruits.find(
      (fruit) => fruit.name.toUpperCase() === value.toUpperCase(),
    );
    if (!foundFruit) {
      alert('fruit not available');
      return;
    }
    this.favoriteFruits.patchValue(new Set([...this.favoriteFruits.value!, foundFruit]));
    this.favoriteFruits.markAsDirty();
    inputEvent.chipInput!.clear();
  }

  remove(chipEvent: SbbChipEvent): void {
    const fruitToDelete = chipEvent.chip.value as Fruit;
    const fruitsCopy = new Set(this.favoriteFruits.value);
    fruitsCopy.delete(fruitToDelete);
    this.favoriteFruits.patchValue(fruitsCopy);
    this.favoriteFruits.markAsDirty();
  }
}
