import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

/**
 * @title Basic Accordion
 * @order 20
 */
@Component({
  selector: 'sbb-accordion-basic-example',
  templateUrl: 'accordion-basic-example.html',
  styleUrls: ['accordion-basic-example.css'],
  imports: [
    SbbAccordionModule,
    SbbCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
