import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbAccordion } from '@sbb-esta/angular-business/accordion';

@Component({
  selector: 'sbb-basic-accordion-example',
  templateUrl: './basic-accordion-example.component.html',
  styleUrls: ['./basic-accordion-example.component.css'],
})
export class BasicAccordionExampleComponent {
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

  logAndPreventOpeningPanel(evt: any, message: any) {
    console.log(message);
    evt.preventDefault();
    evt.stopPropagation();
  }
}
