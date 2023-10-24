import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
} from '@angular/core';
import { Map as MaplibreMap, Popup } from 'maplibre-gl';

import { SbbLeitPoi } from '../../components/leit-poi/leit-poi';
import { SbbLeitPoiFeature } from '../../components/leit-poi/model/leit-poi-feature';
import { SbbLeitPoiPlacement } from '../../components/leit-poi/model/leit-poi-placement';
import { SbbMapLeitPoi } from '../../model/map-leit-poi';

@Injectable({
  providedIn: 'root',
})
export class SbbMapLeitPoiCreator {
  private static readonly _popupOptions = { closeOnClick: false, closeButton: false };
  private static readonly _popupClassName = 'leit-poi-popup';
  private static readonly _xOffset = 57; // 1/2 Leit-POI width
  private static readonly _yOffset = 37; // Leit-POI height

  private _componentFactory: ComponentFactory<SbbLeitPoi>;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
  ) {
    this._componentFactory = this._componentFactoryResolver.resolveComponentFactory(SbbLeitPoi);
  }

  createMapLeitPoi(map: MaplibreMap, feature: SbbLeitPoiFeature): SbbMapLeitPoi {
    const componentRef = this._componentFactory.create(this._injector);
    this._appRef.attachView(componentRef.hostView);
    const component = componentRef.instance;
    component.feature = feature;
    componentRef.changeDetectorRef.detectChanges();

    const popup = new Popup(SbbMapLeitPoiCreator._popupOptions)
      .setDOMContent(this._getNativeElement(componentRef))
      .addTo(map);

    popup.setLngLat(feature.location);
    popup.addClassName(SbbMapLeitPoiCreator._popupClassName);
    popup.setOffset([
      (this._isEast(feature.placement) ? 1 : -1) * SbbMapLeitPoiCreator._xOffset,
      this._isNorth(feature.placement) ? 0 : SbbMapLeitPoiCreator._yOffset,
    ]);

    return new SbbMapLeitPoi(componentRef, popup);
  }

  private _getNativeElement(componentRef: ComponentRef<SbbLeitPoi>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

  private _isNorth(placement: SbbLeitPoiPlacement): boolean {
    return placement === 'northwest' || placement === 'northeast';
  }

  private _isEast(placement: SbbLeitPoiPlacement): boolean {
    return placement === 'southeast' || placement === 'northeast';
  }
}
