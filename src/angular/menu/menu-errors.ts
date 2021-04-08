/**
 * Throws an exception for the case when menu trigger doesn't have a valid sbb-menu instance
 * @docs-private
 */
export function throwSbbMenuMissingError() {
  throw Error(`sbbMenuTriggerFor: must pass in an sbb-menu instance.

    Example:
      <sbb-menu #menu="sbbMenu"></sbb-menu>
      <button [sbbMenuTriggerFor]="menu" type="button"></button>`);
}

/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * @docs-private
 */
export function throwSbbMenuInvalidPositionX() {
  throw Error(`xPosition value must be either 'before' or after'.
      Example: <sbb-menu xPosition="before" #menu="sbbMenu"></sbb-menu>`);
}

/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * @docs-private
 */
export function throwSbbMenuInvalidPositionY() {
  throw Error(`yPosition value must be either 'above' or below'.
      Example: <sbb-menu yPosition="above" #menu="sbbMenu"></sbb-menu>`);
}

/**
 * Throws an exception for the case when a menu is assigned
 * to a trigger that is placed inside the same menu.
 * @docs-private
 */
export function throwSbbMenuRecursiveError() {
  throw Error(
    `sbbMenuTriggerFor: menu cannot contain its own trigger. Assign a menu that is ` +
      `not a parent of the trigger or move the trigger outside of the menu.`
  );
}
