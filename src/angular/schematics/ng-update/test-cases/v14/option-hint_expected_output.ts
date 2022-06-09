import { CommonModule } from '@angular/common';
import { NgModule, Component, ViewChild } from '@angular/core';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionHint } from '@sbb-esta/angular/core';

@Component({
  selector: 'sbb-autocomplete-hint-example',
  template: `
    <input [sbbAutocomplete]="autoHint" sbbInput type="text" />
    <sbb-autocomplete #autoHint="sbbAutocomplete">
      <sbb-option *ngFor="let o of options" [value]="o">{{ o }}</sbb-option>
      <sbb-option-hint> There are more items </sbb-option-hint>
    </sbb-autocomplete>
  `,
})
export class AutocompleteHintExample {
  @ViewChild(SbbOptionHint) hint: SbbOptionHint;
  options = ['zero', 'one', 'two'];
}

@NgModule({
  declarations: [AutocompleteHintExample],
  imports: [SbbAutocompleteModule, CommonModule],
})
export class SbbAutocompleteExampleModule {}
