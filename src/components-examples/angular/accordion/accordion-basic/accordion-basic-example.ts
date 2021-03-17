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
  @ViewChild(SbbAccordion, { static: true }) firstAccordion: SbbAccordion;

  disabled = new FormControl(false);
  panelMode = new FormControl('panel 1');
  hideToggle = new FormControl(false);
  panelOpenState = false;
  panels = ['panel 1', 'panel 2', 'panel 3', 'panel 4', 'panel 5'];
  multi = false;

  log(...args: any[]) {
    console.log(args);
  }
}
