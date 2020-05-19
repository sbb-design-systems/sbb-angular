import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-option-groups-multi-selection-example',
  templateUrl: './select-option-groups-multi-selection-example.component.html',
})
export class SelectOptionGroupsMultiSelectionExampleComponent {
  form: FormGroup;
  foodFromTheWorld = [
    {
      nation: 'Italy',
      food: [
        { value: 'lasagna', viewValue: 'Lasagna' },
        { value: 'parmigiana', viewValue: 'Parmigiana' },
        { value: 'pasta', viewValue: 'Pasta' },
      ],
    },
    {
      nation: 'Germany',
      food: [
        { value: 'weißwurst', viewValue: 'Weißwurst' },
        { value: 'eisbein', viewValue: 'Eisbein' },
        { value: 'rheinische-muscheln', viewValue: 'Rheinische Muscheln' },
      ],
    },
    {
      nation: 'Switzerland',
      food: [
        { value: 'birchermüesli', viewValue: 'Birchermüesli' },
        { value: 'rösti', viewValue: 'Rösti' },
        { value: 'bündnernusstorte', viewValue: 'Bündnernusstorte' },
      ],
    },
  ];

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: [[]],
    });
  }
}
