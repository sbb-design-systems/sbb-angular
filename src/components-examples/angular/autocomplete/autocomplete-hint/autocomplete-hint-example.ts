import { JsonPipe, SlicePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * @title Autocomplete Hint
 * @order 30
 */
@Component({
  selector: 'sbb-autocomplete-hint-example',
  templateUrl: 'autocomplete-hint-example.html',
  standalone: true,
  imports: [
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    SbbAutocompleteModule,
    ReactiveFormsModule,
    SbbOptionModule,
    JsonPipe,
    SlicePipe,
  ],
})
export class AutocompleteHintExample implements OnInit, OnDestroy {
  readonly maxOptionsListLength = 5;
  myControlHint = new FormControl('');
  filteredOptionsHint = options.slice(0);
  private _destroyed = new Subject<void>();

  ngOnInit() {
    this.myControlHint.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this._destroyed))
      .subscribe((newValue) => {
        this.filteredOptionsHint = options.filter(
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
