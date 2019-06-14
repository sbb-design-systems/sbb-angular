import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { IconUiService } from '../services/icon-ui.service';
import { UiIcon } from '../shared/ui-icon';

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

  constructor(private _iconUiService: IconUiService) {
    this.inputValue.valueChanges
      .pipe(debounceTime(250))
      .pipe(distinctUntilChanged())
      .subscribe(searchTerm => {
        this.foundUiIcons.next(this._iconUiService.getUiIconsBySearchValue(searchTerm));
      });
  }

  ngOnInit() {
    this.inputValue.setValue('');
  }
}
