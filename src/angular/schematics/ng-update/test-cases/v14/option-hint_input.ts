import { CommonModule } from '@angular/common';
import { NgModule, Component, ViewChild } from '@angular/core';
import { SbbAutocompleteHint, SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';

@Component({
  selector: 'sbb-autocomplete-hint-example',
  template: `
    <input [sbbAutocomplete]="autoHint" sbbInput type="text" />
    <sbb-autocomplete #autoHint="sbbAutocomplete">
      <sbb-option *ngFor="let o of options" [value]="o">{{ o }}</sbb-option>
      <sbb-autocomplete-hint> There are more items </sbb-autocomplete-hint>
    </sbb-autocomplete>
  `,
})
export class AutocompleteHintExample {
  @ViewChild(SbbAutocompleteHint) hint: SbbAutocompleteHint;
  options = ['zero', 'one', 'two'];
}

@NgModule({
  declarations: [AutocompleteHintExample],
  imports: [SbbAutocompleteModule, CommonModule],
})
export class SbbAutocompleteExampleModule {}
