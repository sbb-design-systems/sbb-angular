import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  'angular.json',
  'tsconfig.json',
  'src/main.ts',
  'src/polyfills.ts',
  'src/styles.css',
  'src/app/app.module.ts',
];

/**
 * Stackblitz tags
 */
const TAGS: string[] = ['sbb', 'angular', 'example'];

/**
 * Dependencies for the Stackblitz project
 * '*': latest version
 */
const dependencies = {
  '@angular/animations': '*',
  '@angular/cdk': '*',
  '@angular/common': '*',
  '@angular/compiler': '*',
  '@angular/core': '*',
  '@angular/forms': '*',
  '@angular/platform-browser': '*',
  '@angular/platform-browser-dynamic': '*',
  '@angular/router': '*',
  '@sbb-esta/angular-core': '*',
  '@sbb-esta/angular-icons': '*',
  '@sbb-esta/angular-public': '*',
  '@sbb-esta/angular-business': '*',
  'core-js': '2.6.9',
  rxjs: '>=6.5.5 <7.0.0',
  tslib: '*',
  'zone.js': '~0.10.3',
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

    this._addFileToForm(
      form,
      data,
      `<sbb-${data.selectorName}>loading</sbb-${data.selectorName}>`,
      'src/index.html',
      '',
      false
    );

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
