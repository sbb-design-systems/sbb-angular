import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccordionNotificationService {
  openComponent: EventEmitter<any> = new EventEmitter();
  openIcon: EventEmitter<any> = new EventEmitter();

  constructor() {}

  setOpenComponent(value) {
    this.openComponent.emit(value);
  }

  setOpenIcon(value) {
    this.openIcon.emit(value);
  }
}
