/** @docs-private */
export function getSortDuplicateSortableIdError(id: string): Error {
  return Error(`Cannot have two SbbSortables with the same id (${id}).`);
}

/** @docs-private */
export function getSortHeaderNotContainedWithinSortError(): Error {
  return Error(`SbbSortHeader must be placed within a parent element with the SbbSort directive.`);
}

/** @docs-private */
export function getSortHeaderMissingIdError(): Error {
  return Error(`SbbSortHeader must be provided with a unique id.`);
}

/** @docs-private */
export function getSortInvalidDirectionError(direction: string): Error {
  return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}
