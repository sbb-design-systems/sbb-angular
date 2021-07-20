import { BehaviorSubject, Observable } from 'rxjs';

import { AbstractConstructor, Constructor } from './constructor';

export const ɵvariant = new BehaviorSubject<SbbVariant>(detectVariant());

/** @docs-private */
export interface HasVariant {
  /** Observable holding current variant (`lean` or `standard`) which emits by change */
  readonly variant: Observable<SbbVariant>;
}

/** Possible variant values. */
export type SbbVariant = 'standard' | 'lean';

function detectVariant(): SbbVariant {
  return document.documentElement.classList.contains('sbb-lean') ? 'lean' : 'standard';
}

/** Mixin to augment a directive with a variant property. */
export function mixinVariant<T extends AbstractConstructor<any>>(
  base: T
): AbstractConstructor<HasVariant> & T;
export function mixinVariant<T extends Constructor<any>>(base: T): Constructor<HasVariant> & T {
  return class extends base {
    readonly variant: Observable<SbbVariant> = ɵvariant;

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
