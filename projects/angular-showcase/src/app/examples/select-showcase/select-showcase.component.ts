import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectComponent } from '@sbb-esta/angular-public';

export class Food {
  constructor(public value: string, public viewValue: string, public disabled: boolean = false) {}
}

@Component({
  selector: 'sbb-select-showcase',
  templateUrl: './select-showcase.component.html',
  styleUrls: ['./select-showcase.component.scss']
})
export class SelectShowcaseComponent {
  @ViewChild('basicSelect', { static: true }) basicSelect: SelectComponent;
  @ViewChild('multiSelect', { static: true }) multiSelect: SelectComponent;
  @ViewChild('withOptionGroup', { static: true }) withOptionGroup: SelectComponent;
  @ViewChild('multiWithOptionGroup', { static: true }) multiWithOptionGroup: SelectComponent;

  foods: Food[] = [
    new Food('beefsteak-0', 'Beefsteak'),
    new Food('pizza-1', 'Pizza'),
    new Food('nudeln-2', 'Nudeln')
  ];

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

  basicExampleFormControl = new FormControl();

  nativeExampleFormControl = new FormControl();

  multipleExampleFormControl = new FormControl();

  withOptionGroupsExampleFormControl = new FormControl();

  multipleWithOptionGroupsExampleFormControl = new FormControl();

  toggleDisabled($event: any, control: FormControl) {
    $event.target.checked ? control.disable() : control.enable();
  }

  toggleDisabledOptions(
    $event: any,
    component: SelectComponent | 'select',
    mode: 'options' | 'optionGroups'
  ) {
    if (component === 'select') {
      this.foods[1].disabled = $event.target.checked;
    } else {
      component[mode].toArray()[1].disabled = $event.target.checked;
    }
  }
}
