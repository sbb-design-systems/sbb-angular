import { TargetVersion, VersionChanges } from '@angular/cdk/schematics';

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

export const cssSelectors: VersionChanges<SbbAngularCssSelectorData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'sbb-checkbox-group-vertical',
          replaceWith: 'sbb-selection-group-vertical',
        },
        {
          replace: 'sbb-radio-group-vertical',
          replaceWith: 'sbb-selection-group-vertical',
        },
        {
          replace: 'sbb-checkbox-group-horizontal',
          replaceWith: 'sbb-selection-group-horizontal',
        },
        {
          replace: 'sbb-radio-group-horizontal',
          replaceWith: 'sbb-selection-group-horizontal',
        },
      ],
    },
  ],
};
