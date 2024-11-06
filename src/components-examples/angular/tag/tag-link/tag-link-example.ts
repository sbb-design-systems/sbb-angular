import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SbbTagModule } from '@sbb-esta/angular/tag';

/**
 * @title Tag Link
 * @order 40
 */
@Component({
  selector: 'sbb-tag-link-example',
  templateUrl: 'tag-link-example.html',
  imports: [SbbTagModule, RouterLink],
})
export class TagLinkExample {}
