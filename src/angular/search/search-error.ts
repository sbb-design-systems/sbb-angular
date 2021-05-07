/** @docs-private */
export function getSbbInputRequiredError(): Error {
  return Error('sbb-search requires an <input sbbInput> element.');
}
