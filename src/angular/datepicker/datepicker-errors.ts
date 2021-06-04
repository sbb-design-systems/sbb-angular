export function createMissingDateImplError(provider: string) {
  return Error(`SbbDatepicker: No provider found for ${provider}.`);
}
