import { Injectable } from '@angular/core';

import { FileTypeCategory, SBB_CATEGORY_MIME_TYPES, SBB_FILE_TYPES } from './file-selector-base';

@Injectable({
  providedIn: 'root',
})
export class SbbFileSelectorTypesService {
  /**
   * Returns the file type category/ies from given mime type.
   * @param mimeType Mime type of a file.
   * @returns File type category/ies.
   */
  getFileTypeCategoryByMimeType(mimeType: string): FileTypeCategory {
    return (
      Array.from(SBB_CATEGORY_MIME_TYPES).find(
        ([_f, mimeTypes]) => mimeTypes.indexOf(mimeType) >= 0
      )?.[0] ?? 'generic'
    );
  }

  /**
   * Returns all accepted formats.
   * @param typeCats File type category/ies.
   * @returns All formats accepted.
   */
  getAcceptString(...typeCats: FileTypeCategory[] | FileTypeCategory[][]): string {
    return (typeCats as FileTypeCategory[][])
      .reduce((current, next) => current.concat(next), [] as FileTypeCategory[])
      .map((t) => this._buildAcceptString(t))
      .filter((a) => !!a)
      .join(',');
  }

  /**
   * Returns the file extension from the given file name.
   * Returns empty string, if the file name has no extension or has the pattern '.name'.
   * @param fileName File name.
   * @return File with the name in input.
   */
  fileExtension(fileName: string): string {
    const res = fileName.split('.');
    return res.length === 1 || (res.length === 2 && res[0] === '') ? '' : res.pop()!;
  }

  /**
   * Returns the file extension of the file with name in input.
   * @param fileName File name.
   * @returns File extension.
   */
  removeFileExtension(fileName: string): string {
    const extension = this.fileExtension(fileName);
    return !extension ? fileName : fileName.substring(0, fileName.length - extension.length - 1);
  }

  /**
   * Returns the file size with the correct unit of measure.
   * @param bytes File size in bytes.
   * @returns File size with the correct unit of measure.
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
  }

  private _buildAcceptString(fileTypeCategory: FileTypeCategory): string {
    switch (fileTypeCategory) {
      case 'doc':
        return SBB_FILE_TYPES.MS_WORD_DOC.concat(
          SBB_FILE_TYPES.MS_EXCEL,
          SBB_FILE_TYPES.MS_POWERPOINT
        ).join(',');
      case 'image':
        return SBB_FILE_TYPES.IMAGE.join(',');
      case 'pdf':
        return SBB_FILE_TYPES.PDF.join(',');
      case 'video':
        return SBB_FILE_TYPES.VIDEO.join(',');
      case 'audio':
        return SBB_FILE_TYPES.AUDIO.join(',');
      case 'zip':
        return SBB_FILE_TYPES.ZIP.join(',');
      default:
        return '';
    }
  }
}
