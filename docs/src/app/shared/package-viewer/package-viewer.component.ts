import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SbbExpansionPanel, SbbExpansionPanelHeader } from '@sbb-esta/angular/accordion';
import { SbbSidebar, SbbSidebarContainer, SbbSidebarContent } from '@sbb-esta/angular/sidebar';
import { SbbSidebarLink } from '@sbb-esta/angular/sidebar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DocsMetaPackage } from '../meta';

@Component({
  selector: 'sbb-package-viewer',
  templateUrl: './package-viewer.component.html',
  imports: [
    SbbSidebarContainer,
    SbbSidebar,
    NgFor,
    SbbExpansionPanel,
    SbbExpansionPanelHeader,
    SbbSidebarLink,
    RouterLinkActive,
    RouterLink,
    SbbSidebarContent,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class PackageViewerComponent {
  package: Observable<DocsMetaPackage>;

  constructor(activatedRoute: ActivatedRoute) {
    this.package = activatedRoute.data.pipe(map((data) => data.packageData));
  }
}
