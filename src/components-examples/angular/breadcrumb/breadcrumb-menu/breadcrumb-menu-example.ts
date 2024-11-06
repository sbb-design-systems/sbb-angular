import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbBreadcrumbModule } from '@sbb-esta/angular/breadcrumb';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

/**
 * @title Breadcrumb with Menu
 * @order 20
 */
@Component({
  selector: 'sbb-breadcrumb-menu-example',
  templateUrl: 'breadcrumb-menu-example.html',
  imports: [SbbBreadcrumbModule, RouterLink, RouterLinkActive, SbbMenuModule],
})
export class BreadcrumbMenuExample {}
