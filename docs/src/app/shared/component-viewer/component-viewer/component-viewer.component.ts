import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { findPackageEntry, ShowcaseMetaEntry } from '../../meta';
import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.scss'],
  standalone: false,
})
export class ComponentViewerComponent implements OnInit {
  showcaseMetaEntry!: Observable<ShowcaseMetaEntry>;
  sections: string[] = ['Overview', 'API', 'Examples'];

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    this.showcaseMetaEntry = moduleParams(this._route).pipe(
      map((params) => findPackageEntry(params.packageName, params.id)),
    );
  }
}
