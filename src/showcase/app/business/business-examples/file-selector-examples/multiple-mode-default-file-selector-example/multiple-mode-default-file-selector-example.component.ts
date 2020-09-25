import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular-business/checkbox';
import {
  FileTypeCategory,
  SbbFileSelectorTypesService,
} from '@sbb-esta/angular-business/file-selector';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-multiple-mode-default-file-selector-example',
  templateUrl: './multiple-mode-default-file-selector-example.component.html',
})
export class MultipleModeDefaultFileSelectorExampleComponent implements OnInit, OnDestroy {
  filesList: File[] = [];

  disabled: boolean;

  fileControl = new FormControl();
  fileControlSubscription = Subscription.EMPTY;

  accept: string;

  constructor(private _fileTypeService: SbbFileSelectorTypesService) {
    this.accept = this._fileTypeService.getAcceptString([
      FileTypeCategory.IMAGE,
      FileTypeCategory.ZIP,
    ]);
  }

  ngOnInit() {
    this.fileControlSubscription = this.fileControl.valueChanges.subscribe((files: File[]) => {
      this.filesList = files;
    });
  }

  ngOnDestroy() {
    this.fileControlSubscription.unsubscribe();
  }

  beautifyFileList(filesList: File[]) {
    if (filesList) {
      return filesList.map((f) => {
        return {
          name: f.name,
          size: f.size,
          type: f.type,
          lastModified: f.lastModified,
        };
      });
    }
  }

  setDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.fileControl.disable() : this.fileControl.enable();
  }
}
