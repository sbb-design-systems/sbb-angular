import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';

/**
 * @title Link Example
 * @order 30
 */
@Component({
  selector: 'sbb-link-example',
  templateUrl: 'link-example.html',
  standalone: true,
  imports: [SbbButtonModule],
})
export class LinkExample {}
