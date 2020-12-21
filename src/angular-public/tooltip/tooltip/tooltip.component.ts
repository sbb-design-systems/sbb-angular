import { Overlay } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import {
  SbbTooltipBase,
  SbbTooltipRegistryService,
  SBB_TOOLTIP_SCROLL_STRATEGY,
} from '@sbb-esta/angular-core/base/tooltip';

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-tooltip',
    '[attr.id]': 'this.id',
    '[attr.aria-expanded]': 'this.overlayAttached',
  },
})
export class SbbTooltipComponent extends SbbTooltipBase {
  constructor(
    overlay: Overlay,
    tooltipRegistry: SbbTooltipRegistryService,
    @Inject(SBB_TOOLTIP_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() @Inject(DOCUMENT) document: any,
    zone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef
  ) {
    super(overlay, tooltipRegistry, document, zone, changeDetectorRef, elementRef, scrollStrategy);
  }
}
