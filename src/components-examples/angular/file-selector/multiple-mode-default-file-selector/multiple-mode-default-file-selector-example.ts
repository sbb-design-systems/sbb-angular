import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular/checkbox';
import { SbbFileSelectorTypesService } from '@sbb-esta/angular/file-selector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * @title Multiple Mode Default File Selector
 * @order 20
 */
@Component({
  selector: 'sbb-multiple-mode-default-file-selector-example',
  templateUrl: 'multiple-mode-default-file-selector-example.html',
})
export class MultipleModeDefaultFileSelectorExample implements OnInit, OnDestroy {
  filesList: File[] = [];
  fileControl = new FormControl<File[] | null>(null);
  disabled: boolean;
  accept: string;
  private _destroyed = new Subject<void>();

  constructor(private _fileTypeService: SbbFileSelectorTypesService) {
    this.accept = this._fileTypeService.getAcceptString('image', 'zip');
  }

  ngOnInit() {
    this.fileControl.valueChanges.pipe(takeUntil(this._destroyed)).subscribe((files) => {
      this.filesList = files || [];
    });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
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
