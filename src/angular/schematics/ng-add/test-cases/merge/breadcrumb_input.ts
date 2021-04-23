import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbBreadcrumbModule, SbbDropdownModule, SbbIconModule } from '@sbb-esta/angular-public';

@Component({
  template: `
    <sbb-breadcrumbs>
      <sbb-breadcrumb>
        <a routerLink="/" routerLinkActive="sbb-selected" aria-label="Back to the homepage">
          <sbb-icon svgIcon="kom:house-small"></sbb-icon>
        </a>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        <sbb-dropdown>
          <a sbbDropdownItem routerLink="/level1" routerLinkActive="sbb-selected">Level 1</a>
          <a sbbDropdownItem routerLink="/level1b" routerLinkActive="sbb-selected">Level 1b</a>
        </sbb-dropdown>
        Level 1 with detail pages
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        <span>Level</span>
        <!-- I'm a comment -->
        <sbb-dropdown>
          <a sbbDropdownItem routerLink="/level1/level2" routerLinkActive="sbb-selected">Level 2</a>
        </sbb-dropdown>
        2
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
    <sbb-breadcrumbs></sbb-breadcrumbs>
  `,
})
export class BreadcrumbTestComponent {}

@NgModule({
  declarations: [BreadcrumbTestComponent],
  imports: [SbbBreadcrumbModule, SbbDropdownModule, SbbIconModule, RouterModule],
})
export class BreadcrumbTestModule {}
