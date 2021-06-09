import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbChipInputEvent } from '@sbb-esta/angular/chips';

/**
 * @title Chips Reactive Forms
 * @order 1
 */
@Component({
  selector: 'sbb-chips-reactive-forms-example',
  templateUrl: 'chips-reactive-forms-example.html',
  styleUrls: ['chips-reactive-forms-example.css'],
})
export class ChipsReactiveFormsExample {
  formControl = new FormControl(['angular', 'how-to', 'tutorial']);

  addKeywordFromInput(event: SbbChipInputEvent) {
    if (event.value) {
      this.formControl.setValue([...new Set([...this.formControl.value, event.value])]);
      event.chipInput!.clear();
    }
  }

  removeKeyword(keyword: string) {
    this.formControl.setValue([...this.formControl.value].filter((entry) => entry !== keyword));
  }
}
