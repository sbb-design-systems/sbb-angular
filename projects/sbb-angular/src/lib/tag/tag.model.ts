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
export class TagChange {
  constructor(
    /** The Tag that emits the change event. */
    public source: TagComponent,
    /** The checked prop of Tag. */
    public checked: boolean
  ) {}
}
