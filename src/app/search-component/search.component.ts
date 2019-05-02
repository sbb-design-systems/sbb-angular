import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ComponentUiService } from '../services/component-ui.service';
import { UiComponent } from '../shared/ui-component';

@Component({
  selector: 'sbb-showcase-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() allUiComponents;

  searchChangeObserver: Subject<string>;

  inputValue: string;

  foundUiComponents: UiComponent[] = [];

  constructor(private _componentUiService: ComponentUiService) { }

  ngOnInit() {
    this.foundUiComponents = this.allUiComponents;
  }

  onSearchChange(searchValue: string) {
    if (!this.searchChangeObserver) {
      this.searchChangeObserver = new Subject<string>();
      this.searchChangeObserver
        .pipe(debounceTime(250))
        .pipe(distinctUntilChanged())
        .pipe(switchMap(searchTerm => {
          this.foundUiComponents = [];
          return this._componentUiService.getUiComponentsBySearchValue(searchTerm);
        }))
        .subscribe(uiComponents => this.foundUiComponents.push(uiComponents));
    }
    this.searchChangeObserver.next(searchValue);
  }
}
