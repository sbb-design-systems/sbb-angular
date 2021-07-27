/** @docs-private */
export function getSbbInputUnsupportedTypeError(type: string): Error {
  return Error(`Input type "${type}" isn't supported by sbbInput.`);
}
