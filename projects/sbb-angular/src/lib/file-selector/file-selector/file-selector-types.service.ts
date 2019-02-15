import { Injectable } from '@angular/core';
import { FileTypeCategory, FILE_TYPES } from './file-selector-base';

@Injectable({
  providedIn: 'root'
})
export class FileSelectorTypesService {

  getFileTypeCategoryByMimeType(mimeType: string): FileTypeCategory {

    for (const fileTypeCat in FileTypeCategory) {
      if (this.findMimeType(this.getFileFormats(Number(fileTypeCat)), mimeType)) {
        return Number(fileTypeCat);
      }
    }

    return FileTypeCategory.GENERIC_DOC;
  }

  getAcceptString(typeCats: FileTypeCategory | FileTypeCategory[]): string {

    if (Array.isArray(typeCats)) {
      return typeCats.reduce((current, next) => this.setAcceptString(next, current), '');
    } else {
      return this.setAcceptString(typeCats, '');
    }

  }

  getFileExtensionFromFileName(fileName: string): string {
    const res = fileName.split('.');
    return res[res.length - 1];
  }

  getFileNameNoExtension(fileName: string): string {
    const res = fileName.split('.');
    res.pop();
    return res.join('');
  }

  formatFileSize(fileSizeBytes: number): string {
    let res = '';

    if (fileSizeBytes) {
      const i = Math.floor(Math.log(fileSizeBytes) / Math.log(1024));
      const sizes = ['B', 'KB', 'MB', 'GB'];

      res = Math.round(fileSizeBytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }

    return res;
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

  private getFileFormats(formatType: FileTypeCategory): string[] {

    let typeFormats: string[] = [];

    switch (formatType) {
      case FileTypeCategory.DOC:
        typeFormats = ['MS_WORD_DOC', 'MS_EXCEL', 'MS_POWERPOINT'];
        break;
      case FileTypeCategory.AUDIO:
        typeFormats = ['AUDIO_MP4', 'AUDIO_MP3', 'AUDIO_OGG', 'AUDIO_WAVE', 'AUDIO_WAV'];
        break;
      case FileTypeCategory.IMAGE:
        typeFormats = ['IMAGE_GIF', 'IMAGE_JPG', 'IMAGE_PNG', 'IMAGE_SVG'];
        break;
      case FileTypeCategory.PDF:
        typeFormats = ['PDF'];
        break;
      case FileTypeCategory.VIDEO:
        typeFormats = ['VIDEO_MP4', 'VIDEO_MPEG', 'VIDEO_OGG', 'VIDEO_MOV', 'VIDEO_WEBM', 'VIDEO_AVI', 'VIDEO_WMV'];
        break;
      case FileTypeCategory.ZIP:
        typeFormats = ['ZIP'];
        break;
    }

    return typeFormats;
  }

}
