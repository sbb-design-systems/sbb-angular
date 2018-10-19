import { Component, Input } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';

@Component({
  selector: 'sbb-autocomplete-option',
  templateUrl: './autocomplete-option.component.html',
  styleUrls: ['./autocomplete-option.component.scss']
})
export class AutocompleteOptionComponent implements Highlightable {

  @Input()
  item?: any;

  @Input()
  inputId: string;

  disabled?: boolean;

  setActiveStyles(): void {
    throw new Error('Method not implemented.');
  }
  setInactiveStyles(): void {
    throw new Error('Method not implemented.');
  }

  getLabel?(): string {
    return this.item;
  }

}
