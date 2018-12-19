import { Component, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Lightbox, LightboxRef, LIGHTBOX_DATA } from 'sbb-angular';

@Component({
  selector: 'sbb-lightbox-showcase-example-2-content',
  templateUrl: 'lightbox-showcase-example-2-content.html',
})
export class LightboxShowcaseExample2ContentComponent {
  alignment = 'center';
}


/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'sbb-lightbox-showcase-example-2',
  template: `
    <div class="sbbsc-block">
      <button sbbButton mode="secondary" (click)="openDialog()">Open Lightbox from Component</button>
    </div>`,
})
export class LightboxShowcaseExample2Component {

  constructor(public lightbox: Lightbox) { }

  openDialog() {
    const lightboxRef = this.lightbox.open(LightboxShowcaseExample2ContentComponent);

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

