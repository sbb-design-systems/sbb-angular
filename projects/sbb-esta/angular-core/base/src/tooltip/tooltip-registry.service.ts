import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TooltipRegistryService {
  private _tooltipActivationSubject = new Subject();
  readonly tooltipActivation = this._tooltipActivationSubject.asObservable();

  activate() {
    this._tooltipActivationSubject.next();
  }
}
