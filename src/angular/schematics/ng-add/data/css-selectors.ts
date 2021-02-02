import { TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export interface SbbAngularCssSelectorData {
  /** The CSS selector to replace. */
  replace: string;
  /** The new CSS selector. */
  replaceWith: string;
  /** limitedTo where this replacement is made. If omitted it is made in all files. */
  limitedTo?: {
    /** Replace this name in stylesheet files. */
    stylesheet?: boolean;
    /** Replace this name in HTML files. */
    html?: boolean;
    /** Replace this name in TypeScript strings. */
    strings?: boolean;
  };
}

export const cssSelectors: VersionChanges<SbbAngularCssSelectorData> = {
  ['version 13' as TargetVersion]: [
    {
      replace: '.sbb-checkbox-group-vertical',
      replaceWith: '.sbb-selection-group-vertical',
    },
    {
      replace: '.sbb-radio-group-vertical',
      replaceWith: '.sbb-selection-group-vertical',
    },
    {
      replace: '.sbb-checkbox-group-horizontal',
      replaceWith: '.sbb-selection-group-horizontal',
    },
    {
      replace: '.sbb-radio-group-horizontal',
      replaceWith: '.sbb-selection-group-horizontal',
    },
  ],
};
