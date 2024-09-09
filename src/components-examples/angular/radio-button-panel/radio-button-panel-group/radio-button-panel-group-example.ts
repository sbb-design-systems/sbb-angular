import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbRadioButtonPanelModule } from '@sbb-esta/angular/radio-button-panel';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Radio Button Panel Group
 * @order 30
 */
@Component({
  selector: 'sbb-radio-button-panel-group-example',
  templateUrl: 'radio-button-panel-group-example.html',
  styleUrls: ['radio-button-panel-group-example.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SbbRadioButtonModule,
    NgClass,
    SbbRadioButtonPanelModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbSelectModule,
    SbbOptionModule,
  ],
})
export class RadioButtonPanelGroupExample implements OnDestroy {
  private _formBuilder = inject(FormBuilder);

  readonly breakpoints = [
    'tablet',
    'desktop',
    'desktopLarge',
    'desktop2k',
    'desktop4k',
    'desktop5k',
  ];
  radios: Array<{ label: string; value: number }> = [];
  form = this._formBuilder.group({
    value: 1,
    amount: 9,
    tablet: 1,
    desktop: 1,
    desktopLarge: 1,
    desktop2k: 1,
    desktop4k: 1,
    desktop5k: 1,
  });
  groupClasses: string[] = [];
  private _destroyed = new Subject<void>();

  constructor() {
    this.form.valueChanges
      .pipe(startWith(this.form.value), takeUntil(this._destroyed))
      .subscribe((v) => {
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

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
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
