import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/**
 * @title Basic Accordion
 * @order 20
 */
@Component({
  selector: 'sbb-accordion-basic-example',
  templateUrl: 'accordion-basic-example.html',
  styleUrls: ['accordion-basic-example.css'],
})
export class AccordionBasicExample {
  multi = new UntypedFormControl(false);
  hideToggle = new UntypedFormControl(false);
  disabled = new UntypedFormControl(false);
  firstPanelExpanded = false;
  secondPanelExpanded = false;

  log(...args: any[]) {
    console.log(args);
  }
}
