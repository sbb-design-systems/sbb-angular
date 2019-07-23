import { Package } from 'dgeni';
import { ReadTypeScriptModules } from 'dgeni-packages/typescript/processors/readTypeScriptModules';
import { TsParser } from 'dgeni-packages/typescript/services/TsParser';
import { basename, join, relative } from 'path';

import { Categorizer } from './processors/categorizer';
import { ComponentGrouper } from './processors/component-grouper';
import { DocsPrivateFilter } from './processors/docs-private-filter';
import { FilterDuplicateExports } from './processors/filter-duplicate-exports';
import { MergeInheritedProperties } from './processors/merge-inherited-properties';

// Dgeni packages that the SACL docs package depends on.
const jsdocPackage = require('dgeni-packages/jsdoc');
const nunjucksPackage = require('dgeni-packages/nunjucks');
const typescriptPackage = require('dgeni-packages/typescript');

// Project configuration.
const templateDir = join(__dirname, 'templates');

export function preparePackage(rootDir: string, packages: string[], outputDir: string) {
  /**
   * Dgeni package for the SACL docs. This just defines the package, but doesn't
   * generate the docs yet.
   */
  const apiDocsPackage = new Package('sacl-api-docs', [
    jsdocPackage,
    nunjucksPackage,
    typescriptPackage
  ]);

  // Processor that filters out duplicate exports that should not be shown in the docs.
  apiDocsPackage.processor(new FilterDuplicateExports());

  // Processor that merges inherited properties of a class with the class doc.
  apiDocsPackage.processor(new MergeInheritedProperties());

  // Processor that filters out symbols that should not be shown in the docs.
  apiDocsPackage.processor(new DocsPrivateFilter());

  // Processor that appends categorization flags to the docs, e.g. `isDirective`, `isNgModule`, etc.
  apiDocsPackage.processor(new Categorizer());

  // Processor to group components into top-level groups such as "Tabs", "Sidenav", etc.
  apiDocsPackage.processor(new ComponentGrouper());

  // Configure the log level of the API docs dgeni package.
  apiDocsPackage.config((log: any) => (log.level = 'info'));

  // Configure the processor for reading files from the file system.
  apiDocsPackage.config((readFilesProcessor: any, writeFilesProcessor: any) => {
    readFilesProcessor.basePath = rootDir;
    readFilesProcessor.$enabled = false; // disable for now as we are using readTypeScriptModules

    writeFilesProcessor.outputFolder = outputDir;
  });

  // Configure the output path for written files (i.e., file names).
  apiDocsPackage.config((computePathsProcessor: any) => {
    computePathsProcessor.pathTemplates = [
      {
        docTypes: ['componentGroup'],
        pathTemplate: '${name}',
        outputPathTemplate: '${name}.html'
      }
    ];
  });

  // Configure custom JsDoc tags.
  apiDocsPackage.config((parseTagsProcessor: any) => {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([
      { name: 'docs-private' },
      { name: 'breaking-change' }
    ]);
  });

  // Configure the processor for understanding TypeScript.
  apiDocsPackage.config((readTypeScriptModules: ReadTypeScriptModules, tsParser: TsParser) => {
    readTypeScriptModules.basePath = rootDir;
    readTypeScriptModules.ignoreExportsMatching = [/^_/];
    readTypeScriptModules.hidePrivateMembers = true;

    const typescriptPathMap: any = {};

    /*
    packages.forEach(packageName => 
      typescriptPathMap[`sbb-angular/${packageName}`] = [`./lib/${packageName}/${packageName}.ts`]
    );
    */

    // Add proper path mappings to the TSParser service of Dgeni. This ensures that properties
    // from mixins (e.g. color, disabled) are showing up properly in the docs.
    tsParser.options.paths = typescriptPathMap;
    tsParser.options.baseUrl = rootDir;

    // Entry points for docs generation. All publicly exported symbols found through these
    // files will have docs generated.
    readTypeScriptModules.sourceFiles = [
      ...packages.map(p => join(relative(rootDir, p), basename(p)))
    ];
  });

  // Configure processor for finding nunjucks templates.
  apiDocsPackage.config((templateFinder: any, templateEngine: any) => {
    // Where to find the templates for the doc rendering
    templateFinder.templateFolders = [templateDir];

    // Standard patterns for matching docs to templates
    templateFinder.templatePatterns = [
      '${ doc.template }',
      '${ doc.id }.${ doc.docType }.template.html',
      '${ doc.id }.template.html',
      '${ doc.docType }.template.html',
      '${ doc.id }.${ doc.docType }.template.js',
      '${ doc.id }.template.js',
      '${ doc.docType }.template.js',
      '${ doc.id }.${ doc.docType }.template.json',
      '${ doc.id }.template.json',
      '${ doc.docType }.template.json',
      'common.template.html'
    ];

    // Dgeni disables autoescape by default, but we want this turned on.
    templateEngine.config.autoescape = true;

    // Nunjucks and Angular conflict in their template bindings so change Nunjucks
    templateEngine.config.tags = {
      variableStart: '{$',
      variableEnd: '$}'
    };
  });

  return apiDocsPackage;
}
