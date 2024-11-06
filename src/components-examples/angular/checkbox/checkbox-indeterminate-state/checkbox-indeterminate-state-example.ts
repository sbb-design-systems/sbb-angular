import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

/**
 * @title Indeterminate State
 * @order 40
 */
@Component({
  selector: 'sbb-checkbox-indeterminate-state-example',
  templateUrl: 'checkbox-indeterminate-state-example.html',
  imports: [SbbCheckboxModule],
})
export class CheckboxIndeterminateStateExample {
  options = ['Waggon 1', 'Waggon 2', 'Waggon 3'];
  selection = new SelectionModel<string>(true, ['Waggon 1', 'Waggon 2']);

  isAllSelected() {
    return this.selection.selected.length === this.options.length;
  }

  parentToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.options.forEach((option) => this.selection.select(option));
  }
}
