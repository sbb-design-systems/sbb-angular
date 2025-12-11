import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { VERSION } from '@sbb-esta/angular/core';
import { ExampleData, EXAMPLE_COMPONENTS } from '@sbb-esta/components-examples';
import stackblitz from '@stackblitz/sdk';
import { firstValueFrom, Observable } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

/**
 * Path that refers to the docs-content from the "@sbb-esta/components-examples" package.
 */
const DOCS_CONTENT_PATH = 'docs-content/examples-source';

const TEMPLATE_PATH = 'assets/stack-blitz/';

/**
 * List of boilerplate files for an example StackBlitz.
 * This currently matches files needed for a basic Angular CLI project.
 */
export const TEMPLATE_FILES = [
  '.gitignore',
  'angular.json',
  'karma.conf.js',
  'package.json',
  'package-lock.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.spec.json',
  'src/favicon.ico',
  'src/index.html',
  'src/main.ts',
  'src/polyfills.ts',
  'src/styles.css',
  'src/test.ts',
  'src/environments/environment.prod.ts',
  'src/environments/environment.ts',
];

const PROJECT_TAGS = ['angular', 'sbb-esta', 'web', 'example'];
const PROJECT_TEMPLATE = 'node';

/**
 * Type describing an in-memory file dictionary, representing a
 * directory and its contents.
 */
interface FileDictionary {
  [path: string]: string;
}

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * StackBlitz writer, write example files to StackBlitz.
 */
@Injectable({ providedIn: 'root' })
export class StackBlitzWriter {
  private _fileCache = new Map<string, Observable<string>>();

  constructor(
    private _http: HttpClient,
    private _ngZone: NgZone,
  ) {}

  /** Opens a StackBlitz for the specified example. */
  createStackBlitzForExample(
    exampleId: string,
    data: ExampleData,
    isTest: boolean,
  ): Promise<(isSbbLean: boolean) => void> {
    // Run outside the zone since the creation doesn't interact with Angular
    // and the file requests can cause excessive change detections.
    return this._ngZone.runOutsideAngular(async () => {
      const files = await this._buildInMemoryFileDictionary(data, exampleId, isTest);
      const exampleMainFile = `src/app/${data.indexFilename}`;

      return (isSbbLean: boolean) => {
        files['src/index.html'] = files['src/index.html'].replace(
          /\${sbbLean}/g,
          isSbbLean ? ' class="sbb-lean"' : '',
        );

        if (data.id.includes('journey-maps') || data.id.includes('esri-plugin')) {
          files['src/index.html'] = files['src/index.html'].replace(
            '</head>',
            `<script>window.JM_API_KEY='${window['JM_API_KEY']}'</script></head>`,
          );
        }

        this._openStackBlitz({
          files,
          title: `Sbb Angular Library - ${data.description}`,
          description: `${data.description}\n\nAuto-generated from: https://angular.app.sbb.ch`,
          openFile: exampleMainFile,
          startScript: isTest ? 'test' : 'start',
        });
      };
    });
  }

  /** Opens a new WebContainer-based StackBlitz for the given files. */
  private _openStackBlitz({
    title,
    description,
    openFile,
    files,
    startScript,
  }: {
    title: string;
    description: string;
    openFile: string;
    files: FileDictionary;
    startScript: string;
  }): void {
    stackblitz.openProject(
      {
        title,
        files,
        description,
        template: PROJECT_TEMPLATE,
        tags: PROJECT_TAGS,
      },
      { openFile, startScript },
    );
  }

