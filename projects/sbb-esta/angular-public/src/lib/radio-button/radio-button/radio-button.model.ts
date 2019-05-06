import { Input } from '@angular/core';

export abstract class RadioButton {
  @Input() name: string;
  @Input() value: any;

  abstract uncheck();
}
