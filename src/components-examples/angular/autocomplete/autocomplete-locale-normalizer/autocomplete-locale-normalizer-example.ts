import { Component } from '@angular/core';
/**
 * @title Autocomplete Locale Normalizer
 * @order 60
 */
@Component({
  selector: 'sbb-autocomplete-locale-normalizer-example',
  templateUrl: './autocomplete-locale-normalizer-example.html',
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
          .indexOf(this.normalizer(newValue).toLocaleUpperCase()) > -1
    );
  }
}

const options: string[] = ['Faröer', 'Français', 'Hur mår du?', 'Dobry wieczór!', 'Ćao'];
