import { ComponentRef } from '@angular/core';
import { Popup } from 'maplibre-gl';
import { Subject } from 'rxjs';

import { SbbLeitPoi } from '../components/leit-poi/leit-poi';

/**
 * MapLeitPoi groups the LeitPoi and the Popup container and helps to clean up both instances on destroy.
 */
export class SbbMapLeitPoi {
  private static readonly _hiddenClassName = 'leit-poi-popup-hidden';

  private _destroySub = new Subject<void>();

  constructor(
    private _componentRef: ComponentRef<SbbLeitPoi>,
    private _popup: Popup,
  ) {}

  get destroyed(): Subject<void> {
    return this._destroySub;
  }

  get switchLevel(): Subject<number> {
    return this._componentRef.instance.switchLevel;
  }

  get visible(): boolean {
    return !this._popup.getElement().className.includes(SbbMapLeitPoi._hiddenClassName);
  }

  toggleHidden(): void {
    this._popup.toggleClassName(SbbMapLeitPoi._hiddenClassName);
  }

  destroy(): void {
    this._destroySub.next();
    this._destroySub.complete();
    this._popup.remove();
    this._componentRef.destroy();
  }
}
