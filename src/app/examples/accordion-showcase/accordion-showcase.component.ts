import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-accordion-showcase',
  templateUrl: './accordion-showcase.component.html',
  styleUrls: ['./accordion-showcase.component.scss']
})
export class AccordionShowcaseComponent {

  panelOpenState = false;
  step = 0;
  disabled = false;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  log(...args: any[]) {
    console.log(args);
  }

  logAndPreventOpeningPanel(evt, message) {
    console.log(message);
    evt.preventDefault();
    evt.stopPropagation();
  }

  logAndPreventOpeningPanelKeyDown(evt: KeyboardEvent, message) {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      console.log(message);
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

}
