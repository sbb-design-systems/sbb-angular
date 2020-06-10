import { ComponentType } from '@angular/cdk/portal';
import { InjectionToken, ValueProvider } from '@angular/core';

export const EXAMPLES = new InjectionToken<ExampleProvider[]>('EXAMPLES');

export function provideExamples(
  library: string,
  moduleName: string,
  examples: { [key: string]: ComponentType<any> }
): ValueProvider {
  return {
    provide: EXAMPLES,
    multi: true,
    useValue: new ExampleProvider(library, moduleName, examples),
  };
}

export class ExampleProvider {
  constructor(
    readonly library: string,
    readonly moduleName: string,
    readonly examples: { [key: string]: ComponentType<any> }
  ) {}
}
