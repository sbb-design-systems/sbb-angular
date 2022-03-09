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

import { LeitPoiComponent } from '../../components/leit-poi/leit-poi.component';
import { LeitPoiFeature } from '../../components/leit-poi/model/leit-poi-feature';
import { LeitPoiPlacement } from '../../components/leit-poi/model/leit-poi-placement';
import { MapLeitPoi } from '../../model/map-leit-poi';

@Injectable({
  providedIn: 'root',
})
export class MapLeitPoiCreatorService {
  private static readonly _popupOptions = { closeOnClick: false, closeButton: false };
  private static readonly _popupClassName = 'leit-poi-popup';
  private static readonly _xOffset = 57; // 1/2 Leit-POI width
  private static readonly _yOffset = 37; // Leit-POI height

  private _componentFactory: ComponentFactory<LeitPoiComponent>;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector
  ) {
    this._componentFactory =
      this._componentFactoryResolver.resolveComponentFactory(LeitPoiComponent);
  }

  createMapLeitPoi(map: MaplibreMap, feature: LeitPoiFeature): MapLeitPoi {
    const componentRef = this._componentFactory.create(this._injector);
    this._appRef.attachView(componentRef.hostView);
    const component = componentRef.instance;
    component.feature = feature;

    const popup = new Popup(MapLeitPoiCreatorService._popupOptions)
      .setDOMContent(this._getNativeElement(componentRef))
      .addTo(map);

    popup.setLngLat(feature.location);
    popup.addClassName(MapLeitPoiCreatorService._popupClassName);
    popup.setOffset([
      (this._isEast(feature.placement) ? 1 : -1) * MapLeitPoiCreatorService._xOffset,
      this._isNorth(feature.placement) ? 0 : MapLeitPoiCreatorService._yOffset,
    ]);

    return new MapLeitPoi(componentRef, popup);
  }

  private _getNativeElement(componentRef: ComponentRef<LeitPoiComponent>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

  private _isNorth(placement: LeitPoiPlacement): boolean {
    return placement === LeitPoiPlacement.Northwest || placement === LeitPoiPlacement.Northeast;
  }

  private _isEast(placement: LeitPoiPlacement): boolean {
    return placement === LeitPoiPlacement.Southeast || placement === LeitPoiPlacement.Northeast;
  }
}
