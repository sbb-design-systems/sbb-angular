import { Component } from '@angular/core';
import { UiIcon } from '../shared/ui-icon';
import { IconUiService } from '../services/icon-ui.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'sbb-search-icon',
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss']
})
export class SearchIconComponent {

  searchChangeObserver;

  foundUiIcons: UiIcon[] = [];

  constructor(private iconUiService: IconUiService, private router: Router) {
  }

  onSearchChange(searchValue: string) {
    this.foundUiIcons = [];
    if (!this.searchChangeObserver) {
         Observable.create(observer => { this.searchChangeObserver = observer; })
                   .pipe(debounceTime(500))
                   .pipe(distinctUntilChanged())
                   .pipe(switchMap(searchTerm => this.iconUiService.getUiIconsBySearchValue(searchTerm)))
                   .subscribe(uiComponents => this.foundUiIcons.push(uiComponents));
    }
    this.searchChangeObserver.next(searchValue);
  }

  navigate(path : any) {
    // clean up ...
    this.cleanUp();
    // navigate to clicked component ...
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    this.router.navigate([path]));
  }

  cleanUp() {
    this.foundUiIcons = [];
  }
}
