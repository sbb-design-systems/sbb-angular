import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDirective } from './input/input.directive';

@NgModule({
  declarations: [InputDirective],
  imports: [CommonModule],
  exports: [InputDirective]
})
export class InputModule { }
