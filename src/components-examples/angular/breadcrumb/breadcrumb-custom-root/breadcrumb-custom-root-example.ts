import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbBreadcrumbModule } from '@sbb-esta/angular/breadcrumb';

/**
 * @title Breadcrumb with Custom Root
 * @order 40
 */
@Component({
  selector: 'sbb-breadcrumb-custom-root-example',
  templateUrl: 'breadcrumb-custom-root-example.html',
  imports: [SbbBreadcrumbModule, RouterLink, RouterLinkActive],
})
export class BreadcrumbCustomRootExample {}
