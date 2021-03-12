/** @docs-private */
export function getSbbTextexpandInvalidError(): Error {
  return Error('Collapsed and expanded must be defined!');
}
