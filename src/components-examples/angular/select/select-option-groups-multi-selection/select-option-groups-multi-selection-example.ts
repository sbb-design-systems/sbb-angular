import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

/**
 * @title Select Option Groups Multi Selection
 * @order 60
 */
@Component({
  selector: 'sbb-select-option-groups-multi-selection-example',
  templateUrl: 'select-option-groups-multi-selection-example.html',
})
export class SelectOptionGroupsMultiSelectionExample {
  form = this._formBuilder.group({
    value: [[]],
  });
  foodFromTheWorld: any[] = [
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

  constructor(private _formBuilder: FormBuilder) {}
}
