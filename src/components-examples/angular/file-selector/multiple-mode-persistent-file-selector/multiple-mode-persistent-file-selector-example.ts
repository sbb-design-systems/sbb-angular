import { Component } from '@angular/core';

/**
 * @title Multiple Mode Persistent File Selector
 * @order 30
 */
@Component({
  selector: 'sbb-multiple-mode-persistent-file-selector-example',
  templateUrl: './multiple-mode-persistent-file-selector-example.html',
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
