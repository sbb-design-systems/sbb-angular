export * from './esri-types/esri-types.service';
export * from './graphic/graphic.service';
export * from './hit-test/hit-test.service';
/** @deprecated Remove with v12 */
export { SbbEsriTypesService as EsriTypesService } from './esri-types/esri-types.service';
/** @deprecated Remove with v12 */
export { SbbGraphicService as GraphicService } from './graphic/graphic.service';
/** @deprecated Remove with v12 */
export { SbbMarkerSymbolFactory as MarkerSymbolFactory } from './graphic/marker-symbol-factory/marker-symbol.factory';
/** @deprecated Remove with v12 */
export {
  SbbMarkerColors as MarkerColors,
  SbbMarkerSizes as MarkerSizes,
  SbbMarkerSymbolSettings as MarkerSymbolSettings,
} from './graphic/marker-symbol-factory/marker-symbol.settings';
/** @deprecated Remove with v12 */
export { SbbHitTestService as HitTestService } from './hit-test/hit-test.service';
