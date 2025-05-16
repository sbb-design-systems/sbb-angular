import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ShowcaseMetaPackage } from '../meta';

@Component({
  selector: 'sbb-package-viewer',
  templateUrl: './package-viewer.component.html',
  standalone: false,
})
export class PackageViewerComponent {
  package: Observable<ShowcaseMetaPackage>;

  constructor(activatedRoute: ActivatedRoute) {
    this.package = activatedRoute.data.pipe(map((data) => data.packageData));
  }
}
