import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccordionDirective } from '@sbb-esta/angular-business/accordion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-basic-accordion-example',
  templateUrl: './basic-accordion-example.component.html',
  styleUrls: ['./basic-accordion-example.component.css'],
})
export class BasicAccordionExampleComponent implements OnInit, OnDestroy {
  @ViewChild(AccordionDirective, { static: true }) firstAccordion: AccordionDirective;

  panelOpenState = false;
  disabled = false;
  panelMode = 'panel 1';
  panels = ['panel 1', 'panel 2', 'panel 3', 'panel 4', 'panel 5'];
  multiValue = false;
  accordionForm: FormGroup;
  onModeChange: Subscription;
  onDisabledChange: Subscription;
  onHideToggle: Subscription;
  hideToggle = false;

  radioOptions = [
    {
      name: 'Open all',
      value: 'openAll',
    },
    {
      name: 'Close all',
      value: 'closeAll',
    },
  ];

  constructor() {
    this.accordionForm = new FormGroup({
      disabled: new FormControl(this.disabled),
      panelMode: new FormControl(this.panelMode),
      hideToggle: new FormControl(this.hideToggle),
    });
  }

  ngOnInit() {
    this.onDisabledChange = this.accordionForm.get('disabled')!.valueChanges.subscribe((value) => {
      this.disabled = value;
    });

    this.onHideToggle = this.accordionForm.get('hideToggle')!.valueChanges.subscribe((value) => {
      this.hideToggle = value;
    });

    this.onModeChange = this.accordionForm.get('panelMode')!.valueChanges.subscribe((value) => {
      this.panelMode = value;
    });
  }

  toggleRadio(event) {
    switch (event.value) {
      case 'openAll':
        this.firstAccordion.openAll();
        break;
      case 'closeAll':
        this.firstAccordion.closeAll();
        break;
    }
  }

  log(...args: any[]) {
    console.log(args);
  }

  logAndPreventOpeningPanel(evt: any, message: any) {
    console.log(message);
    evt.preventDefault();
    evt.stopPropagation();
  }

  ngOnDestroy() {
    this.onDisabledChange.unsubscribe();
    this.onHideToggle.unsubscribe();
    this.onModeChange.unsubscribe();
  }
}
