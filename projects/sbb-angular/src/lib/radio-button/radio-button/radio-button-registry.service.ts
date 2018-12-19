import { Injectable } from '@angular/core';
import { RadioButton } from './radio-button.model';

@Injectable({
  providedIn: 'root'
})
export class RadioButtonRegistryService {

  private _accessors: { [name: string]: RadioButton[] } = {};

  get accessors(): {} {
    return this._accessors;
  }

  add(accessor: RadioButton) {
    if (!this._accessors[accessor.name]) {
      this._accessors[accessor.name] = [];
    }
    this._accessors[accessor.name].push(accessor);
  }

  remove(accessor: RadioButton) {
    if (this._accessors[accessor.name]) {
      this._accessors[accessor.name] = this._accessors[accessor.name].filter(a => a !== accessor);
    }
    if (this._accessors[accessor.name].length === 0) {
      delete this._accessors[accessor.name];
    }
  }

  select(accessor: RadioButton) {
    this._accessors[accessor.name]
      .filter(a => a !== accessor)
      .forEach(c => c.uncheck());
  }

}
