export interface Schema {
  /** Name of the project. */
  project: string;

  /** Whether the Angular browser animations module should be included and enabled. */
  animations: 'enabled' | 'disabled' | 'excluded';

  /** Design variant. */
  variant: 'standard (previously known as public)' | 'lean (previously known as business)';
}
