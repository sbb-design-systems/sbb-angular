import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';
import { Option } from '../option.model';

@Component({
  selector: 'sbb-autocomplete-option',
  templateUrl: './autocomplete-option.component.html',
  styleUrls: ['./autocomplete-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteOptionComponent implements Highlightable {

  @Input() item: Option;
  @Input() filter: string;

  @HostBinding('class.selected') selected: boolean;

  setActiveStyles(): void {
    this.selected = true;
  }

  setInactiveStyles(): void {
    this.selected = false;
  }

  getLabel?(): string {
    return this.item.getLabel();
  }

}
