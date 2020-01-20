import { Injectable } from '@angular/core';

import { EsriLoaderService } from '../../esri-config/esri-loader.service';

@Injectable()
export class EsriTypesService {
  private _webScene: __esri.WebSceneConstructor;
  private _sceneView: __esri.SceneViewConstructor;
  private _camera: __esri.CameraConstructor;

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

  constructor(private _loader: EsriLoaderService) {}

  async load(): Promise<any> {
    if (!this._webScene) {
      [this._webScene, this._sceneView, this._camera] = await this._loader.load<
        __esri.WebSceneConstructor,
        __esri.SceneViewConstructor,
        __esri.CameraConstructor
      >(['esri/WebScene', 'esri/views/SceneView', 'esri/Camera']);
    }
  }
}
