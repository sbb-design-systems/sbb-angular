import { Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';

import { RadioButton } from './radio-button.model';

@Injectable({
  providedIn: 'root'
})
export class RadioButtonRegistryService {
  private _accessors: Array<[any, RadioButton]> = [];

  add(control: NgControl | null, accessor: RadioButton) {
    this._accessors.push([control || {}, accessor]);
  }

  remove(accessor: RadioButton) {
    for (let i = this._accessors.length - 1; i >= 0; --i) {
      if (this._accessors[i][1] === accessor) {
        this._accessors.splice(i, 1);
        return;
      }
    }
  }

  select(accessor: RadioButton) {
    this._accessors
      .filter(c => this._isSameGroup(c, accessor) && c[1] !== accessor)
      .forEach(c => c[1].uncheck());
  }

  private _isSameGroup(controlPair: [any, RadioButton], accessor: RadioButton): boolean {
    if (!controlPair[0].control || !accessor._control) {
      return false;
    }
    return (
      controlPair[0]._parent === (accessor._control as any)._parent &&
      controlPair[1].name === accessor.name
    );
  }
}
