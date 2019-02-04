import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'sbb-toggle-showcase',
  templateUrl: './toggle-showcase.component.html',
  styleUrls: ['./toggle-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToggleShowcaseComponent implements OnInit {

  modelValue = 'Option_1';
  modelReactive = 'Option_2';

  toggleOptions: Observable<any> = of([{
    'label': 'Toggle 1',
    'value': 'Option_1'
  }, {
    'label': 'Toggle 2',
    'value': 'Option_2'
  }]);

  toggleValues: any;

  form = new FormGroup({
    test: new FormControl()
  });

  ngOnInit() {
    this.form.get('test').valueChanges.subscribe(
      (val) => {
        this.modelReactive = val;
      }
    );
  }

  toggleChange(toggleValues: any) {
    this.toggleValues = toggleValues;
  }

}
