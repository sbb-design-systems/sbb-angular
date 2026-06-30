import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SbbExpansionPanel, SbbExpansionPanelHeader } from '@sbb-esta/angular/accordion';
import { SbbSidebar, SbbSidebarContainer, SbbSidebarContent } from '@sbb-esta/angular/sidebar';
import { SbbSidebarLink } from '@sbb-esta/angular/sidebar';
import { map } from 'rxjs/operators';

import { DocsMetaPackage } from '../meta';

@Component({
  selector: 'sbb-package-viewer',
  templateUrl: './package-viewer.component.html',
  imports: [
    SbbSidebarContainer,
    SbbSidebar,
    SbbExpansionPanel,
    SbbExpansionPanelHeader,
    SbbSidebarLink,
    RouterLinkActive,
    RouterLink,
    SbbSidebarContent,
    RouterOutlet,
  ],
})
export class PackageViewerComponent {
  private activeRoute = inject(ActivatedRoute);
  readonly package = toSignal(
    this.activeRoute.data.pipe(map((data) => data.packageData as unknown as DocsMetaPackage)),
  );
}
