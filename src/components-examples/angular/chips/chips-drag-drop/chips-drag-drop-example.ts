import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { SbbChipsModule } from '@sbb-esta/angular/chips';

export interface Fruit {
  name: string;
}

/**
 * @title Chips Drag and Drop
 * @order 6
 */
@Component({
  selector: 'sbb-chips-drag-drop-example',
  templateUrl: 'chips-drag-drop-example.html',
  styleUrls: ['chips-drag-drop-example.css'],
  standalone: true,
  imports: [SbbChipsModule, CdkDropList, NgFor, CdkDrag],
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
