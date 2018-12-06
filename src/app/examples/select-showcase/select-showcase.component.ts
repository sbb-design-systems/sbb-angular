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
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

}
