import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SbbFileSelectorModule } from '@sbb-esta/angular/file-selector';

/**
 * @title Simple File Selector
 * @order 10
 */
@Component({
  selector: 'sbb-simple-file-selector-example',
  templateUrl: 'simple-file-selector-example.html',
  imports: [SbbFileSelectorModule, JsonPipe],
})
export class SimpleFileSelectorExample {
  filesList: File[] = [];

  fileChanged(filesList: File[]) {
    this.filesList = filesList;
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
}
