import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TooltipRegistryService {
  private _tooltipActivationSubject = new Subject<void>();
  readonly tooltipActivation: Observable<void> = this._tooltipActivationSubject.asObservable();

  activate() {
    this._tooltipActivationSubject.next();
  }
}
