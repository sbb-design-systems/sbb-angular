import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

import { AbstractConstructor, Constructor } from './constructor';

export const ɵtriggerVariantCheck = new Subject<void>();

/** @docs-private */
export interface HasVariant extends OnInit, OnDestroy {
  readonly variant: Observable<SbbVariant>;
}

/** @docs-private */
export type HasVariantCtor = Constructor<HasVariant>;

/** @docs-private */
export interface HasElementRef {
  _elementRef: ElementRef;
}

/** Possible variant values. */
export type SbbVariant = 'standard' | 'lean' | undefined;

const manualVariantAssignment = new WeakMap<Element, SbbVariant>();

function detectVariant(element: Element): SbbVariant {
  if (element.classList.contains('sbb-lean')) {
    return 'lean';
  }

  if (typeof getComputedStyle !== 'function') {
    return 'standard';
  }

  const styles = getComputedStyle(element);
  const variant =
    styles.getPropertyValue('--sbbVariant') || ((styles as any)['-ie-sbbVariant'] as string);
  return variant === 'lean' ? 'lean' : 'standard';
}

function manageVariant(element: Element): SbbVariant {
  let manualVariant: SbbVariant;
  if (!manualVariantAssignment.has(element)) {
    if (element.classList.contains('sbb-standard')) {
      manualVariant = 'standard';
    } else if (element.classList.contains('sbb-lean')) {
      manualVariant = 'lean';
    }
    manualVariantAssignment.set(element, manualVariant);
  } else {
    manualVariant = manualVariantAssignment.get(element);
  }

  if (manualVariant) {
    return manualVariant;
  }

  element.classList.remove('sbb-standard', 'sbb-lean');
  const variant = detectVariant(element);
  element.classList.add(`sbb-${variant}`);

  return variant;
}

/** Mixin to augment a directive with a variant property. */
export function mixinVariant<T extends AbstractConstructor<HasElementRef>>(
  base: T
): HasVariantCtor & T {
  @Directive()
  class Mixin
    extends ((base as unknown) as Constructor<HasElementRef>)
    implements OnInit, OnDestroy {
    readonly variant: Observable<SbbVariant> = ɵtriggerVariantCheck.pipe(
      startWith(null),
      map(() => manageVariant(this._elementRef.nativeElement)),
      shareReplay()
    );

    private _variantSubscription: Subscription;

    constructor(...args: any[]) {
      super(...args);
    }

    ngOnInit(): void {
      this._variantSubscription = this.variant.subscribe();
    }

    ngOnDestroy(): void {
      this._variantSubscription.unsubscribe();
    }
  }

  // Since we don't directly extend from `base` with it's original types, and we instruct
  // TypeScript that `T` actually is instantiatable through `new`, the types don't overlap.
  // This is a limitation in TS as abstract classes cannot be typed properly dynamically.
  return (Mixin as unknown) as T & Constructor<HasVariant>;
}
