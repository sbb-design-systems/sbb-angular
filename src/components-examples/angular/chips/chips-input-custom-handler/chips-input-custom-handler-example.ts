import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { SbbChipInputEvent } from '@sbb-esta/angular/chips';

export interface Fruit {
  name: string;
  color: string;
}

const availableFruits = [
  { name: 'Lemon', color: 'yellow' },
  { name: 'Lime', color: 'green' },
  { name: 'Apple', color: 'red' },
];

/**
 * @title Chips With Custom Chip Token Handlers
 * @order 3
 */
@Component({
  selector: 'sbb-chips-input-custom-handler-example',
  templateUrl: './chips-input-custom-handler-example.html',
})
export class ChipsInputCustomHandlerExample {
  readonly separatorKeysCodes = [ENTER, COMMA];
  fruits: Fruit[] = availableFruits.slice(0, 1);

  add(inputEvent: SbbChipInputEvent): void {
    const value = (inputEvent.value || '').trim();

    if (!value) {
      return;
    }

    const foundFruit = availableFruits.find(
      (fruit) => fruit.name.toUpperCase() === value.toUpperCase()
    );
    if (!foundFruit) {
      alert('fruit not available');
      return;
    }
    this.fruits.push(foundFruit);
    inputEvent.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
