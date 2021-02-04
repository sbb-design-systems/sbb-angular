import { VersionChanges } from '@angular/cdk/schematics';

export interface SbbAngularCssSelectorData {
  /** The CSS selector to replace. */
  replace: string;
  /** The new CSS selector. */
  replaceWith: string;
  /**
   * Controls which file types in which this replacement is made. If omitted, it is made in all
   * files.
   */
  replaceIn?: {
    /** Replace this name in stylesheet files. */
    stylesheet?: boolean;
    /** Replace this name in HTML files. */
    html?: boolean;
    /** Replace this name in TypeScript strings. */
    strings?: boolean;
  };
}

export const cssSelectors: VersionChanges<SbbAngularCssSelectorData> = {};
