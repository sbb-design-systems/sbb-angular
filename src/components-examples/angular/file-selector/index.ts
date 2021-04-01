import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFileSelectorModule } from '@sbb-esta/angular/file-selector';

import { MultipleModeDefaultFileSelectorExample } from './multiple-mode-default-file-selector/multiple-mode-default-file-selector-example';
import { MultipleModePersistentFileSelectorExample } from './multiple-mode-persistent-file-selector/multiple-mode-persistent-file-selector-example';
import { SimpleFileSelectorExample } from './simple-file-selector/simple-file-selector-example';

export {
  MultipleModeDefaultFileSelectorExample,
  MultipleModePersistentFileSelectorExample,
  SimpleFileSelectorExample,
};

const EXAMPLES = [
  MultipleModeDefaultFileSelectorExample,
  MultipleModePersistentFileSelectorExample,
  SimpleFileSelectorExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbFileSelectorModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class FileSelectorExamplesModule {}
