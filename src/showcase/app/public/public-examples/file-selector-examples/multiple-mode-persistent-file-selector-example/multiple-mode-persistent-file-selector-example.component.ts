import { Component } from '@angular/core';

@Component({
  selector: 'sbb-multiple-mode-persistent-file-selector-example',
  templateUrl: './multiple-mode-persistent-file-selector-example.component.html'
})
export class MultipleModePersistentFileSelectorExampleComponent {
  filesList: File[] = [];

  disabled: boolean;

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
}
