import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbbFieldComponent } from './sbb-field/sbb-field.component';
import { FormErrorComponent } from './form-error/form-error.component';
import { SbbLabelComponent } from './sbb-label/sbb-label.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SbbFieldComponent, FormErrorComponent, SbbLabelComponent],
  exports: [SbbFieldComponent, FormErrorComponent, SbbLabelComponent]
})
export class FieldModule { }
