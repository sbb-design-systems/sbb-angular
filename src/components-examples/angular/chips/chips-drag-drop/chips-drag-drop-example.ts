import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

export interface Fruit {
  name: string;
}

/**
 * @title Chips Drag and Drop
 * @order 5
 */
@Component({
  selector: 'sbb-chips-drag-drop-example',
  templateUrl: 'chips-drag-drop-example.html',
  styleUrls: ['chips-drag-drop-example.css'],
})
export class ChipsDragDropExample {
  fruits: Fruit[] = [
    { name: 'apple' },
    { name: 'banana' },
    { name: 'strawberry' },
    { name: 'orange' },
    { name: 'kiwi' },
    { name: 'cherry' },
  ];

  drop(event: CdkDragDrop<Fruit[]>) {
    moveItemInArray(this.fruits, event.previousIndex, event.currentIndex);
  }
}
