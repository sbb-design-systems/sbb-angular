import { TagComponent } from './tag/tag.component';

export interface Tag {
  id?: string;
  label: string;
  amount: number;
  selected?: boolean;
}

/** Change event object emitted by Tag. */
export class TagChange {
  constructor(
    /** The Tag that emits the change event. */
    public source: TagComponent,
    /** The checked prop of Tag. */
    public checked: boolean) {}
}
