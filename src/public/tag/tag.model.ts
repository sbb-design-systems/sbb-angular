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