  /**
   * Builds an in-memory file dictionary representing an CLI project serving
   * the example. The dictionary can then be passed to StackBlitz as project files.
   */
  private async _buildInMemoryFileDictionary(
    data: ExampleData,
    exampleId: string,
    isTest: boolean,
  ): Promise<FileDictionary> {
    const result: FileDictionary = {};
    const tasks: Promise<unknown>[] = [];
    const liveExample = EXAMPLE_COMPONENTS[exampleId];
    const exampleBaseContentPath = `${DOCS_CONTENT_PATH}/${liveExample.importPath}/${exampleId}/`;

    for (const relativeFilePath of TEMPLATE_FILES) {
      tasks.push(
        this._loadFile(TEMPLATE_PATH + relativeFilePath)
          // Replace example placeholders in the template files.
          .then((content) =>
            this._replaceExamplePlaceholders(data, relativeFilePath, content, isTest),
          )
          .then((content) => (result[relativeFilePath] = content)),
      );
    }

    for (const relativeFilePath of data.exampleFiles) {
      tasks.push(
        this._loadFile(exampleBaseContentPath + relativeFilePath)
          // Insert a copyright footer for all example files inserted into the project.
          .then((content) => (result[`src/app/${relativeFilePath}`] = content)),
      );
    }

    // Wait for the file dictionary to be populated. All file requests are
    // triggered concurrently to speed up the example StackBlitz generation.
    await Promise.all(tasks);

    return result;
  }

  /**
   * Loads the specified file and returns a promise resolving to its contents.
   */
  private _loadFile(fileUrl: string): Promise<string> {
    let stream = this._fileCache.get(fileUrl);

    if (!stream) {
      stream = this._http.get(fileUrl, { responseType: 'text' }).pipe(shareReplay(1));
      this._fileCache.set(fileUrl, stream);
    }

    // The `take(1)` is necessary, because the Promise from `firstValueFrom` resolves on the first emitted value
    return firstValueFrom(stream.pipe(take(1)));
  }

  /**
   * The StackBlitz template assets contain placeholder names for the examples:
   * "<sbb-angular-docs-example>" and "SbbAngularDocsExample".
   * This will replace those placeholders with the names from the example metadata,
   * e.g. "<basic-button-example>" and "BasicButtonExample"
   */
  private _replaceExamplePlaceholders(
    data: ExampleData,
    fileName: string,
    fileContent: string,
    isTest: boolean,
  ): string {
    // Replaces the version placeholder in the `index.html` and `package.json` file.
    // Technically we invalidate the `package-lock.json` file for the StackBlitz boilerplate
    // by dynamically changing the version in the `package.json`, but the Turbo package manager
    // seems to be able to partially re-use the lock file to speed up the module tree computation,
    // so providing a lock file is still reasonable while modifying the `package.json`.
    if (fileName === 'src/index.html' || fileName === 'package.json') {
      fileContent = fileContent.replace(/\${version}/g, VERSION.full);
    }

    if (fileName === 'src/index.html') {
      // Replace the component selector in `index,html`.
      // For example, <sbb-angular-docs-example></sbb-angular-docs-example> will be replaced as
      // <button-demo></button-demo>
      fileContent = fileContent
        .replace(/sbb-angular-docs-example/g, data.selectorName)
        .replace(/\${title}/g, data.description);
    } else if (fileName === 'src/main.ts') {
      // Replace the component name in `main.ts`.
      // Replace `import {SbbAngularDocsExample} from 'sbb-angular-docs-example'`
      // will be replaced as `import {ButtonDemo} from './button-demo'`
      fileContent = fileContent.replace(
        /{ SbbAngularDocsExample }/g,
        `{ ${data.componentNames[0]} }`,
      );

      // Replace `bootstrap: [SbbAngularDocsExample]`
      // will be replaced as `bootstrap: [ButtonDemo]`
      // This assumes the first component listed in the main component
      fileContent = fileContent.replace(
        /bootstrap: \[SbbAngularDocsExample]/g,
        `bootstrap: [${data.componentNames[0]}]`,
      );

      // Replace all other occurances of `SbbAngularDocsExample`
      // will be replaced as `ButtonDemo`
      fileContent = fileContent.replace('SbbAngularDocsExample', data.componentNames[0]);

      const dotIndex = data.indexFilename.lastIndexOf('.');
      const importFileName = data.indexFilename.slice(0, dotIndex === -1 ? undefined : dotIndex);
      fileContent = fileContent.replace(/sbb-angular-docs-example/g, importFileName);
    }
    return fileContent;
  }
}
