import { Injectable } from '@angular/core';
import { RadioButton } from './radio-button.model';

@Injectable()
export class RadioButtonRegistryService {

  private _accessors = {};

  get accessors(): {} {
    return this._accessors;
  }

  add(accessor: RadioButton) {
    if(!this._accessors[accessor.name]) {
      this._accessors[accessor.name] = [];
    }
    this._accessors[accessor.name].push(accessor);
  }

  remove(accessor: RadioButton) {
    if(this._accessors[accessor.name]) {
      this._accessors[accessor.name] = this._accessors[accessor.name].filter((obj) => {
        return obj !== accessor;
    });
    }
  }

  select(accessor: RadioButton) {
    this._accessors[accessor.name].forEach((c: RadioButton) => {
      if (c !== accessor) {
        c.uncheck();
      }
    });
  }

}
