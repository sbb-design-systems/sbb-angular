import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbBreadcrumbModule } from '@sbb-esta/angular/breadcrumb';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

@Component({
  template: `
    <sbb-breadcrumbs>
      
        <a routerLink="/" routerLinkActive="sbb-active" aria-label="Back to the homepage" sbb-breadcrumb-root></a>
      

      <sbb-breadcrumb>
<button [sbbMenuTriggerFor]="menu"><ng-template sbbMenuDynamicTrigger>
        
        Level 1 with sister pages
      </ng-template></button>
<sbb-menu #menu="sbbMenu">
          <a sbb-menu-item routerLink="/level1" routerLinkActive="sbb-active">Level 1</a>
          <a sbb-menu-item routerLink="/level1b" routerLinkActive="sbb-active">Level 1b</a>
        </sbb-menu>
</sbb-breadcrumb>

      <sbb-breadcrumb>
<button [sbbMenuTriggerFor]="menu1"><ng-template sbbMenuDynamicTrigger>
        <span>Level</span>
        <!-- I'm a comment -->
        
        2
      </ng-template></button>
<sbb-menu #menu1="sbbMenu">
          <a sbb-menu-item routerLink="/level1/level2" routerLinkActive="sbb-active">Level 2</a>
        </sbb-menu>
</sbb-breadcrumb>
    </sbb-breadcrumbs>
    <sbb-breadcrumbs><sbb-breadcrumb root></sbb-breadcrumb><sbb-breadcrumb></sbb-breadcrumb></sbb-breadcrumbs>
  `,
})
export class BreadcrumbTestComponent {}

@NgModule({
  declarations: [BreadcrumbTestComponent],
  imports: [SbbBreadcrumbModule, SbbMenuModule, SbbIconModule, RouterModule],
})
export class BreadcrumbTestModule {}
