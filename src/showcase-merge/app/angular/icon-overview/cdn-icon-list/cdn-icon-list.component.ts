import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SbbPaginatorComponent } from '@sbb-esta/angular-public/pagination';
import { merge, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { CdnIcon, CdnIcons } from '../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon-list',
  templateUrl: './cdn-icon-list.component.html',
  styleUrls: ['./cdn-icon-list.component.css'],
})
export class CdnIconListComponent implements AfterViewInit {
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
  pageSize = 50;

  @ViewChild(SbbPaginatorComponent) private _paginator: SbbPaginatorComponent;

  constructor(formBuilder: FormBuilder) {
    this.filterForm = formBuilder.group({
      fulltext: [''],
      namespaces: [[]],
      fitIcons: [true],
    });
  }

  ngAfterViewInit(): void {
    this.filteredIcons = merge(
      this.filterForm.controls.namespaces.valueChanges,
      this.filterForm.controls.fulltext.valueChanges.pipe(startWith(''), debounceTime(200)),
      this._paginator.page
    ).pipe(
      map(() => {
        const fulltext = this.filterForm.get('fulltext').value.toUpperCase();
        const namespaces: string[] = this.filterForm.get('namespaces').value;

        const filteredIcons = this._cdnIcons.icons.filter(
          (i) =>
            namespaces.some((namespace) => i.namespace === namespace) &&
            (i.namespace.toUpperCase().indexOf(fulltext) !== -1 ||
              i.name.toUpperCase().indexOf(fulltext) !== -1 ||
              i.tags.some((tag) => tag.toUpperCase().indexOf(fulltext) !== -1))
        );

        this._paginator.length = filteredIcons.length;

        return filteredIcons.slice(
          this._paginator.pageIndex * this.pageSize,
          this._paginator.pageIndex * this.pageSize + this.pageSize
        );
      })
    );
  }
}
