import { Injectable } from '@angular/core';
import { RadioButton } from './radio-button.component';

@Injectable()
export class RadioButtonRegistryService<T extends RadioButton> {

  private _accessors = {};

  get accessors(): {} {
    return this._accessors;
  }

  add(accessor: T) {
    if(!this._accessors[accessor.name]) {
      this._accessors[accessor.name] = [];
    }
    this._accessors[accessor.name].push(accessor);
  }

  remove(accessor: T) {
    if(this._accessors[accessor.name]) {
      this._accessors[accessor.name] = this._accessors[accessor.name].filter((obj) => {
        return obj !== accessor;
    });
    }
  }

  select(accessor: T) {
    this._accessors[accessor.name].forEach((c: T) => {
      if (c !== accessor) {
        c.uncheck();
      }
    });
  }

}
