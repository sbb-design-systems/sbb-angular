import { Injectable } from '@angular/core';
import { FileTypeCategory, FILE_TYPES } from './file-selector-base';

@Injectable()
export class FileSelectorTypesService {

  getFileTypeCategoryByMimeType(mimeType: string): number {
    let cat = FileTypeCategory.GENERIC_DOC;

    const isDoc = this.findMimeType(['MS_WORD_DOC', 'MS_EXCEL', 'MS_POWERPOINT'], mimeType);
    const isImage = this.findMimeType(['IMAGE_GIF', 'IMAGE_JPG', 'IMAGE_PNG', 'IMAGE_SVG'], mimeType);
    const isPDF = this.findMimeType(['PDF'], mimeType);
    const isAudio = this.findMimeType(['AUDIO_MP4', 'AUDIO_MP3', 'AUDIO_OGG', 'AUDIO_WAVE', 'AUDIO_WAV'], mimeType);
    const isVideo = this.findMimeType([
      'VIDEO_MP4', 'VIDEO_MPEG', 'VIDEO_OGG', 'VIDEO_MOV', 'VIDEO_WEBM', 'VIDEO_AVI', 'VIDEO_WMV'], mimeType);
    const isZip = this.findMimeType(['ZIP'], mimeType);

    if (isDoc) { cat = FileTypeCategory.DOC; }
    if (isImage) { cat = FileTypeCategory.IMAGE; }
    if (isPDF) { cat = FileTypeCategory.PDF; }
    if (isAudio) { cat = FileTypeCategory.AUDIO; }
    if (isVideo) { cat = FileTypeCategory.VIDEO; }
    if (isZip) { cat = FileTypeCategory.ZIP; }

    return cat;
  }

  getAcceptString(typeCats: FileTypeCategory | FileTypeCategory[]): string {
    let acceptString = '';

    if (Array.isArray(typeCats)) {
      typeCats.forEach(t => {
        acceptString = this.setAcceptString(t, acceptString);
      });
    } else {
      acceptString = this.setAcceptString(typeCats, acceptString);
    }

    return acceptString;

  }

  getFileExtensionFromFileName(fileName: string): string {
    const res = fileName.split('.');
    return res[res.length - 1];
  }

  formatFileSize(fileSizeBytes: number): string {
    const i = Math.floor(Math.log(fileSizeBytes) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB'];

    return (fileSizeBytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  private setAcceptString(t: FileTypeCategory, acceptString: string): string {
    switch (t) {
      case FileTypeCategory.DOC:
        acceptString += FILE_TYPES.MS_WORD_DOC.concat(FILE_TYPES.MS_EXCEL, FILE_TYPES.MS_POWERPOINT).join() + ',';
        break;
      case FileTypeCategory.IMAGE:
        acceptString += FILE_TYPES.IMAGE.join() + ',';
        break;
      case FileTypeCategory.PDF:
        acceptString += FILE_TYPES.PDF.join() + ',';
        break;
      case FileTypeCategory.VIDEO:
        acceptString += FILE_TYPES.VIDEO.join() + ',';
        break;
      case FileTypeCategory.AUDIO:
        acceptString += FILE_TYPES.AUDIO.join() + ',';
        break;
      case FileTypeCategory.ZIP:
        acceptString += FILE_TYPES.ZIP.join() + ',';
        break;
    }

    return acceptString;
  }

  private findMimeType(typeNames: string[], mimeType: string): boolean {
    return typeNames.some((type: string) => {
      return FILE_TYPES[type].indexOf(mimeType) !== -1;
    });
  }

}
