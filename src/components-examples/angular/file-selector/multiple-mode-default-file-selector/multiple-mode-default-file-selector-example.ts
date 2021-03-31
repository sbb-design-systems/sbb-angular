import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular-public/checkbox';
import { FileTypeCategory, SbbFileSelectorTypesService } from '@sbb-esta/angular/file-selector';
import { Subscription } from 'rxjs';

/**
 * @title Multiple Mode Default File Selector
 * @order 20
 */
@Component({
  selector: 'sbb-multiple-mode-default-file-selector-example',
  templateUrl: './multiple-mode-default-file-selector-example.html',
})
export class MultipleModeDefaultFileSelectorExample implements OnInit, OnDestroy {
  filesList: File[] = [];

  disabled: boolean;

  fileControl = new FormControl();
  fileControlSubscription = Subscription.EMPTY;

  accept: string;

  constructor(private _fileTypeService: SbbFileSelectorTypesService) {
    this.accept = this._fileTypeService.resolveAcceptString([
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
    if (!filesList) {
      return [];
    }
    return filesList.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
    }));
  }

  setDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.fileControl.disable() : this.fileControl.enable();
  }
}
