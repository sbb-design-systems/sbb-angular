import { ComponentPortal } from '@angular/cdk/portal';

export abstract class ExampleProvider {
  abstract resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } | null;
}
