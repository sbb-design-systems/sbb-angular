import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SbbPaginator } from '@sbb-esta/angular/pagination';
import { merge, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { CdnIcon, CdnIcons } from '../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon-list',
  templateUrl: './cdn-icon-list.component.html',
  styleUrls: ['./cdn-icon-list.component.css'],
  standalone: false,
})
export class CdnIconListComponent implements AfterViewInit {
  @Input()
  set cdnIcons(newCdnIcons: CdnIcons) {
    this._cdnIcons = newCdnIcons;
    this.filterForm.patchValue({
      namespaces: this.namespaces.filter(
        (namespace) => !this.deprecatedNamespaces.includes(namespace),
      ),
    });
  }
  get cdnIcons(): CdnIcons {
    return this._cdnIcons;
  }
  private _cdnIcons: CdnIcons;

  filterForm = this._formBuilder.group({
    fulltext: [''],
    namespaces: [[]] as string[][],
    fitIcons: [true],
  });
  filteredIcons: Observable<CdnIcon[]>;
  namespaces = ['icon', 'picto', 'kom', 'fpl'];
  deprecatedNamespaces = ['kom', 'fpl'];
  pageSize = 50;

  @ViewChild(SbbPaginator) private _paginator: SbbPaginator;

  constructor(private _formBuilder: FormBuilder) {}

  ngAfterViewInit(): void {
    this.filteredIcons = merge(
      this.filterForm.controls.namespaces.valueChanges,
      this.filterForm.controls.fulltext.valueChanges.pipe(startWith(''), debounceTime(200)),
      this._paginator.page,
    ).pipe(
      map(() => {
        const fulltext = this.filterForm.get('fulltext').value.toUpperCase();
        const namespaces: string[] = this.filterForm.get('namespaces').value;

        const filteredIcons = this._cdnIcons.icons.filter(
          (i) =>
            namespaces.some(
              (namespace) => i.namespace === namespace || (!i.namespace && namespace === 'icon'),
            ) &&
            ((i.namespace && i.namespace.toUpperCase().indexOf(fulltext) !== -1) ||
              i.name.toUpperCase().indexOf(fulltext) !== -1 ||
              i.tags.some((tag) => !!tag && tag.toUpperCase().indexOf(fulltext) !== -1)),
        );

        this._paginator.length = filteredIcons.length;

        return filteredIcons.slice(
          this._paginator.pageIndex * this.pageSize,
          this._paginator.pageIndex * this.pageSize + this.pageSize,
        );
      }),
    );
  }
}
