import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { findPackageEntry, ShowcaseMetaEntry } from '../../meta';
import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.css'],
})
export class ComponentViewerComponent implements OnInit {
  showcaseMetaEntry: Observable<ShowcaseMetaEntry>;
  sections = ['Overview', 'API', 'Examples'];

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    this.showcaseMetaEntry = moduleParams(this._route).pipe(
      map((params) => {
        const pckg = findPackageEntry(params.packageName, params.id);
        console.log(pckg);
        return pckg;
      }),
    );
  }
}
