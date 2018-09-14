import { NgModule } from '@angular/core';
import { IconImageComponent } from './sbb-icon-image.component';
import { IconDocComponent } from './sbb-icon-doc.component';
import { IconSoundComponent } from './sbb-icon-sound.component';
import { IconVideoComponent } from './sbb-icon-video.component';
import { IconZipComponent } from './sbb-icon-zip.component';

@NgModule({
  imports: [],
  // tslint:disable-next-line:max-line-length
  declarations: [IconImageComponent, IconDocComponent, IconSoundComponent, IconVideoComponent, IconZipComponent],
  // tslint:disable-next-line:max-line-length
  exports: [IconImageComponent, IconDocComponent, IconSoundComponent, IconVideoComponent, IconZipComponent]
})
export class IconDocumentsModule { }
