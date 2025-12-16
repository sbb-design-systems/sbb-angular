import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SbbTabLink, SbbTabNav, SbbTabNavPanel } from '@sbb-esta/angular/tabs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DocsMetaEntry, findPackageEntry } from '../../meta';
import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.scss'],
  imports: [SbbTabNav, SbbTabLink, RouterLinkActive, RouterLink, SbbTabNavPanel, RouterOutlet],
})
export class ComponentViewerComponent implements OnInit {
  docsMetaEntry!: Observable<DocsMetaEntry>;
  sections: string[] = ['Overview', 'API', 'Examples'];

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    this.docsMetaEntry = moduleParams(this._route).pipe(
      map((params) => findPackageEntry(params.packageName, params.id)),
    );
  }
}
