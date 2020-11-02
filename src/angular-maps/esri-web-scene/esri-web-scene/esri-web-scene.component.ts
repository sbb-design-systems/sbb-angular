// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  SbbEsriTypesService,
  SbbGraphicService,
  SbbHitTestService,
} from '@sbb-esta/angular-maps/core';

import { SbbEsri3DCamera } from '../model/sbb-esri-3d-camera.model';

@Component({
  selector: 'sbb-esri-web-scene',
  templateUrl: './esri-web-scene.component.html',
  styleUrls: ['./esri-web-scene.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriWebScene implements OnInit {
  private _camera: SbbEsri3DCamera;

  /** The reference to the esri.SceneView*/
  sceneView: __esri.SceneView;

  /** The reference to the esri.WebScene */
  webScene: __esri.WebScene;

  /** This id references to a portal web-scene item. It is used to display the scene. */
  @Input() portalItemId: string;

  /** Optional properties to configure the esri.SceneView.
   * See the arcgis js api doc for a list of all possible properties.
   * https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html#properties-summary
   */
  @Input() sceneViewProperties: __esri.SceneViewProperties;

  /** Update the active SceneView extent */
  @Input() set sceneCamera(newCamera: SbbEsri3DCamera) {
    this._camera = newCamera;
    this._setSceneViewCamera(newCamera);
  }

  /** Moves map to a specific point . */
  @Input() set goTo(camera: __esri.Camera | any) {
    if (camera) {
      const cam = this._createNewCamera(camera);
      this.sceneView.goTo(cam);
      this._geometryUtilsService.addNewGraphicToMap(cam.position, this.sceneView);
    }
  }

  /** Event that is emitted when the map is clicked */
  @Output() mapClick: EventEmitter<{
    clickedPoint: __esri.Point;
    clickedGraphics: __esri.Graphic[];
  }> = new EventEmitter();

  /** Event that is emitted when the extent of the map has been changed. */
  @Output() cameraChanged: EventEmitter<__esri.Camera> = new EventEmitter();

  /** Event that is emitted when the map is ready */
  @Output() mapReady: EventEmitter<__esri.SceneView> = new EventEmitter();

  constructor(
    private _esri: SbbEsriTypesService,
    private _elementRef: ElementRef,
    private _geometryUtilsService: SbbGraphicService,
    private _hitTestService: SbbHitTestService
  ) {}

  ngOnInit() {
    this._esri.load().then(() => {
      this.webScene = new this._esri.WebScene({
        portalItem: {
          id: this.portalItemId,
        },
      });
      this.sceneView = new this._esri.SceneView(this._mergeSceneViewProperties());

      this._setSceneViewCamera(this._camera);
      this._registerEvents();

      this.sceneView.when(() => this.mapReady.emit(this.sceneView));
    });
  }

  /** Merges input esri.SceneViewProperties with default SceneViewProperties */
  private _mergeSceneViewProperties(): __esri.SceneViewProperties {
    let svProperties = {} as __esri.SceneViewProperties;
    if (this.sceneViewProperties) {
      svProperties = this.sceneViewProperties;
    }

    svProperties.map = this.webScene;
    svProperties.container = this._elementRef.nativeElement;
    return svProperties;
  }

  /** Updates the extent of the sceneview. */
  private _setSceneViewCamera(newCamera: SbbEsri3DCamera) {
    if (this.sceneView && newCamera) {
      const cam = this._createNewCamera(newCamera);
      this.sceneView.goTo(cam);
    }
  }

  private _registerEvents() {
    this.sceneView.on('click', (e) => this._handleMouseClick(e));
    this.sceneView.watch('camera', (camera) => this._handleCameraChange(camera));
  }

  private _handleMouseClick(e: __esri.SceneViewClickEvent) {
    this._hitTestService
      .esriHitTest(this.sceneView, e)
      .then((hitTestGraphics) =>
        this.mapClick.emit({ clickedPoint: e.mapPoint, clickedGraphics: hitTestGraphics })
      );
  }

  private _handleCameraChange(camera: __esri.Camera) {
    this.cameraChanged.emit(camera);
  }

  private _createNewCamera(newCam: SbbEsri3DCamera): __esri.Camera {
    return new this._esri.Camera({
      position: newCam.position,
      tilt: newCam.tilt,
      heading: newCam.heading,
      fov: newCam.fov,
    });
  }
}
