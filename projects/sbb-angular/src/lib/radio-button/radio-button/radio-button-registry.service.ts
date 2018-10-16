import { Injectable } from '@angular/core';
import { RadioButtonComponent } from './radio-button.component';

@Injectable()
export class RadioButtonRegistryService {

  private _accessors = {};

  get accessors(): {} {
    return this._accessors;
  }

  add(accessor: RadioButtonComponent) {
    if(!this._accessors[accessor.name]) {
      this._accessors[accessor.name] = [];
    }
    this._accessors[accessor.name].push(accessor);
  }

  remove(accessor: RadioButtonComponent) {
    if(this._accessors[accessor.name]) {
      this._accessors[accessor.name] = this._accessors[accessor.name].filter((obj) => {
        return obj.inputId !== accessor.inputId;
    });
    }
  }

  select(accessor: RadioButtonComponent) {
    this._accessors[accessor.name].forEach((c) => {
      if (c !== accessor) {
        c.uncheck(accessor.inputValue);
      }
    });
  }

}
