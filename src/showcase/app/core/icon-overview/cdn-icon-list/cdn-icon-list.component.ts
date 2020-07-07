import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { CdnIcon, CdnIcons } from '../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon-list',
  templateUrl: './cdn-icon-list.component.html',
  styleUrls: ['./cdn-icon-list.component.scss'],
})
export class CdnIconListComponent {
  @Input() cdnIcons: CdnIcons;

  filterForm: FormGroup = new FormGroup({
    filter: new FormControl(''),
    fpl: new FormControl(true),
    kom: new FormControl(true),
  });

  filteredIcons: Observable<CdnIcon[]>;

  constructor() {
    this.filteredIcons = merge(
      this.filterForm.controls.fpl.valueChanges,
      this.filterForm.controls.kom.valueChanges,
      this.filterForm.controls.filter.valueChanges.pipe(debounceTime(200), startWith(''))
    ).pipe(
      map(() => {
        const values = this.filterForm.value;
        const filter = values.filter.toUpperCase();
        return this.cdnIcons.icons.filter(
          (i) =>
            ((i.namespace === 'kom' && values.kom === true) ||
              (i.namespace === 'fpl' && values.fpl === true)) &&
            (i.namespace.toUpperCase().indexOf(filter) !== -1 ||
              i.name.toUpperCase().indexOf(filter) !== -1 ||
              i.tags.some((tag) => tag.toUpperCase().indexOf(filter) !== -1))
        );
      })
    );
  }
}
