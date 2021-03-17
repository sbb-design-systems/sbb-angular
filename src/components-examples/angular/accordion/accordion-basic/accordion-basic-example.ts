import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbAccordion } from '@sbb-esta/angular/accordion';

/**
 * @title Basic Accordion
 * @order 20
 */
@Component({
  selector: 'sbb-accordion-basic-example',
  templateUrl: './accordion-basic-example.html',
  styleUrls: ['./accordion-basic-example.css'],
})
export class AccordionBasicExample {
  multi = new FormControl(false);
  hideToggle = new FormControl(false);
  disabled = new FormControl(false);
  firstPanelExpanded = false;
  secondPanelExpanded = false;

  log(...args: any[]) {
    console.log(args);
  }
}
