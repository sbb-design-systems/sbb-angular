import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbFileSelectorModule } from '@sbb-esta/angular-public/file-selector';

import { provideExamples } from '../../../shared/example-provider';

import { MultipleModeDefaultFileSelectorExampleComponent } from './multiple-mode-default-file-selector-example/multiple-mode-default-file-selector-example.component';
import { MultipleModePersistentFileSelectorExampleComponent } from './multiple-mode-persistent-file-selector-example/multiple-mode-persistent-file-selector-example.component';
import { SimpleFileSelectorExampleComponent } from './simple-file-selector-example/simple-file-selector-example.component';

const EXAMPLES = [
  MultipleModeDefaultFileSelectorExampleComponent,
  MultipleModePersistentFileSelectorExampleComponent,
  SimpleFileSelectorExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-file-selector-example': SimpleFileSelectorExampleComponent,
  'multiple-mode-default-file-selector-example': MultipleModeDefaultFileSelectorExampleComponent,
  'multiple-mode-persistent-file-selector-example': MultipleModePersistentFileSelectorExampleComponent,
};

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
  providers: [provideExamples('public', 'file-selector', EXAMPLE_INDEX)],
})
export class FileSelectorExamplesModule {}
