export * from './file-selector.module';
export * from './file-selector/file-selector-base';
export * from './file-selector/file-selector-types.service';
export * from './file-selector/file-selector.component';
export * from './file-selector/file-selector.pipes';
/** @deprecated Remove with v12 */
export { SbbFileSelectorModule as FileSelectorModule } from './file-selector.module';
/** @deprecated Remove with v12 */
export {
  SBB_FILE_SELECTOR_OPTIONS as FILE_SELECTOR_OPTIONS,
  SbbFileSelectorOptions as FileSelectorOptions,
  SBB_FILE_TYPES as FILE_TYPES,
} from './file-selector/file-selector-base';
/** @deprecated Remove with v12 */
export { SbbFileSelectorTypesService as FileSelectorTypesService } from './file-selector/file-selector-types.service';
/** @deprecated Remove with v12 */
export { SbbFileSelector as FileSelectorComponent } from './file-selector/file-selector.component';
/** @deprecated Remove with v12 */
export {
  SbbFileNameNoExtension as FileNameNoExtension,
  SbbFileExtension as FileExtension,
  SbbFileSizeFormatted as FileSizeFormatted,
} from './file-selector/file-selector.pipes';
