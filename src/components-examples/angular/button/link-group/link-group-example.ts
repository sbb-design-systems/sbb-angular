import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';

/**
 * @title Link Group Example
 * @order 40
 */
@Component({
  selector: 'sbb-link-group-example',
  templateUrl: 'link-group-example.html',
  standalone: true,
  imports: [SbbButtonModule],
})
export class LinkGroupExample {}
