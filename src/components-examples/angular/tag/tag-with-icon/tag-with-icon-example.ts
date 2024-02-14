import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbTagModule } from '@sbb-esta/angular/tag';

/**
 * @title Tag With Icon
 * @order 50
 */
@Component({
  selector: 'sbb-tag-with-icon-example',
  templateUrl: 'tag-with-icon-example.html',
  standalone: true,
  imports: [SbbTagModule, SbbButtonModule],
})
export class TagWithIconExample {}
