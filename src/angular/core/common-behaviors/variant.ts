import { ElementRef } from '@angular/core';

import { Constructor } from './constructor';

/** @docs-private */
export interface HasVariant {
  readonly variant: Variants;
}

/** @docs-private */
export type HasVariantCtor = Constructor<HasVariant>;

/** @docs-private */
export interface HasElementRef {
  _elementRef: ElementRef;
}

/** Possible variant values. */
export type Variants = 'website' | 'webapp' | undefined;

function detectVariant(element: Element): Variants {
  if (element.classList.contains('sbb-webapp')) {
    return 'webapp';
  }

  if (typeof getComputedStyle !== 'function') {
    return 'website';
  }

  const styles = getComputedStyle(element);
  const variant =
    styles.getPropertyValue('--sbbMode') || ((styles as any)['-ie-sbbMode'] as string);
  return variant === 'webapp' ? 'webapp' : 'website';
}

/** Mixin to augment a directive with a variant property. */
export function mixinVariant<T extends Constructor<HasElementRef>>(base: T): HasVariantCtor & T {
  return class extends base {
    readonly variant: Variants;

    constructor(...args: any[]) {
      super(...args);
      this.variant = detectVariant(this._elementRef.nativeElement);
    }
  };
}
