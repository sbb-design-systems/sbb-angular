import { NgClass } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular/checkbox-panel';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Checkbox Panel Group
 * @order 30
 */
@Component({
  selector: 'sbb-checkbox-panel-group-example',
  templateUrl: 'checkbox-panel-group-example.html',
  styleUrls: ['checkbox-panel-group-example.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    SbbCheckboxPanelModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbSelectModule,
    SbbOptionModule,
  ],
})
export class CheckboxPanelGroupExample implements OnDestroy {
  readonly breakpoints = [
    'tablet',
    'desktop',
    'desktopLarge',
    'desktop2k',
    'desktop4k',
    'desktop5k',
  ];
  checkboxes = new FormArray<AbstractControl>([]);
  form = this._formBuilder.group({
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

  constructor(private _formBuilder: FormBuilder) {
    this.form.valueChanges
      .pipe(startWith(this.form.value), takeUntil(this._destroyed))
      .subscribe((v) => {
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

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
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
          }),
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
