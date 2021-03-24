import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { startWith } from 'rxjs/operators';

/**
 * @title Checkbox Panel Group
 * @order 30
 */
@Component({
  selector: 'sbb-checkbox-panel-group-example',
  templateUrl: './checkbox-panel-group-example.html',
  styleUrls: ['./checkbox-panel-group-example.css'],
})
export class CheckboxPanelGroupExample {
  readonly breakpoints = [
    'tablet',
    'desktop',
    'desktopLarge',
    'desktop2k',
    'desktop4k',
    'desktop5k',
  ];
  checkboxes = new FormArray([]);
  form: FormGroup;
  groupClasses: string[] = [];

  constructor(private _formBuilder: FormBuilder) {
    this.form = this._formBuilder.group({
      amount: 9,
      tablet: 1,
      desktop: 1,
      desktopLarge: 1,
      desktop2k: 1,
      desktop4k: 1,
      desktop5k: 1,
    });
    this.form.valueChanges.pipe(startWith(this.form.value)).subscribe((v) => {
      const { amount, ...classes } = v as { [key: string]: number };
      if (isNaN(parseInt(amount as any, 10)) || amount < 1) {
        this.form.get('amount')!.setValue(1);
        return;
      } else if (amount > 100) {
        this.form.get('amount')!.setValue(100);
        return;
      }
      this._changeCheckboxAmount(amount);
      this._assignGroupClasses(classes);
    });
  }

  breakpointRange(breakpoint: string) {
    return Array.from({ length: breakpoint === 'tablet' ? 4 : 8 }, (_v, i) => i + 1);
  }

  private _changeCheckboxAmount(amount: number) {
    if (this.checkboxes.length < amount) {
      for (let i = this.checkboxes.length; i < amount; i++) {
        this.checkboxes.push(
          this._formBuilder.group({
            name: `Checkbox ${i + 1}`,
            selected: false,
          })
        );
      }
    } else if (this.checkboxes.length > amount) {
      for (let i = this.checkboxes.length; i >= amount; i--) {
        this.checkboxes.removeAt(i);
      }
    }
  }

  private _assignGroupClasses(classes: { [name: string]: number }) {
    this.groupClasses = Object.keys(classes)
      .filter((c) => classes[c] > 1)
      .map((c) => `sbb-col-${c}-${classes[c]}`);
  }
}
