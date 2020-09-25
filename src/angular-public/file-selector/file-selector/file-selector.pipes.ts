import { Pipe, PipeTransform } from '@angular/core';

import { SbbFileSelectorTypesService } from './file-selector-types.service';

/**
 * Returns the file extension of the file name in input.
 * @param file File.
 * @returns File extension of the file name in input.
 */
@Pipe({ name: 'fileNameNoExtension' })
export class SbbFileNameNoExtension implements PipeTransform {
  constructor(private _fileTypeService: SbbFileSelectorTypesService) {}

  transform(file: File): string {
    return this._fileTypeService.getFileNameNoExtension(file.name);
  }
}

/**
 * Returns the file extension of the file in input.
 * @param file File.
 * @returns File extension of the file in input.
 */
@Pipe({ name: 'fileExtension' })
export class SbbFileExtension implements PipeTransform {
  constructor(private _fileTypeService: SbbFileSelectorTypesService) {}

  transform(file: File): string {
    return this._fileTypeService.getFileExtensionFromFileName(file.name);
  }
}

/**
 * Returns the file size formatted of the file in input.
 * @param file File.
 * @returns File size formatted of the file in input.
 */
@Pipe({ name: 'fileSizeFormatted' })
export class SbbFileSizeFormatted implements PipeTransform {
  constructor(private _fileTypeService: SbbFileSelectorTypesService) {}

  transform(file: File): string {
    return this._fileTypeService.formatFileSize(file.size);
  }
}
