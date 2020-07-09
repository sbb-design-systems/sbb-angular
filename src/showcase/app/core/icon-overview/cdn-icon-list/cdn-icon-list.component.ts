import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { CdnIcon, CdnIcons } from '../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon-list',
  templateUrl: './cdn-icon-list.component.html',
  styleUrls: ['./cdn-icon-list.component.scss'],
})
export class CdnIconListComponent {
  @Input()
  set cdnIcons(newCdnIcons: CdnIcons) {
    this._cdnIcons = newCdnIcons;
    this.namespaces = Array.from(
      new Set(newCdnIcons.icons.map((cdnIcon) => cdnIcon.namespace))
    ).sort();
    this.filterForm.patchValue({ namespaces: this.namespaces });
  }
  get cdnIcons(): CdnIcons {
    return this._cdnIcons;
  }
  private _cdnIcons: CdnIcons;

  filterForm: FormGroup;

  filteredIcons: Observable<CdnIcon[]>;

  namespaces: string[];

  constructor(formBuilder: FormBuilder) {
    this.filterForm = formBuilder.group({
      fulltext: [''],
      namespaces: [[]],
      fitIcons: [true],
    });

    this.filteredIcons = merge(
      this.filterForm.controls.namespaces.valueChanges,
      this.filterForm.controls.fulltext.valueChanges.pipe(debounceTime(200), startWith(''))
    ).pipe(
      map(() => {
        const fulltext = this.filterForm.get('fulltext').value.toUpperCase();
        const namespaces: string[] = this.filterForm.get('namespaces').value;

        return this._cdnIcons.icons.filter(
          (i) =>
            namespaces.some((namespace) => i.namespace === namespace) &&
            (i.namespace.toUpperCase().indexOf(fulltext) !== -1 ||
              i.name.toUpperCase().indexOf(fulltext) !== -1 ||
              i.tags.some((tag) => tag.toUpperCase().indexOf(fulltext) !== -1))
        );
      })
    );
  }
}
