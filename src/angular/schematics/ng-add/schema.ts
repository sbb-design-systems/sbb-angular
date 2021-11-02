export interface Schema {
  /** Name of the project. */
  project: string;

  /** Whether Angular browser animations should be set up. */
  animations: boolean;

  /** Design variant. */
  variant: 'standard (previously known as public)' | 'lean (previously known as business)';
}
