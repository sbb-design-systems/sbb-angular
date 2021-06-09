import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbChipInputEvent } from '@sbb-esta/angular/chips';

/**
 * @title Chips with form control
 */
@Component({
  selector: 'sbb-chips-form-control-example',
  templateUrl: 'chips-form-control-example.html',
  styleUrls: ['chips-form-control-example.css'],
})
export class ChipsFormControlExample {
  keywords = new Set(['angular', 'how-to', 'tutorial']);
  formControl = new FormControl();

  addKeywordFromInput(event: SbbChipInputEvent) {
    if (event.value) {
      this.keywords.add(event.value);
      event.chipInput!.clear();
    }
  }

  removeKeyword(keyword: string) {
    this.keywords.delete(keyword);
  }
}
