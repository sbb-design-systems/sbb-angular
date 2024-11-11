import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

/**
 * @title Tab group with dynamically changing tabs
 * @order 60
 */
@Component({
  selector: 'sbb-tab-group-dynamic-example',
  templateUrl: 'tab-group-dynamic-example.html',
  styleUrls: ['tab-group-dynamic-example.css'],
  imports: [
    SbbTabsModule,
    SbbButtonModule,
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
  ],
})
export class TabGroupDynamicExample {
  tabs = ['First', 'Second', 'Third'];
  selected = new FormControl(0);

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
