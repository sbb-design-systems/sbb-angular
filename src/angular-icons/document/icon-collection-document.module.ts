import { NgModule } from '@angular/core';

import { IconDocumentCheckModule } from './icon-document-check.module';
import { IconDocumentImageModule } from './icon-document-image.module';
import { IconDocumentLockModule } from './icon-document-lock.module';
import { IconDocumentPdfModule } from './icon-document-pdf.module';
import { IconDocumentPlusModule } from './icon-document-plus.module';
import { IconDocumentPptModule } from './icon-document-ppt.module';
import { IconDocumentSbbModule } from './icon-document-sbb.module';
import { IconDocumentSoundModule } from './icon-document-sound.module';
import { IconDocumentStandardModule } from './icon-document-standard.module';
import { IconDocumentTextModule } from './icon-document-text.module';
import { IconDocumentVideoModule } from './icon-document-video.module';
import { IconDocumentZipModule } from './icon-document-zip.module';
import { IconFolderInfoModule } from './icon-folder-info.module';
import { IconFolderLockModule } from './icon-folder-lock.module';
import { IconFolderOpenArrowModule } from './icon-folder-open-arrow.module';
import { IconFolderOpenModule } from './icon-folder-open.module';
import { IconFolderPlusModule } from './icon-folder-plus.module';
import { IconMetadataModule } from './icon-metadata.module';
import { IconTwoFoldersModule } from './icon-two-folders.module';

const modules = [
  IconDocumentCheckModule,
  IconDocumentImageModule,
  IconDocumentLockModule,
  IconDocumentPdfModule,
  IconDocumentPlusModule,
  IconDocumentPptModule,
  IconDocumentSbbModule,
  IconDocumentSoundModule,
  IconDocumentStandardModule,
  IconDocumentTextModule,
  IconDocumentVideoModule,
  IconDocumentZipModule,
  IconFolderInfoModule,
  IconFolderLockModule,
  IconFolderOpenModule,
  IconFolderOpenArrowModule,
  IconFolderPlusModule,
  IconMetadataModule,
  IconTwoFoldersModule,
];

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionDocumentModule {}
