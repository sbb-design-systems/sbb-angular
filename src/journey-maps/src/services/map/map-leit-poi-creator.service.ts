import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector
} from '@angular/core';
import {Map as MaplibreMap, Popup} from 'maplibre-gl';
import {LeitPoiComponent} from '../../components/leit-poi/leit-poi.component';
import {LeitPoiFeature} from '../../components/leit-poi/model/leit-poi-feature';
import {LeitPoiPlacement} from '../../components/leit-poi/model/leit-poi-placement';
import {MapLeitPoi} from '../../model/map-leit-poi';

@Injectable({
  providedIn: 'root'
})
export class MapLeitPoiCreatorService {
  private static readonly POPUP_OPTIONS = {closeOnClick: false, closeButton: false};
  private static readonly POPUP_CLASS_NAME = 'leit-poi-popup';
  private static readonly X_OFFSET = 57; // 1/2 Leit-POI width
  private static readonly Y_OFFSET = 37; // Leit-POI height

  private componentFactory: ComponentFactory<LeitPoiComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LeitPoiComponent
    );
  }

  createMapLeitPoi(map: MaplibreMap, feature: LeitPoiFeature): MapLeitPoi {
    const componentRef = this.componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const component = componentRef.instance;
    component.feature = feature;

    const popup = new Popup(MapLeitPoiCreatorService.POPUP_OPTIONS)
      .setDOMContent(this.getNativeElement(componentRef))
      .addTo(map);

    popup.setLngLat(feature.location);
    popup.addClassName(MapLeitPoiCreatorService.POPUP_CLASS_NAME);
    popup.setOffset([
      (this.isEast(feature.placement) ? 1 : -1) * MapLeitPoiCreatorService.X_OFFSET,
      this.isNorth(feature.placement) ? 0 : MapLeitPoiCreatorService.Y_OFFSET
    ]);

    return new MapLeitPoi(componentRef, popup);
  }

  private getNativeElement(componentRef: ComponentRef<LeitPoiComponent>): HTMLElement {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    return domElem;
  }

  private isNorth(placement: LeitPoiPlacement): boolean {
    return placement === LeitPoiPlacement.northwest || placement === LeitPoiPlacement.northeast;
  }

  private isEast(placement: LeitPoiPlacement): boolean {
    return placement === LeitPoiPlacement.southeast || placement === LeitPoiPlacement.northeast;
  }
}

