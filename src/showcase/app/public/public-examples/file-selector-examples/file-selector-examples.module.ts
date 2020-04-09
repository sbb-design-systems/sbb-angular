import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FileSelectorModule } from '@sbb-esta/angular-public/file-selector';

import { FileSelectorExampleComponent } from './file-selector-example/file-selector-example.component';

const EXAMPLES = [FileSelectorExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, FileSelectorModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class FileSelectorExamplesModule {}
