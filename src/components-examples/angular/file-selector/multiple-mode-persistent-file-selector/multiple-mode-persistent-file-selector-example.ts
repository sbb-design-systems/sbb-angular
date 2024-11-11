import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFileSelectorModule } from '@sbb-esta/angular/file-selector';

/**
 * @title Multiple Mode Persistent File Selector
 * @order 30
 */
@Component({
  selector: 'sbb-multiple-mode-persistent-file-selector-example',
  templateUrl: 'multiple-mode-persistent-file-selector-example.html',
  imports: [SbbFileSelectorModule, FormsModule, SbbCheckboxModule, JsonPipe],
})
export class MultipleModePersistentFileSelectorExample {
  filesList: File[] = [];

  disabled: boolean;

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
