import { Component } from '@angular/core';
import { FileSelectorTypesService, FileTypeCategory } from 'projects/sbb-angular/src/lib/file-selector/file-selector';

@Component({
  selector: 'sbb-file-selector-showcase',
  templateUrl: './file-selector-showcase.component.html',
  styleUrls: ['./file-selector-showcase.component.scss']
})
export class FileSelectorShowcaseComponent {

  accept: string;

  constructor(private _fileTypeService: FileSelectorTypesService) {
    this.accept = this._fileTypeService.getAcceptString([FileTypeCategory.IMAGE, FileTypeCategory.ZIP]);
  }

}
