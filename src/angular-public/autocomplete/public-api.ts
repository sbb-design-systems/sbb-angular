export * from './autocomplete.module';
export * from './autocomplete/autocomplete.component';
export * from './autocomplete-hint/autocomplete-hint.component';
export * from './autocomplete/autocomplete-origin.directive';
export * from './autocomplete/autocomplete-trigger.directive';
/** @deprecated Remove with v12 */
export { SbbAutocompleteModule as AutocompleteModule } from './autocomplete.module';
/** @deprecated Remove with v12 */
export { SbbAutocompleteOrigin as AutocompleteOriginDirective } from './autocomplete/autocomplete-origin.directive';
/** @deprecated Remove with v12 */
export {
  SBB_AUTOCOMPLETE_OPTION_HEIGHT as AUTOCOMPLETE_OPTION_HEIGHT,
  SBB_AUTOCOMPLETE_PANEL_HEIGHT as AUTOCOMPLETE_PANEL_HEIGHT,
  SbbAutocompleteTrigger as AutocompleteTriggerDirective,
} from './autocomplete/autocomplete-trigger.directive';
/** @deprecated Remove with v12 */
export { SbbAutocomplete as AutocompleteComponent } from './autocomplete/autocomplete.component';
/** @deprecated Remove with v12 */
export { SbbAutocompleteHint as AutocompleteHintComponent } from './autocomplete-hint/autocomplete-hint.component';
