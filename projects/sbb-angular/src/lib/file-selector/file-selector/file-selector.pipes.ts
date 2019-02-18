import { Pipe, PipeTransform } from '@angular/core';
import { FileSelectorTypesService } from './file-selector-types.service';

/**
 * Returns the file extension of the file name in input.
 * @param file File.
 * @returns File extension of the file name in input.
 */
@Pipe({ name: 'FileNameNoExtension' })
export class FileNameNoExtension implements PipeTransform {

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
@Pipe({ name: 'FileExtension' })
export class FileExtension implements PipeTransform {

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
@Pipe({ name: 'FileSizeFormatted' })
export class FileSizeFormatted implements PipeTransform {

    constructor(private _fileTypeService: FileSelectorTypesService) { }

    transform(file: File): string {

        return this._fileTypeService.formatFileSize(file.size);
    }
}


