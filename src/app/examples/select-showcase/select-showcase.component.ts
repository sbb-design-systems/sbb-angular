import { Component, OnInit } from '@angular/core';

export interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'sbb-select-showcase',
  templateUrl: './select-showcase.component.html',
  styleUrls: ['./select-showcase.component.scss']
})
export class SelectShowcaseComponent {

  foods: Food[] = [
    { value: 'beefsteak-0', viewValue: 'Beefsteak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'nudeln-2', viewValue: 'Nudeln' }
  ];

  foodFromTheWorld = [{
    nation: 'Italien',
    food: [
      { value: 'lasagna', viewValue: 'Lasagna' },
      { value: 'parmigiana', viewValue: 'Parmigiana' },
      { value: 'krm', viewValue: 'Kartoffeln, Reis und Muscheln' }
    ]
  }, {
    nation: 'Deutschland',
    food: [
      { value: 'weißwurst', viewValue: 'Weißwurst' },
      { value: 'eisbein', viewValue: 'Eisbein' },
      { value: 'rheinische-muscheln', viewValue: 'Rheinische Muscheln' }
    ]
  }];


}
