import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';

/**
 * @title Nested Panel With Lazy Loaded Content
 * @order 40
 */
@Component({
  selector: 'sbb-accordion-nested-panel-lazy-content-example',
  templateUrl: 'accordion-nested-panel-lazy-content-example.html',
  standalone: true,
  imports: [SbbAccordionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionNestedPanelLazyContentExample {}
