import { Type } from '@angular/core';

export abstract class ExampleProvider {
  abstract resolveExample<TComponent = any>(component: string): Type<TComponent>;
}
