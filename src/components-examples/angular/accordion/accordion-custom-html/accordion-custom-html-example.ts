import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';

/**
 * @title Custom HTML Panel
 * @order 50
 */
@Component({
  selector: 'sbb-accordion-custom-html-example',
  templateUrl: 'accordion-custom-html-example.html',
  styleUrls: ['accordion-custom-html-example.css'],
  imports: [SbbAccordionModule, SbbButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionCustomHtmlExample {
  logAndPreventOpeningPanel(evt: any) {
    console.log('Button clicked and prevented panel to open');
    evt.stopPropagation();
  }
}
