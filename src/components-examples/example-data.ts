// The example-module file will be auto-generated. As soon as the
// examples are being compiled, the module file will be generated.
// @ts-ignore example-module.ts is generated automatically by bazel
import { EXAMPLE_COMPONENTS } from './example-module';

/**
 * Example data with information about component name, selector, files used in
 * example, and path to examples.
 */
export class ExampleData {
  /** Id */
  id: string;

  /** Description of the example. */
  description: string;

  /** List of files that are part of this example. */
  exampleFiles: string[];

  /** Selector name of the example component. */
  selectorName: string;

  /** Name of the file that contains the example component. */
  indexFilename: string;

  /** Names of the components being used in this example. */
  componentNames: string[];

  /** Variants of library for which this example is belonging to. Empty means valid for all variants */
  variant: string;

  /** Whether the example is only for dev purposes */
  devOnly: boolean;

  static find(library: string, id: string): ExampleData[] {
    console.log(
      Object.keys(EXAMPLE_COMPONENTS as { [id: string]: {} }).filter((exampleId) =>
        EXAMPLE_COMPONENTS[exampleId].importPath.startsWith(`${library}`),
      ),
    );

    return Object.keys(EXAMPLE_COMPONENTS as { [id: string]: {} })
      .filter((exampleId) => EXAMPLE_COMPONENTS[exampleId].importPath === `${library}/${id}`)
      .map((exampleId) => new ExampleData(exampleId));
  }

  static findByVariant(library: string, id: string, variant: 'standard' | 'lean'): ExampleData[] {
    return ExampleData.find(library, id).filter(
      (value) => !value.variant || value.variant === variant,
    );
  }

  constructor(example: string) {
    if (!example || !EXAMPLE_COMPONENTS.hasOwnProperty(example)) {
      return;
    }

    const {
      componentName,
      files,
      selector,
      primaryFile,
      additionalComponents,
      title,
      variant,
      devOnly,
    } = EXAMPLE_COMPONENTS[example];
    const exampleName = example.replace(/(?:^\w|\b\w)/g, (letter) => letter.toUpperCase());

    this.id = example;
    this.exampleFiles = files;
    this.selectorName = selector;
    this.indexFilename = primaryFile;
    this.description = title || exampleName.replace(/[\-]+/g, ' ') + ' Example';
    this.componentNames = [componentName, ...additionalComponents];
    this.variant = variant;
    this.devOnly = devOnly;
  }
}
