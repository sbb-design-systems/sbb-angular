import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FileSelectorModule } from '@sbb-esta/angular-public/file-selector';

import { MultipleModeDefaultFileSelectorExampleComponent } from './multiple-mode-default-file-selector-example/multiple-mode-default-file-selector-example.component';
import { MultipleModePersistentFileSelectorExampleComponent } from './multiple-mode-persistent-file-selector-example/multiple-mode-persistent-file-selector-example.component';
import { SimpleFileSelectorExampleComponent } from './simple-file-selector-example/simple-file-selector-example.component';

const EXAMPLES = [
  SimpleFileSelectorExampleComponent,
  MultipleModeDefaultFileSelectorExampleComponent,
  MultipleModePersistentFileSelectorExampleComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, FileSelectorModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class FileSelectorExamplesModule {}
