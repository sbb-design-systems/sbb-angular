import { Overlay } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import {
  SBB_TOOLTIP_SCROLL_STRATEGY,
  TooltipBase,
  TooltipRegistryService
} from '@sbb-esta/angular-core/base';

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent extends TooltipBase {
  constructor(
    overlay: Overlay,
    tooltipRegistry: TooltipRegistryService,
    @Inject(SBB_TOOLTIP_SCROLL_STRATEGY) scrollStrategy,
    @Optional() @Inject(DOCUMENT) document: any,
    zone: NgZone,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(overlay, tooltipRegistry, document, zone, changeDetectorRef, scrollStrategy);
  }
}
