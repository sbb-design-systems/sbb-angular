import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular-core/base';
import { FileSelectorTypesService, FileTypeCategory } from '@sbb-esta/angular-public/file-selector';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-file-selector-showcase',
  templateUrl: './file-selector-showcase.component.html',
  styleUrls: ['./file-selector-showcase.component.css']
})
export class FileSelectorShowcaseComponent implements OnInit, OnDestroy {
  filesList1: File[] = [];

  filesList2: File[] = [];

  filesList3: File[] = [];

  disabled: boolean;

  fileControl = new FormControl();
  fileControlSubscription = Subscription.EMPTY;

  accept: string;

  constructor(private _fileTypeService: FileSelectorTypesService) {
    this.accept = this._fileTypeService.getAcceptString([
      FileTypeCategory.IMAGE,
      FileTypeCategory.ZIP
    ]);
  }

  ngOnInit() {
    this.fileControlSubscription = this.fileControl.valueChanges.subscribe((files: File[]) => {
      this.filesList3 = files;
    });
  }

  ngOnDestroy() {
    this.fileControlSubscription.unsubscribe();
  }

  fileChanged(filesList: File[]) {
    this.filesList1 = filesList;
  }

  beautifyFileList(filesList: File[]) {
    if (!filesList) {
      return undefined;
    }

    return filesList.map(f => {
      return {
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      };
    });
  }

  setDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.fileControl.disable() : this.fileControl.enable();
  }
}
