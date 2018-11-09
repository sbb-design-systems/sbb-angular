import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UiIcon } from '../shared/ui-icon';
import { IconUiService } from '../services/icon-ui.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-search-icon',
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchIconComponent implements OnInit {

  @Input() allUiIcons;

  inputValue = new FormControl();

  foundUiIcons = new Subject<UiIcon[]>();

  constructor(private iconUiService: IconUiService, private router: Router) {
    // this.inputValue.setValue('');
    this.inputValue.valueChanges
      .pipe(debounceTime(250))
      .pipe(distinctUntilChanged())
      .subscribe(searchTerm => {
        this.foundUiIcons.next(this.iconUiService.getUiIconsBySearchValue(searchTerm));
      });
  }


  ngOnInit() {
    this.inputValue.setValue('');
    // this.foundUiIcons.next(this.allUiIcons);
  }

  // onSearchChange(searchValue: string) {

  //   if (!this.searchChangeObserver) {
  //     this.searchChangeObserver.pipe(debounceTime(250))
  //       .pipe(distinctUntilChanged())
  //       .pipe(map(searchTerm => {
  //         return this.iconUiService.getUiIconsBySearchValue(searchTerm);
  //       }))
  //       .subscribe(uiComponents => this.foundUiIcons = uiComponents);
  //   }
  //   this.searchChangeObserver.next(searchValue);
  // }

  // async navigate(path: any) {
  //   this.foundUiIcons = [];
  //   this.inputValue = '';
  //   // navigate to clicked component ...
  //   await this.router.navigateByUrl('/', { skipLocationChange: true });
  //   this.router.navigate([path]);
  // }
}
