import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ShowcaseMetaLibrary } from '../meta';

@Component({
  selector: 'sbb-library-viewer',
  templateUrl: './library-viewer.component.html',
})
export class LibraryViewerComponent {
  library: Observable<ShowcaseMetaLibrary>;

  constructor(activatedRoute: ActivatedRoute) {
    this.library = activatedRoute.data.pipe(map((data) => data.library));
  }
}
