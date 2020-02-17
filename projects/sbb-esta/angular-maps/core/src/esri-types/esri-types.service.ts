import { Injectable } from '@angular/core';
import { EsriLoaderService } from '@sbb-esta/angular-maps/esri-config';

@Injectable({
  providedIn: 'root'
})
export class EsriTypesService {
  private _point: __esri.PointConstructor;
  private _graphic: __esri.GraphicConstructor;
  private _simpleMarkeSymbol: __esri.SimpleMarkerSymbolConstructor;
  private _basemapGallery: __esri.BasemapGalleryConstructor;
  private _webScene: __esri.WebSceneConstructor;
  private _sceneView: __esri.SceneViewConstructor;
  private _camera: __esri.CameraConstructor;
  private _layerList: __esri.LayerListConstructor;
  private _legend: __esri.LegendConstructor;
  private _webMap: __esri.WebMapConstructor;
  private _mapView: __esri.MapViewConstructor;
  private _extent: __esri.ExtentConstructor;

  // tslint:disable-next-line: naming-convention
  get Point(): __esri.PointConstructor {
    return this._point;
  }

  // tslint:disable-next-line: naming-convention
  get Graphic(): __esri.GraphicConstructor {
    return this._graphic;
  }

  // tslint:disable-next-line: naming-convention
  get SimpleMarkerSymbol(): __esri.SimpleMarkerSymbolConstructor {
    return this._simpleMarkeSymbol;
  }

  // tslint:disable-next-line: naming-convention
  get BasemapGallery(): __esri.BasemapGalleryConstructor {
    return this._basemapGallery;
  }

  // tslint:disable-next-line: naming-convention
  get WebScene(): __esri.WebSceneConstructor {
    return this._webScene;
  }

  // tslint:disable-next-line: naming-convention
  get SceneView(): __esri.SceneViewConstructor {
    return this._sceneView;
  }

  // tslint:disable-next-line: naming-convention
  get Camera(): __esri.CameraConstructor {
    return this._camera;
  }

  // tslint:disable-next-line: naming-convention
  get LayerList(): __esri.LayerListConstructor {
    return this._layerList;
  }

  // tslint:disable-next-line: naming-convention
  get Legend(): __esri.LegendConstructor {
    return this._legend;
  }

  // tslint:disable-next-line: naming-convention
  get WebMap(): __esri.WebMapConstructor {
    return this._webMap;
  }

  // tslint:disable-next-line: naming-convention
  get MapView(): __esri.MapViewConstructor {
    return this._mapView;
  }

  // tslint:disable-next-line: naming-convention
  get Extent(): __esri.ExtentConstructor {
    return this._extent;
  }

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._graphic) {
      [
        this._point,
        this._graphic,
        this._simpleMarkeSymbol,
        this._basemapGallery,
        this._webScene,
        this._sceneView,
        this._camera,
        this._layerList,
        this._legend,
        this._webMap,
        this._mapView,
        this._extent
      ] = await this._loader.load<
        __esri.PointConstructor,
        __esri.GraphicConstructor,
        __esri.SimpleMarkerSymbolConstructor,
        __esri.BasemapGalleryConstructor,
        __esri.WebSceneConstructor,
        __esri.SceneViewConstructor,
        __esri.CameraConstructor,
        __esri.LayerListConstructor,
        __esri.LegendConstructor,
        __esri.WebMapConstructor,
        __esri.MapViewConstructor,
        __esri.ExtentConstructor
      >([
        'esri/geometry/Point',
        'esri/Graphic',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/widgets/BasemapGallery',
        'esri/WebScene',
        'esri/views/SceneView',
        'esri/Camera',
        'esri/widgets/LayerList',
        'esri/widgets/Legend',
        'esri/WebMap',
        'esri/views/MapView',
        'esri/geometry/Extent'
      ]);
    }
  }
}
