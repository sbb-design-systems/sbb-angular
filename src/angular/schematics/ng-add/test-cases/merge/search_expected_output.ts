import { Component } from '@angular/core';

@Component({
  selector: 'sbb-search-example',
  template: `
    <sbb-search (search)="search()" class="test"><input i18n-placeholder="desc@@id" placeholder="Search" /></sbb-search>
    <sbb-search (search)="search()"><input formControlName="value1" i18n-placeholder="desc@@id" placeholder="Search" /></sbb-search>
    <sbb-search (search)="search()"><input [(ngModel)]="value2" i18n-placeholder="desc@@id" placeholder="Search" /></sbb-search>

    <sbb-search (search)="search($event)"><input i18n-placeholder="desc@@id" placeholder="Search" [sbbAutocomplete]="auto1" /></sbb-search>
    <sbb-autocomplete #auto1="sbbAutocomplete">
      <sbb-option *ngFor="let option of filteredOptions" [value]="option">
        {{ option }}
      </sbb-option>
    </sbb-autocomplete>
  `
})
export class SearchComponent {
  search(event?: string) {
    // Event
  }
}
