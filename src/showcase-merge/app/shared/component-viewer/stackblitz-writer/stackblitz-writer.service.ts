import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// @ts-ignore versions.ts is generated automatically by bazel
import { libraryVersion } from './versions';

export class ExampleData {
  indexFilename: string;
  description: string;
  selectorName: string;
  componentName: string;
  exampleFiles: { name: string; content: string }[];
  business: boolean;

  constructor(data: { [P in keyof ExampleData]: ExampleData[P] }) {
    this.indexFilename = data.indexFilename;
    this.description = data.description;
    this.selectorName = data.selectorName;
    this.componentName = data.componentName;
    this.exampleFiles = data.exampleFiles;
    this.business = data.business;
  }
}

const STACKBLITZ_URL = 'https://run.stackblitz.com/api/angular/v1';

/**
 * Path that refers to the docs-content from the "@angular/components-examples" package.
 */
const CONTENT_PATH = 'assets/docs-content/examples-source/';

/**
 * Path that refers to the generic project template files.
 */
const TEMPLATE_PATH = 'assets/stackblitz/';

/**
 * Filenames of the generic project template files.
 */
const TEMPLATE_FILES = [
  '.editorconfig',
  '.gitignore',
  'angular.json',
  '.browserslistrc',
  'package.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.spec.json',
  'tslint.json',
  'src/index.html',
  'src/styles.scss',
  'src/polyfills.ts',
  'src/main.ts',
  'src/app/app.module.ts',
];

/**
 * Stackblitz tags
 */
const TAGS: string[] = ['sbb', 'angular', 'example'];

const angularVersion = '^12.0.0';
const dependencies = {
  '@angular/animations': angularVersion,
  '@angular/cdk': angularVersion,
  '@angular/common': angularVersion,
  '@angular/compiler': angularVersion,
  '@angular/core': angularVersion,
  '@angular/forms': angularVersion,
  '@angular/platform-browser': angularVersion,
  '@angular/platform-browser-dynamic': angularVersion,
  '@angular/router': angularVersion,
  '@sbb-esta/angular-core': libraryVersion,
  '@sbb-esta/angular-icons': libraryVersion,
  '@sbb-esta/angular-public': libraryVersion,
  '@sbb-esta/angular-business': libraryVersion,
  rxjs: '^6.6.3',
  tslib: '^2.0.3',
  'zone.js': '^0.11.2',
};

/**
 * StackBlitz writer, write example files to StackBlitz.
 *
 * StackBlitz API
 * URL: https://run.stackblitz.com/api/aio/v1/
 * data: {
 *   // File name, directory and content of files
 *   files[file-name1]: file-content1,
 *   files[directory-name/file-name2]: file-content2,
 *   // Can add multiple tags
 *   tags[0]: tag-0,
 *   // Description of StackBlitz
 *   description: description,
 *   // Private or not
 *   private: true
 *  // Dependencies
 *  dependencies: dependencies
 * }
 */
@Injectable()
export class StackblitzWriterService {
  constructor(private _http: HttpClient) {}

  /**
   * Returns an HTMLFormElement that will open a new StackBlitz template with the example data when
   * called with submit().
   */
  constructStackBlitzForm(data: ExampleData): Promise<HTMLFormElement> {
    const form = this._createFormElement(data.indexFilename);

    TAGS.forEach((tag, i) => this._appendFormInput(form, `tags[${i}]`, tag));
    this._appendFormInput(form, 'private', 'true');
    this._appendFormInput(form, 'description', data.description);
    this._appendFormInput(form, 'dependencies', JSON.stringify(dependencies));

    const moduleFile = data.business
      ? 'src/app/sbb-business.module.ts'
      : 'src/app/sbb-public.module.ts';

    return Promise.all(
      TEMPLATE_FILES.map((file) =>
        this._readFile(file, TEMPLATE_PATH)
          .toPromise()
          .then((response: string) => {
            if (file.includes('app.module.ts')) {
              // add currently selected component to declarations and bootstrap it
              response = response
                .replace(/\{componentName\}/g, data.componentName)
                .replace(/\{selectorName\}/g, data.selectorName)
                .replace(
                  /\{moduleName\}/g,
                  data.business ? 'sbb-business.module' : 'sbb-public.module'
                );
            } else if (file.includes('src/index.html')) {
              response = response
                .replace(/my-app/g, `sbb-${data.selectorName}`)
                .replace('{{version}}', libraryVersion);
            } else if (file.includes('angular.json')) {
              response = response.replace(
                '"src/styles.scss"',
                `"src/styles.scss", "node_modules/@sbb-esta/angular-${
                  data.business ? 'business' : 'public'
                }/typography.css"`
              );
            }
            this._addFileToForm(form, data, response, file, TEMPLATE_PATH, false);
          })
      ).concat(
        this._readFile(moduleFile, TEMPLATE_PATH)
          .toPromise()
          .then((response: string) => {
            response = response.replace(
              /\{packageName\}/g,
              data.business ? '@sbb-esta/angular-business' : '@sbb-esta/angular-public'
            );
            this._addFileToForm(form, data, response, moduleFile, TEMPLATE_PATH, false);
          })
      )
    ).then(() => {
      // remove ".component" filename section from html template URL
      data.exampleFiles.forEach((file) => {
        if (file.name.includes('.ts')) {
          file.content = file.content.replace('component.html', 'html');
          file.content = file.content.replace('component.css', 'scss');
        }
      });

      data.exampleFiles.forEach((file) =>
        this._addFileToForm(form, data, file.content, file.name, CONTENT_PATH)
      );

      return form;
    });
  }

  /** Constructs a new form element that will navigate to the StackBlitz url. */
  _createFormElement(indexFile: string): HTMLFormElement {
    const form = document.createElement('form');
    form.action = `${STACKBLITZ_URL}?file=src%2Fapp%2F${indexFile}`;
    form.method = 'post';
    form.target = '_blank';
    return form;
  }

  /** Appends the name and value as an input to the form. */
  _appendFormInput(form: HTMLFormElement, name: string, value: string): void {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  /**
   * Reads the file and returns it as an Observable
   * @param filename file name of the example
   * @param path path to the src
   */
  _readFile(filename: string, path: string): Observable<any> {
    return this._http.get(path + filename, { responseType: 'text' });
  }

  /**
   * Adds the file text to the form.
   * @param form the html form you are appending to
   * @param data example metadata about the example
   * @param content file contents
   * @param filename file name of the example
   * @param path path to the src
   * @param prependApp whether to prepend the 'src/app' prefix to the path
   */
  _addFileToForm(
    form: HTMLFormElement,
    data: ExampleData,
    content: string,
    filename: string,
    path: string,
    prependApp = true
  ) {
    if (prependApp) {
      filename = 'src/app/' + filename;
    }
    this._appendFormInput(form, `files[${filename}]`, content);
  }
}
