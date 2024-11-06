import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';

/**
 * @title Simple Panel
 * @order 10
 */
@Component({
  selector: 'sbb-accordion-simple-panel-example',
  templateUrl: 'accordion-simple-panel-example.html',
  imports: [SbbAccordionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionSimplePanelExample {}
