import { InjectionToken } from '@angular/core';

export const FILE_SELECTOR_OPTIONS = new InjectionToken<any>('FILE_SELECTOR_OPTIONS');

export interface FileSelectorOptions {
  temp: any;
}

export enum FileCategories {
  GENERIC_DOC = 1,
  DOC,
  IMAGE,
  PDF,
  AUDIO,
  VIDEO,
  ZIP
}

export class FileTypes {
  static types: { [key: string]: string[] } = {
    TEXT: ['text/*'],

    IMAGE: ['image/*'],
    IMAGE_JPG: ['image/jpeg', 'image/pjpeg'],
    IMAGE_PNG: ['image/png'],
    IMAGE_SVG: ['image/svg+xml'],
    IMAGE_GIF: ['image/gif'],

    AUDIO: ['audio/*'],
    AUDIO_MP4: ['audio/mp4'],
    AUDIO_MP3: ['audio/mpeg'],
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

    MS_WORD_DOC: ['application/msword',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
      'application/vnd.ms-word.document.macroEnabled.12',
      'application/vnd.ms-word.template.macroEnabled.12'],

    MS_EXCEL: ['application/vnd.ms-excel',
      'application/vnd.ms-excel',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      'application/vnd.ms-excel.template.macroEnabled.12',
      'application/vnd.ms-excel.addin.macroEnabled.12',
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12'],

    MS_POWERPOINT: ['application/vnd.ms-powerpoint',
      'application/vnd.ms-powerpoint',
      'application/vnd.ms-powerpoint',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.template',
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
      'application/vnd.ms-powerpoint.addin.macroEnabled.12',
      'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
      'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
      'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'],

    ZIP: ['application/x-gtar',
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
      'application/x-bzip2']
  };

  static getCategoryByType(mimeType: string): number {
    let cat = FileCategories.GENERIC_DOC;

    const isDoc = this.findMimeType(['MS_WORD_DOC', 'MS_EXCEL', 'MS_POWERPOINT'], mimeType);
    const isImage = this.findMimeType(['IMAGE_GIF', 'IMAGE_JPG', 'IMAGE_PNG', 'IMAGE_SVG'], mimeType);
    const isPDF = this.findMimeType(['PDF'], mimeType);
    const isAudio = this.findMimeType(['AUDIO_MP4', 'AUDIO_MP3', 'AUDIO_OGG', 'AUDIO_WAVE', 'AUDIO_WAV'], mimeType);
    const isVideo = this.findMimeType([
      'VIDEO_MP4', 'VIDEO_MPEG', 'VIDEO_OGG', 'VIDEO_MOV', 'VIDEO_WEBM', 'VIDEO_AVI', 'VIDEO_WMV'], mimeType);
    const isZip = this.findMimeType(['ZIP'], mimeType);

    if (isDoc) { cat = FileCategories.DOC; }
    if (isImage) { cat = FileCategories.IMAGE; }
    if (isPDF) { cat = FileCategories.PDF; }
    if (isAudio) { cat = FileCategories.AUDIO; }
    if (isVideo) { cat = FileCategories.VIDEO; }
    if (isZip) { cat = FileCategories.ZIP; }

    return cat;
  }

  static findMimeType(typeNames: string[], mimeType: string): boolean {
    return typeNames.some((type: string) => {
      return this.types[type].indexOf(mimeType) !== -1;
    });
  }
}



