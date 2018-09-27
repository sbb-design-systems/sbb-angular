import { Component } from '@angular/core';
import { UiIcon } from '../shared/ui-icon';
import { IconUiService } from '../services/icon-ui.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'sbb-search-icon',
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss']
})
export class SearchIconComponent {

  searchChangeObserver: Subject<string>;

  inputValue: string;

  foundUiIcons: UiIcon[] = [];

  constructor(private iconUiService: IconUiService, private router: Router) {
  }

  onSearchChange(searchValue: string) {
    this.foundUiIcons = [];
    if (!this.searchChangeObserver) {
         this.searchChangeObserver = new Subject<string>();
         this.searchChangeObserver.pipe(debounceTime(500))
                                  .pipe(distinctUntilChanged())
                                  .pipe(switchMap(searchTerm => this.iconUiService.getUiIconsBySearchValue(searchTerm)))
                                  .subscribe(uiComponents => this.foundUiIcons.push(uiComponents));
    }
    this.searchChangeObserver.next(searchValue);
  }

  async navigate(path : any) {
    this.foundUiIcons = [];
    this.inputValue = '';
    // navigate to clicked component ...
    await this.router.navigateByUrl('/', {skipLocationChange: true});
    this.router.navigate([path]);
  }
}
