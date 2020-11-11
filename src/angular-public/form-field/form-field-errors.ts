/** @docs-private */
export function getSbbFormFieldMissingControlError(): Error {
  return Error('sbb-form-field must contain a SbbFormFieldControl.');
}
