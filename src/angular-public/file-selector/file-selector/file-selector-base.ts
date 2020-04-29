import { InjectionToken } from '@angular/core';

export const FILE_SELECTOR_OPTIONS = new InjectionToken<FileSelectorOptions>(
  'FILE_SELECTOR_OPTIONS'
);

export interface FileSelectorOptions {
  /**
   * Categories of file types accepted by sbb-file-selector component.
   * It is optional.
   */
  accept?: string;
  /**
   * Attribute whose state specifies the preferred facing mode for the media capture mechanism.
   * The attribute's keywords are user and environment, which map to the respective states user and environment.
   * It is optional.
   */
  capture?: 'user' | 'environment';
  /**
   * Mode on file selector component to chose more files to upload.
   * It is optional.
   */
  multiple?: boolean;
  /**
   * Set if the component should add files on top of the already selected ones or keep default input file behaviour
   */
  multipleMode?: 'default' | 'persistent';
}

export enum FileTypeCategory {
  // tslint:disable-next-line: naming-convention
  GENERIC_DOC = 1,
  DOC,
  IMAGE,
  PDF,
  AUDIO,
  VIDEO,
  ZIP
}

export const FILE_TYPES: { [key: string]: string[] } = {
  TEXT: ['text/*'],

  IMAGE: ['image/*'],
  IMAGE_JPG: ['image/jpeg', 'image/pjpeg'],
  IMAGE_PNG: ['image/png'],
  IMAGE_SVG: ['image/svg+xml'],
  IMAGE_GIF: ['image/gif'],

  AUDIO: ['audio/*'],
  AUDIO_MP4: ['audio/mp4'],
  AUDIO_MP3: ['audio/mpeg', 'audio/mp3'],
  AUDIO_OGG: ['audio/ogg'],
  AUDIO_WAVE: ['audio/wave'],
  AUDIO_WAV: ['audio/wav', 'audio/x-wav', 'audio/x-pn-wav', 'audio/webm'],

  VIDEO: ['video/*'],
  VIDEO_MP4: ['video/mp4'],
  VIDEO_MPEG: ['video/mpeg'],
  VIDEO_OGG: ['video/ogg'],
  VIDEO_MOV: ['video/quicktime'],
  VIDEO_WEBM: ['video/webm'],
  VIDEO_AVI: ['video/x-msvideo'],
  VIDEO_WMV: ['video/x-ms-wmv'],

  PDF: ['application/pdf'],

  MS_WORD_DOC: [
    'application/msword',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.ms-word.template.macroEnabled.12'
  ],

  MS_EXCEL: [
    'application/vnd.ms-excel',
    'application/vnd.ms-excel',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-excel.template.macroEnabled.12',
    'application/vnd.ms-excel.addin.macroEnabled.12',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
  ],

  MS_POWERPOINT: [
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.template',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    'application/vnd.ms-powerpoint.addin.macroEnabled.12',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
  ],

  ZIP: [
    'application/x-gtar',
    'application/x-gcompress',
    'application/compress',
    'application/x-tar',
    'application/x-rar-compressed',
    'application/octet-stream',
    'application/x-zip-compressed',
    'application/zip-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/zip',
    'application/x-bzip2'
  ]
};
