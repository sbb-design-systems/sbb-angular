import { Injectable } from '@angular/core';

// TODO cdi move this code to map-marker-service.ts ?
@Injectable({ providedIn: 'root' })
export class SbbMapConfig {
  private _popup: boolean | undefined;

  updateConfigs(popup: boolean | undefined): void {
    this._popup = popup;
  }

  get popup(): boolean | undefined {
    return this._popup;
  }
}
