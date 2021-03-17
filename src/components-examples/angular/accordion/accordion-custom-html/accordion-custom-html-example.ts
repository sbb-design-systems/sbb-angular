import { Component } from '@angular/core';

/**
 * @title Custom HTML Panel
 * @order 40
 */
@Component({
  selector: 'sbb-accordion-custom-html-example',
  templateUrl: './accordion-custom-html-example.html',
  styleUrls: ['./accordion-custom-html-example.css'],
})
export class AccordionCustomHtmlExample {
  logAndPreventOpeningPanel(evt: any) {
    console.log('Button clicked and prevented panel to open');
    evt.preventDefault();
    evt.stopPropagation();
  }
}
