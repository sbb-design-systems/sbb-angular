import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * @title Autocomplete Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-autocomplete-reactive-forms-example',
  templateUrl: 'autocomplete-reactive-forms-example.html',
  imports: [
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    SbbAutocompleteModule,
    ReactiveFormsModule,
    SbbOptionModule,
    JsonPipe,
  ],
})
export class AutocompleteReactiveFormsExample implements OnInit, OnDestroy {
  myControl = new FormControl('');
  filteredOptions = options.slice(0);
  private _destroyed = new Subject<void>();

  ngOnInit() {
    this.myControl.valueChanges.pipe(takeUntil(this._destroyed)).subscribe((newValue) => {
      this.filteredOptions = options.filter(
        (option) => option.toLocaleUpperCase().indexOf(newValue!.toLocaleUpperCase()) > -1,
      );
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}

const options: string[] = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];
