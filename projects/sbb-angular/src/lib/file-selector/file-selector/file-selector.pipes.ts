import { Pipe, PipeTransform } from '@angular/core';
import { FileSelectorTypesService } from './file-selector-types.service';

/**
 * Returns the file extension of the file name in input.
 * @param file File.
 * @returns File extension of the file name in input.
 */
@Pipe({ name: 'getFileNameNoExtension' })
export class GetFileNameNoExtension implements PipeTransform {

    constructor(private _fileTypeService: FileSelectorTypesService) { }

    transform(file: File): string {

        return this._fileTypeService.getFileNameNoExtension(file.name);
    }
}

/**
 * Returns the file extension of the file in input.
 * @param file File.
 * @returns File extension of the file in input.
 */
@Pipe({ name: 'getFileExtension' })
export class GetFileExtension implements PipeTransform {

    constructor(private _fileTypeService: FileSelectorTypesService) { }

    transform(file: File): string {

        return this._fileTypeService.getFileExtensionFromFileName(file.name);
    }
}

/**
 * Returns the file size formatted of the file in input.
 * @param file File.
 * @returns File size formatted of the file in input.
 */
@Pipe({ name: 'getFileSizeFormatted' })
export class GetFileSizeFormatted implements PipeTransform {

    constructor(private _fileTypeService: FileSelectorTypesService) { }

    transform(file: File): string {

        return this._fileTypeService.formatFileSize(file.size);
    }
}


