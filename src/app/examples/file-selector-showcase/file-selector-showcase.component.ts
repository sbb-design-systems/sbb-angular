import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileSelectorTypesService, FileTypeCategory } from 'projects/sbb-angular/src/lib/file-selector/file-selector';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-file-selector-showcase',
  templateUrl: './file-selector-showcase.component.html',
  styleUrls: ['./file-selector-showcase.component.scss']
})
export class FileSelectorShowcaseComponent implements OnInit, OnDestroy {

  filesList1: File[] = [];

  filesList2: File[] = [];

  filesList3: File[] = [];

  disabled:boolean;

  fileControl = new FormControl();
  fileControlSubscription = Subscription.EMPTY;

  accept: string;

  constructor(private _fileTypeService: FileSelectorTypesService) {
    this.accept = this._fileTypeService.getAcceptString([FileTypeCategory.IMAGE, FileTypeCategory.ZIP]);
  }

  ngOnInit() {
    this.fileControlSubscription = this.fileControl
      .valueChanges
      .subscribe(
        (files: File[]) => {
          this.filesList3 = files;
        }
      );
  }

  ngOnDestroy() {
    this.fileControlSubscription.unsubscribe();
  }

  fileChanged(filesList: File[]) {
    this.filesList1 = filesList;
  }

  beautifyFileList(filesList: File[]) {
    if (filesList) {
      return filesList.map(f => {
        return {
          name: f.name,
          size: f.size,
          type: f.type,
          lastModified: f.lastModified
        };
      });
    }
  }

  setDisabled($event:any) {

    $event.target.checked ? this.fileControl.disable() : this.fileControl.enable();
  }

}
