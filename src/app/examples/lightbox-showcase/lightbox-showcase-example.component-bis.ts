import { Component, Inject } from '@angular/core';
import { Lightbox, LightboxRef, LIGHTBOX_DATA } from 'sbb-angular';

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-content-example-bis',
  template: '<button (click)="openDialog()">Open dialog</button>',
})
export class LightboxShowcaseExampleBisComponent {
  constructor(public lightbox: Lightbox) {}

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxShowcaseExampleDialogBisComponent);

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-content-example-dialog-bis',
  templateUrl: 'lightbox-showcase.component-bis.html',
})
// tslint:disable-next-line:component-class-suffix
export class LightboxShowcaseExampleDialogBisComponent {}

