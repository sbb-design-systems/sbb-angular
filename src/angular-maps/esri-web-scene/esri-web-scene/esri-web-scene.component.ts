import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import Camera from '@arcgis/core/Camera';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import SceneView from '@arcgis/core/views/SceneView';
import WebScene from '@arcgis/core/WebScene';
import { SbbGraphicService, SbbHitTestService } from '@sbb-esta/angular-maps/core';
import SceneViewProperties = __esri.SceneViewProperties;
import ViewClickEvent = __esri.ViewClickEvent;
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SbbEsri3DCamera } from '../model/sbb-esri-3d-camera.model';

@Component({
  selector: 'sbb-esri-web-scene',
  templateUrl: './esri-web-scene.component.html',
  styleUrls: ['./esri-web-scene.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriWebScene implements OnInit, OnDestroy {
  private readonly _setSceneCameraSubject = new ReplaySubject<SbbEsri3DCamera>(1);
  private readonly _goToSubject = new ReplaySubject<SbbEsri3DCamera | any>(1);
  private readonly _destroyed = new Subject<void>();

  /** The reference to the esri.SceneView*/
  sceneView: SceneView;

  /** The reference to the esri.WebScene */
  webScene: WebScene;

  /** This id references to a portal web-scene item. It is used to display the scene. */
  @Input() portalItemId: string;

  /** Optional properties to configure the esri.SceneView.
   * See the arcgis js api doc for a list of all possible properties.
   * https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html#properties-summary
   */
  @Input() sceneViewProperties: SceneViewProperties;

  /** Update the active SceneView extent */
  @Input() set sceneCamera(newCamera: SbbEsri3DCamera) {
    this._setSceneCameraSubject.next(newCamera);
  }

  /** Moves map to a specific point . */
  @Input() set goTo(camera: SbbEsri3DCamera | any) {
    this._goToSubject.next(camera);
  }

  /** Event that is emitted when the map is clicked */
  @Output() mapClick: EventEmitter<{
    clickedPoint: Point;
    clickedGraphics: Graphic[];
  }> = new EventEmitter();

  /** Event that is emitted when the extent of the map has been changed. */
  @Output() cameraChanged: EventEmitter<Camera> = new EventEmitter();

  /** Event that is emitted when the map is ready */
  @Output() mapReady: EventEmitter<SceneView> = new EventEmitter();

  constructor(
    private _elementRef: ElementRef,
    private _geometryUtilsService: SbbGraphicService,
    private _hitTestService: SbbHitTestService
  ) {}

  ngOnInit() {
    this.webScene = new WebScene({
      portalItem: {
        id: this.portalItemId,
      },
    });
    this.sceneView = new SceneView(this._mergeSceneViewProperties());

    this._subscribeToInputChanges();
    this._registerEvents();
    this.sceneView.when(() => this.mapReady.emit(this.sceneView));
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this._destroySceneView();
  }

  private _subscribeToInputChanges() {
    this._setSceneCameraSubject
      .pipe(takeUntil(this._destroyed))
      .subscribe((newCamera: SbbEsri3DCamera) => {
        this._setSceneViewCamera(newCamera);
      });

    this._goToSubject
      .pipe(takeUntil(this._destroyed))
      .subscribe((camera: SbbEsri3DCamera | any) => {
        if (this.sceneView && camera) {
          this._setSceneViewCamera(camera);
          this._geometryUtilsService.addNewGraphicToMap(camera.position, this.sceneView);
        }
      });
  }

  /** Merges input esri.SceneViewProperties with default SceneViewProperties */
  private _mergeSceneViewProperties(): SceneViewProperties {
    let svProperties = {} as SceneViewProperties;
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
      const cam = new Camera({
        position: newCamera.position,
        tilt: newCamera.tilt,
        heading: newCamera.heading,
        fov: newCamera.fov,
      });

      this.sceneView.goTo(cam);
    }
  }

  private _registerEvents() {
    this.sceneView.on('click', (e) => this._handleMouseClick(e));
    this.sceneView.watch('camera', (camera) => this._handleCameraChange(camera));
  }

  private _handleMouseClick(e: ViewClickEvent) {
    this._hitTestService
      .esriHitTest(this.sceneView, e)
      .then((hitTestGraphics) =>
        this.mapClick.emit({ clickedPoint: e.mapPoint, clickedGraphics: hitTestGraphics })
      );
  }

  private _handleCameraChange(camera: Camera) {
    this.cameraChanged.emit(camera);
  }

  private _destroySceneView() {
    // it was in 4.18, but just to be sure it's cleaned-up: https://community.esri.com/t5/arcgis-api-for-javascript/4-17-memory-issue-angular/td-p/140389
    this.sceneView?.destroy();
    this.webScene?.removeAll();
    this.webScene?.destroy();
  }
}
