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

  modelValue = 'value1';
  modelReactive = 'value1';

  toggleOptions: Observable<any> = of([{
    'label': 'Toggle 1',
    'value': 'value1'
  }, {
    'label': 'Toggle 2',
    'value': 'value2'
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
