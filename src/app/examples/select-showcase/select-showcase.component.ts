import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectComponent } from 'sbb-angular';

export interface Food {
  value: string;
  viewValue: string;
  disabled: boolean;
}


@Component({
  selector: 'sbb-select-showcase',
  templateUrl: './select-showcase.component.html',
  styleUrls: ['./select-showcase.component.scss']
})
export class SelectShowcaseComponent {
  @ViewChild('basicSelect') basicSelect: SelectComponent;
  @ViewChild('multiSelect') multiSelect: SelectComponent;
  @ViewChild('withOptionGroup') withOptionGroup: SelectComponent;
  @ViewChild('multiWithOptionGroup') multiWithOptionGroup: SelectComponent;

  foods: Food[] = [
    { value: 'beefsteak-0', viewValue: 'Beefsteak', disabled: false },
    { value: 'pizza-1', viewValue: 'Pizza', disabled: false },
    { value: 'nudeln-2', viewValue: 'Nudeln', disabled: false }
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
  },
  {
    nation: 'Swiss',
    food: [
      { value: 'bircherműesli', viewValue: 'Bircherműesli' },
      { value: 'rösti', viewValue: 'Rösti' },
      { value: 'bűndnernusstorte', viewValue: 'Bűndnernusstorte' }
    ]
  }];

  basicExampleFormControl = new FormControl();

  nativeExampleFormControl = new FormControl();

  multipleExampleFormControl = new FormControl();

  withOptionGroupsExampleFormControl = new FormControl();

  multipleWithOptionGroupsExampleFormControl = new FormControl();

  toggleDisabled($event: any, control: FormControl) {
    $event.target.checked ? control.disable() : control.enable();
  }

  toggleDisabledOptions($event: any, component: SelectComponent | 'select', mode: 'options' | 'optionGroups') {
    if (component === 'select') {
      this.foods[1].disabled = $event.target.checked;
    } else {
      component[mode].toArray()[1].disabled = $event.target.checked;
    }

  }
}
