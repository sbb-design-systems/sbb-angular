import {Injectable} from '@angular/core';

  // TODO cdi move this code to map-marker.service.ts ?
  @Injectable({providedIn: 'root'})
export class MapConfigService {
  private _popup: boolean;

  updateConfigs(popup: boolean): void {
    this._popup = popup;
  }

  get popup(): boolean {
    return this._popup;
  }
}
