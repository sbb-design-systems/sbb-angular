import { Component } from '@angular/core';
import { UiComponent } from '../shared/ui-component';
import { ComponentUiService } from '../services/component-ui.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sbb-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  searchChangeObserver;

  foundUiComponents: UiComponent[] = [];

  constructor(private componentUiService: ComponentUiService, private router: Router, private route: ActivatedRoute) {
  }
  
  onSearchChange(searchValue: string) {
    // write it out ...
    console.log('search value', searchValue);
    this.foundUiComponents = [];
    if (!this.searchChangeObserver) {
         Observable.create(observer => { this.searchChangeObserver = observer })
                   .pipe(debounceTime(500))
                   .pipe(distinctUntilChanged())
                   .pipe(switchMap(searchTerm => this.componentUiService.getUiComponentsBySearchValue(searchTerm)))
                   .subscribe(uiComponents => this.foundUiComponents.push(uiComponents));
    }
    this.searchChangeObserver.next(searchValue);
  }

  navigate(path : any) {
    // clean up ...
    this.cleanUp();
    // write it out ...
    console.log(path);
    // navigate to button ...
    this.router.navigate(path, { relativeTo: this.route });
  }

  cleanUp() {
    this.foundUiComponents = [];
  }
}