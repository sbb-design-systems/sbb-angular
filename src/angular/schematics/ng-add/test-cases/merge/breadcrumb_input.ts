import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbBreadcrumbModule, SbbDropdownModule, SbbIconModule } from '@sbb-esta/angular-public';

@Component({
  template: `
    <sbb-breadcrumbs>
      <sbb-breadcrumb>
        <a routerLink="/" routerLinkActive="sbb-selected">
          <sbb-icon svgIcon="kom:house-small"></sbb-icon>
        </a>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        Level 1 with detail pages
        <sbb-menu>
          <a sbbDropdownItem routerLink="/level1" routerLinkActive="sbb-selected">Level 1</a>
          <a sbbDropdownItem routerLink="/level1b" routerLinkActive="sbb-selected">Level 1b</a>
        </sbb-menu>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        Level 2
        <sbb-menu>
          <a sbbDropdownItem routerLink="/level1/level2" routerLinkActive="sbb-selected">Level 2</a>
        </sbb-menu>
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
  `,
})
export class BreadcrumbTestComponent {}

@NgModule({
  declarations: [BreadcrumbTestComponent],
  imports: [SbbBreadcrumbModule, SbbDropdownModule, SbbIconModule, RouterModule],
})
export class BreadcrumbTestModule {}
