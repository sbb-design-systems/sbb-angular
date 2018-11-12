import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UiIcon } from '../shared/ui-icon';
import { IconUiService } from '../services/icon-ui.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
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

  constructor(private iconUiService: IconUiService) {
    this.inputValue.valueChanges
      .pipe(debounceTime(250))
      .pipe(distinctUntilChanged())
      .subscribe(searchTerm => {
        this.foundUiIcons.next(this.iconUiService.getUiIconsBySearchValue(searchTerm));
      });
  }


  ngOnInit() {
    this.inputValue.setValue('');
  }
}
