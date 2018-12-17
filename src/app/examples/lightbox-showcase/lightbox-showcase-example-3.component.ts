import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Lightbox } from 'sbb-angular';

@Component({
  selector: 'sbb-lightbox-showcase-example-3',
  templateUrl: 'lightbox-showcase-example-3-content.html',
})
export class LightboxShowcaseExample3Component {
  @ViewChild('sampleLightboxTemplate') sampleLightboxTemplate: TemplateRef<any>;
  constructor(public lightbox: Lightbox) { }

  openDialog() {
    const lightboxRef = this.lightbox.open(this.sampleLightboxTemplate);

    lightboxRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

