import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
/**
 * @title Autocomplete Locale Normalizer
 * @order 60
 */
@Component({
  selector: 'sbb-autocomplete-locale-normalizer-example',
  templateUrl: 'autocomplete-locale-normalizer-example.html',
  standalone: true,
  imports: [
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    SbbAutocompleteModule,
    SbbOptionModule,
    JsonPipe,
  ],
})
export class AutocompleteLocaleNormalizerExample {
  value: string;

  filteredOptions = options.slice(0);

  normalizer = (value: string) =>
    value
      .replace(/[àâäãåá]/gi, 'a')
      .replace(/[ç,ć]/gi, 'c')
      .replace(/[éèêë]/gi, 'e')
      .replace(/[íìîï]/gi, 'i')
      .replace(/[ñ]/gi, 'n')
      .replace(/[òôöóõø]/gi, 'o')
      .replace(/[ùûüú]/gi, 'u');

  valueChanged(newValue: string) {
    this.filteredOptions = options.filter(
      (option) =>
        this.normalizer(option)
          .toLocaleUpperCase()
          .indexOf(this.normalizer(newValue).toLocaleUpperCase()) > -1,
    );
  }
}

const options: string[] = ['Faröer', 'Français', 'Hur mår du?', 'Dobry wieczór!', 'Ćao'];
