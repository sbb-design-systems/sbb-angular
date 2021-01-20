import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { HasVariant, HasVariantCtor, mixinVariant } from '@sbb-esta/angular/core';

// Boilerplate for applying mixins to SbbLoading.
/** @docs-private */
class SbbLoadingBase {
  constructor(public _elementRef: ElementRef) {}
}

// tslint:disable-next-line: naming-convention
const _SbbLoadingMixinBase: HasVariantCtor & typeof SbbLoadingBase = mixinVariant(SbbLoadingBase);

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-loading',
    role: 'progressbar',
    '[attr.aria-busy]': 'true',
    '[class.sbb-loading-tiny]': `this.mode === 'tiny'`,
    '[class.sbb-loading-small]': `this.mode === 'small'`,
    '[class.sbb-loading-medium]': `this.mode === 'medium'`,
    '[class.sbb-loading-big]': `this.mode === 'big'`,
    '[class.sbb-loading-fullscreen]': `this.mode === 'fullscreen'`,
    '[class.sbb-loading-fullbox]': `this.mode === 'fullbox'`,
    '[class.sbb-loading-inline]': `this.mode === 'inline'`,
  },
})
export class SbbLoading extends _SbbLoadingMixinBase implements HasVariant {
  /** Types of mode for loading indicator. */
  @Input() mode: 'tiny' | 'small' | 'medium' | 'big' | 'fullscreen' | 'fullbox' | 'inline' =
    'medium';

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode:
    | 'tiny'
    | 'small'
    | 'medium'
    | 'big'
    | 'fullscreen'
    | 'fullbox'
    | 'inline'
    | string
    | null
    | undefined;
  // tslint:enable: member-ordering
}
