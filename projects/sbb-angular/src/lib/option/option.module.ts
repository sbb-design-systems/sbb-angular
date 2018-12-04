import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightPipe } from './option/highlight.pipe';
import { OptionComponent } from './option/option.component';
import { OptionGroupComponent } from './option-group/option-group.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OptionComponent,
    OptionGroupComponent,
    HighlightPipe
  ],
  exports: [
    OptionComponent,
    OptionGroupComponent,
    HighlightPipe
  ]
})
export class OptionModule { }
