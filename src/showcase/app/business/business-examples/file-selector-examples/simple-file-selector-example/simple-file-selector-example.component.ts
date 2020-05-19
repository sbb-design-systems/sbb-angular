import { Component } from '@angular/core';

@Component({
  selector: 'sbb-simple-file-selector-example',
  templateUrl: './simple-file-selector-example.component.html',
})
export class SimpleFileSelectorExampleComponent {
  filesList: File[] = [];

  fileChanged(filesList: File[]) {
    this.filesList = filesList;
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
}
