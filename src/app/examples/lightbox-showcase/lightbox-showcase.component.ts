import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-lightbox-showcase',
  template: '<sbb-lightbox-showcase-example></sbb-lightbox-showcase-example><dialog-content-example-bis></dialog-content-example-bis>',
  styleUrls: ['lightbox-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LightboxShowcaseComponent {
}
