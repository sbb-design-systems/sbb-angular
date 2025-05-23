interface LiveExample {
  /** Title of the example. */
  title: string;
  /** Name of the example component. */
  componentName: string;
  /** Selector to match the component of this example. */
  selector: string;
  /** Name of the primary file of this example. */
  primaryFile: string;
  /** List of files which are part of the example. */
  files: string[];
  /** Path to the directory containing the example. */
  packagePath: string;
  /** List of additional components which are part of the example. */
  additionalComponents: string[];
  /** Path from which to import the xample. */
  importPath: string;
}

export const EXAMPLE_COMPONENTS: { [id: string]: LiveExample };

export async function loadExample(id: string): Promise<any>;
