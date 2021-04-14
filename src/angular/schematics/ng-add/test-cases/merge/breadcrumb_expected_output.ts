import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbBreadcrumbModule } from '@sbb-esta/angular/breadcrumb';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbIconModule } from '@sbb-esta/angular/icon';

@Component({
  template: `
    <sbb-breadcrumbs>
      <sbb-breadcrumb>
        <a routerLink="/" routerLinkActive="sbb-active">
          <sbb-icon svgIcon="kom:house-small"></sbb-icon>
        </a>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        <button [sbbMenuTriggerFor]="menu"><ng-template sbbMenuDynamicTrigger>Level 1 with detail pages</ng-template></button>
        <sbb-menu #menu="sbbMenu">
          <a sbb-menu-item routerLink="/level1" routerLinkActive="sbb-active">Level 1</a>
          <a sbb-menu-item routerLink="/level1b" routerLinkActive="sbb-active">Level 1b</a>
        </sbb-menu>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        <button [sbbMenuTriggerFor]="menu"><ng-template sbbMenuDynamicTrigger>Level 1 with detail pages</ng-template></button>
        <sbb-menu #menu="sbbMenu">
          <a sbb-menu-item routerLink="/level1/level2" routerLinkActive="sbb-active">Level 2</a>
        </sbb-menu>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        <a routerLink="/level1/level2/level3" routerLinkActive="sbb-active">Level 3</a>
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
  `,
})
export class BreadcrumbTestComponent {}

@NgModule({
  declarations: [BreadcrumbTestComponent],
  imports: [SbbBreadcrumbModule, SbbMenuModule, SbbIconModule, RouterModule],
})
export class BreadcrumbTestModule {}
