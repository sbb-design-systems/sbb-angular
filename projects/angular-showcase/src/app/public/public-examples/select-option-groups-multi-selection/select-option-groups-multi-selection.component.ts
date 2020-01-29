import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-option-groups-multi-selection',
  templateUrl: './select-option-groups-multi-selection.component.html',
  styleUrls: ['./select-option-groups-multi-selection.component.scss']
})
export class SelectOptionGroupsMultiSelectionComponent {
  form: FormGroup;
  foodFromTheWorld = [
    {
      nation: 'Italien',
      food: [
        { value: 'lasagna', viewValue: 'Lasagna' },
        { value: 'parmigiana', viewValue: 'Parmigiana' },
        { value: 'krm', viewValue: 'Kartoffeln, Reis und Muscheln' }
      ]
    },
    {
      nation: 'Deutschland',
      food: [
        { value: 'weißwurst', viewValue: 'Weißwurst' },
        { value: 'eisbein', viewValue: 'Eisbein' },
        { value: 'rheinische-muscheln', viewValue: 'Rheinische Muscheln' }
      ]
    },
    {
      nation: 'Swiss',
      food: [
        { value: 'bircherműesli', viewValue: 'Bircherműesli' },
        { value: 'rösti', viewValue: 'Rösti' },
        { value: 'bűndnernusstorte', viewValue: 'Bűndnernusstorte' }
      ]
    }
  ];

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: [[]]
    });
  }
}
