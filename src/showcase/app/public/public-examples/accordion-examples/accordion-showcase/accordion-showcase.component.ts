import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccordionDirective } from '@sbb-esta/angular-public/accordion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-accordion-showcase',
  templateUrl: './accordion-showcase.component.html',
  styleUrls: ['./accordion-showcase.component.css']
})
export class AccordionShowcaseComponent implements OnInit, OnDestroy {
  @ViewChild(AccordionDirective, { static: true }) firstAccordion: AccordionDirective;

  panelOpenState = false;
  step = 0;
  disabled = false;
  panelMode = 'panel 1';
  panels = ['panel 1', 'panel 2', 'panel 3', 'panel 4', 'panel 5'];
  accordionForm: FormGroup;
  onRadioChange: Subscription;
  onModeChange: Subscription;
  onDisabledChange: Subscription;
  onMultiChange: Subscription;
  onHideToggle: Subscription;
  radioDisable = true;
  multi = false;
  hideToggle = false;

  radioOptions = [
    {
      name: 'Open all',
      value: 'openAll'
    },
    {
      name: 'Close all',
      value: 'closeAll'
    }
  ];

  constructor() {
    this.accordionForm = new FormGroup({
      radioModes: new FormControl({ value: null, disabled: true }),
      disabled: new FormControl(this.disabled),
      multi: new FormControl(this.multi),
      panelMode: new FormControl(this.panelMode),
      hideToggle: new FormControl(this.hideToggle)
    });
  }

  ngOnInit() {
    this.onRadioChange = this.accordionForm.get('radioModes')!.valueChanges.subscribe(value => {
      switch (value) {
        case 'openAll':
          this.firstAccordion.openAll();
          break;
        case 'closeAll':
          this.firstAccordion.closeAll();
          break;
      }
    });

    this.onMultiChange = this.accordionForm.get('multi')!.valueChanges.subscribe(value => {
      this.multi = value;

      if (this.multi === true) {
        this.accordionForm.get('radioModes')!.enable();
        this.accordionForm.get('panelMode')!.disable();
      } else {
        this.accordionForm.get('radioModes')!.disable();
        this.accordionForm.get('panelMode')!.enable();
      }
    });

    this.onDisabledChange = this.accordionForm.get('disabled')!.valueChanges.subscribe(value => {
      this.disabled = value;
    });

    this.onHideToggle = this.accordionForm.get('hideToggle')!.valueChanges.subscribe(value => {
      this.hideToggle = value;
    });

    this.onModeChange = this.accordionForm.get('panelMode')!.valueChanges.subscribe(value => {
      this.panelMode = value;
    });
  }

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

  logAndPreventOpeningPanel(evt: any, message: any) {
    console.log(message);
    evt.preventDefault();
    evt.stopPropagation();
  }

  logAndPreventOpeningPanelKeyDown(evt: KeyboardEvent, message: any) {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      console.log(message);
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

  ngOnDestroy() {
    this.onRadioChange.unsubscribe();
    this.onDisabledChange.unsubscribe();
    this.onMultiChange.unsubscribe();
    this.onHideToggle.unsubscribe();
    this.onModeChange.unsubscribe();
  }
}
