import { NgModule } from '@angular/core';
import { SbbAngularComponent } from './sbb-angular.component';
import { TextAreaModule } from './textarea/text-area.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [TextAreaModule, FormsModule, ReactiveFormsModule, CommonModule],
  declarations: [SbbAngularComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, TextAreaModule]
})
export class SbbAngularModule { }
