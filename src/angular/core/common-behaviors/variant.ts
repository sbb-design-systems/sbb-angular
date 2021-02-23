import { BehaviorSubject, Observable } from 'rxjs';

import { AbstractConstructor, Constructor } from './constructor';

export const ɵvariant = new BehaviorSubject<SbbVariant>(detectVariant());

/** @docs-private */
export interface HasVariant {
  /** Observable holding current variant (`lean` or `standard`) which emits by change */
  readonly variant: Observable<SbbVariant>;
}

/** @docs-private */
export type HasVariantCtor = Constructor<HasVariant>;

/** Possible variant values. */
export type SbbVariant = 'standard' | 'lean';

function detectVariant(): SbbVariant {
  return document.documentElement.classList.contains('sbb-lean') ? 'lean' : 'standard';
}

/** Mixin to augment a directive with a variant property. */
export function mixinVariant<T extends AbstractConstructor<any>>(base: T): HasVariantCtor & T {
  class Mixin extends ((base as unknown) as Constructor<any>) {
    readonly variant: Observable<SbbVariant> = ɵvariant;

    constructor(...args: any[]) {
      super(...args);
    }
  }

  // Since we don't directly extend from `base` with it's original types, and we instruct
  // TypeScript that `T` actually is instantiatable through `new`, the types don't overlap.
  // This is a limitation in TS as abstract classes cannot be typed properly dynamically.
  return (Mixin as unknown) as T & Constructor<HasVariant>;
}
