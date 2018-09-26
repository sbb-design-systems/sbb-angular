import { Component } from '@angular/core';
import { UiComponent } from '../shared/ui-component';
import { ComponentUiService } from '../services/component-ui.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'sbb-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  searchChangeObserver: Subject<string>;

  inputValue: string;

  foundUiComponents: UiComponent[] = [];

  constructor(private componentUiService: ComponentUiService, private router: Router) {
  }

  onSearchChange(searchValue: string) {
    this.foundUiComponents = [];
    if (!this.searchChangeObserver) {
      this.searchChangeObserver = new Subject<string>();
      this.searchChangeObserver
        .pipe(debounceTime(500))
        .pipe(distinctUntilChanged())
        .pipe(switchMap(searchTerm => this.componentUiService.getUiComponentsBySearchValue(searchTerm)))
        .subscribe(uiComponents => this.foundUiComponents.push(uiComponents));
    }
    this.searchChangeObserver.next(searchValue);
  }

  async navigate(path: any) {
    this.foundUiComponents = [];
    this.inputValue = '';
    // navigate to clicked component ...
    await this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([path])
    );
  }
}
