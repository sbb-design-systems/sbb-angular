import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { startWith } from 'rxjs/operators';

/**
 * @title Radio Button Panel Group
 * @order 30
 */
@Component({
  selector: 'sbb-radio-button-panel-group-example',
  templateUrl: './radio-button-panel-group-example.html',
  styleUrls: ['./radio-button-panel-group-example.css'],
})
export class RadioButtonPanelGroupExample {
  readonly breakpoints = [
    'tablet',
    'desktop',
    'desktopLarge',
    'desktop2k',
    'desktop4k',
    'desktop5k',
  ];
  radios: Array<{ label: string; value: number }> = [];
  form: FormGroup;
  groupClasses: string[] = [];

  constructor(private _formBuilder: FormBuilder) {
    this.form = this._formBuilder.group({
      value: 1,
      amount: 9,
      tablet: 1,
      desktop: 1,
      desktopLarge: 1,
      desktop2k: 1,
      desktop4k: 1,
      desktop5k: 1,
    });
    this.form.valueChanges.pipe(startWith(this.form.value)).subscribe((v) => {
      const { value, amount, ...classes } = v as { [key: string]: number };
      if (isNaN(parseInt(amount as any, 10)) || amount < 1) {
        this.form.get('amount')!.setValue(1);
        return;
      } else if (amount > 100) {
        this.form.get('amount')!.setValue(100);
        return;
      }
      this._changeRadioButtonAmount(amount);
      this._assignGroupClasses(classes);
    });
  }

  breakpointRange(breakpoint: string) {
    return Array.from({ length: breakpoint === 'tablet' ? 4 : 8 }, (_v, i) => i + 1);
  }

  private _changeRadioButtonAmount(amount: number) {
    if (amount !== this.radios.length) {
      this.radios = Array.from({ length: amount }, (_v, i) => ({
        label: `Option ${++i}`,
        value: i,
      }));
    }
  }

  private _assignGroupClasses(classes: { [name: string]: number }) {
    this.groupClasses = Object.keys(classes)
      .filter((c) => classes[c] > 1)
      .map((c) => `sbb-col-${c}-${classes[c]}`);
  }
}
