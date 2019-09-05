import { SbbCheckboxChange } from '@sbb-esta/angular-core/base';

import { TagComponent } from './tag/tag.component';

export interface Tag {
  /** Identifier of a tag. */
  id?: string;
  /** Label of a tag. */
  label: string;
  /** Amount of results of a tag. */
  amount: number;
  /** Refers if a tag is selected. */
  selected?: boolean;
}

/** Change event object emitted by Tag. */
// TODO: Remove for Angular 9.
export class TagChange extends SbbCheckboxChange<TagComponent> {}
