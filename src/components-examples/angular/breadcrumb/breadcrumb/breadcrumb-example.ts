import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbBreadcrumbModule } from '@sbb-esta/angular/breadcrumb';

/**
 * @title Breadcrumb
 * @order 10
 */
@Component({
  selector: 'sbb-breadcrumb-example',
  templateUrl: 'breadcrumb-example.html',
  imports: [SbbBreadcrumbModule, RouterLink, RouterLinkActive],
})
export class BreadcrumbExample {}
