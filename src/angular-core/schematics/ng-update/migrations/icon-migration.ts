import { UpdateRecorder } from '@angular-devkit/schematics';
import {
  DevkitContext,
  getSourceNodes,
  Migration,
  parse5,
  ResolvedResource,
  TargetVersion,
  WorkspacePath,
} from '@angular/cdk/schematics';
import type { Attribute, DefaultTreeDocument, DefaultTreeElement } from 'parse5';
import { basename } from 'path';
import * as ts from 'typescript';

const parse: typeof import('parse5') = parse5;

export class IconMigration extends Migration<any, DevkitContext> {
  readonly sbbIconModule = 'SbbIconModule';
  readonly sbbIconTestingModule = 'SbbIconTestingModule';
  readonly sbbIconComponent = 'SbbIcon';
  readonly sbbIconFitClass = 'sbb-icon-fit';
  readonly sbbIconMigrationWarning =
    '/* TODO(icon-migration): Check if still working as intended */';
  readonly sbbIconCssReplacement = `.sbb-icon ${this.sbbIconMigrationWarning}`;
  printer = ts.createPrinter();
  // TODO: Adapt for TargetVersion.V11
  enabled: boolean = this.targetVersion === ('version 11' as TargetVersion);

  private _tsIconOccurences = new Map<ts.SourceFile, TsMigrationContext>();
  private _templateIconOccurences = new Map<WorkspacePath, TemplateMigrationContext>();
  private _stylesheetIconOccurences = new Map<WorkspacePath, StylesheetMigrationContext>();
  private _stylesheetRulesRegExp = `(^|[,\\s\\(>+~])(\\.sbb-icon[^,\\s\\(>+~:\\)]*|${Object.keys(
    ICON_MAPPINGS
  )
    .sort((a, b) => b.length - a.length)
    .join('|')})[,\\s\\(>+~:\\)]`;

  /** Method can be used to perform global analysis of the program. */
  init(): void {
    this.logger.info(
      'This migration will attempt a best-effort conversion of the deprecated ' +
        '@sbb-esta/angular-icons icons to @sbb-esta/angular-core/icon icons. We recommend ' +
        'controlling migration changes in order to avoid incompatibilities.'
    );
  }

  /**
   * Method that will be called for each node in a given source file. Unlike tslint, this
   * function will only retrieve TypeScript nodes that need to be casted manually. This
   * allows us to only walk the program source files once per program and not per
   * migration rule (significant performance boost).
   */
  visitNode(node: ts.Node): void {
    if (this._isInSbbAngularIconsModule(node.getSourceFile().fileName)) {
      return;
    } else if (ts.isImportDeclaration(node)) {
      this._visitImportNode(node);
    } else if (this._isSpecFile(node) && ts.isStringLiteral(node)) {
      this._visitStringLiteralNode(node);
    }
  }

  private _visitImportNode(declaration: ts.ImportDeclaration) {
    if (
      !ts.isStringLiteralLike(declaration.moduleSpecifier) ||
      !declaration.importClause ||
      !declaration.importClause.namedBindings ||
      // If the import module is not @angular/material, skip the check.
      !declaration.moduleSpecifier.text.startsWith('@sbb-esta/angular-icons')
    ) {
      return;
    }

    const namedBindings = declaration.importClause.namedBindings;
    if (!ts.isNamedImports(namedBindings)) {
      return;
    }

    const context = this._resolveMigrationContext(declaration.getSourceFile());
    context.declarations.push(declaration);
    context.identifiers.push(...namedBindings.elements.map((e) => e.name).filter(ts.isIdentifier));
  }

  private _visitStringLiteralNode(stringLiteral: ts.StringLiteral) {
    const matches = this._matchCssIconRules(stringLiteral.text);
    if (!matches.length) {
      return;
    }

    const context = this._resolveMigrationContext(stringLiteral.getSourceFile());
    context.stringLiterals.set(stringLiteral, matches);
  }

  private _resolveMigrationContext(sourceFile: ts.SourceFile) {
    let context = this._tsIconOccurences.get(sourceFile);
    if (!context) {
      const filePath = this.fileSystem.resolve(sourceFile.fileName);
      const recorder = this.fileSystem.edit(filePath);
      context = new TsMigrationContext(sourceFile, recorder);
      this._tsIconOccurences.set(sourceFile, context);
    }

    return context;
  }

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    if (this._isInSbbAngularIconsModule(template.filePath as any)) {
      return;
    }

    const document = parse.parseFragment(template.content, {
      sourceCodeLocationInfo: true,
    }) as DefaultTreeDocument;
    const elements: DefaultTreeElement[] = [];

    const visitNodes = (nodes: any[]) => {
      nodes.forEach((node: any) => {
        if (node.childNodes) {
          visitNodes(node.childNodes);
        }

        if (
          (node.nodeName === 'svg' && node.attrs.some((a: any) => a.name in SVG_ICON_MAPPINGS)) ||
          node.nodeName in ICON_MAPPINGS
        ) {
          elements.push(node);
        }
      });
    };

    visitNodes(document.childNodes);

    if (!elements.length) {
      return;
    }

    let context = this._templateIconOccurences.get(template.filePath);
    if (!context) {
      const recorder = this.fileSystem.edit(template.filePath);
      context = new TemplateMigrationContext(recorder);
      this._templateIconOccurences.set(template.filePath, context);
    }

    context.resources.set(template, elements);
  }

  /** Method that will be called for each stylesheet in the program. */
  visitStylesheet(stylesheet: ResolvedResource): void {
    if (this._isInSbbAngularIconsModule(stylesheet.filePath as any)) {
      return;
    }

    const matches = this._matchCssIconRules(stylesheet.content);
    if (!matches.length) {
      return;
    }

    let context = this._stylesheetIconOccurences.get(stylesheet.filePath);
    if (!context) {
      const recorder = this.fileSystem.edit(stylesheet.filePath);
      context = new StylesheetMigrationContext(recorder);
      this._stylesheetIconOccurences.set(stylesheet.filePath, context);
    }

    context.resources.set(stylesheet, matches);
  }

  /**
   * Method that will be called once all nodes, templates and stylesheets
   * have been visited.
   */
  postAnalysis(): void {
    this._processTypeScriptFiles();
    this._processTemplates();
    this._processStylesheets();
  }

  // Skip our internal angular-icons packages/showcase section.
  private _isInSbbAngularIconsModule(fileName: string) {
    return (
      basename(this.context.workspaceFsPath) === 'sbb-angular' &&
      this.context.projectName === 'angular-showcase' &&
      [
        'angular-core/icon',
        'angular-icons',
        'showcase/app/icons',
        'showcase/app/core/icon-overview',
      ].some((p) => fileName.includes(p))
    );
  }

  private _matchCssIconRules(content: string) {
    const iconRegex = new RegExp(this._stylesheetRulesRegExp, 'gm');
    const matches: RuleOccurence[] = [];
    let m: RegExpExecArray | null;
    while ((m = iconRegex.exec(content))) {
      matches.push({
        match: m[2],
        start: m.index + m[0].indexOf(m[2]),
        width: m[2].length,
      });
    }

    return matches;
  }

  private _processTypeScriptFiles() {
    this._tsIconOccurences.forEach((context) => {
      this._replaceModules(context);
      this._replaceComponents(context);
      this._replaceImports(context);
      this._replaceStringLiterals(context);
    });
  }

  private _replaceModules(context: TsMigrationContext) {
    const moduleIdentifiers = context.moduleIdentifiers;
    if (!moduleIdentifiers.length) {
      return;
    }

    const iconModule = this._isSpecFile(context.sourceFile)
      ? `${this.sbbIconModule}, ${this.sbbIconTestingModule}`
      : this.sbbIconModule;
    const identifierOccurences = getSourceNodes(context.sourceFile).filter((n) =>
      moduleIdentifiers.some((i) => i.text === n.getText())
    );
    const arraysWithIconModules = identifierOccurences
      .filter((i) => ts.isArrayLiteralExpression(i.parent))
      .reduce((a, i) => {
        if (!a.has(i.parent)) {
          a.set(i.parent, []);
        }
        a.get(i.parent)!.push(i);
        return a;
      }, new Map<ts.Node, ts.Node[]>());
    arraysWithIconModules.forEach((iconModules, array) => {
      const [firstModule, ...otherModules] = iconModules;
      context.recorder.remove(firstModule.getStart(), firstModule.getWidth());
      context.recorder.insertRight(firstModule.getStart(), iconModule);
      otherModules.forEach((m) => {
        const children = array
          .getChildren()
          .find((c) => c.kind === ts.SyntaxKind.SyntaxList)!
          ?.getChildren();
        if (children) {
          const moduleIndex = children.indexOf(m);
          if (children[moduleIndex - 1]?.kind === ts.SyntaxKind.CommaToken) {
            const commaToken = children[moduleIndex - 1];
            context.recorder.remove(commaToken.getStart(), m.getEnd() - commaToken.getStart());
          } else if (children[moduleIndex + 1]?.kind === ts.SyntaxKind.CommaToken) {
            const commaToken = children[moduleIndex + 1];
            context.recorder.remove(m.getStart(), commaToken.getEnd() - m.getStart());
          } else {
            context.recorder.remove(m.getStart(), m.getWidth());
          }
        }
      });
    });
  }

  private _replaceComponents(context: TsMigrationContext) {
    const componentIdentifiers = context.componentIdentifiers;
    if (!componentIdentifiers.length) {
      return;
    }
    const identifierOccurences = getSourceNodes(context.sourceFile).filter(
      (n) => ts.isIdentifier(n) && componentIdentifiers.some((i) => i.text === n.getText())
    );
    identifierOccurences.forEach((i) => {
      context.recorder.remove(i.getStart(), i.getWidth());
      context.recorder.insertRight(i.getStart(), this.sbbIconComponent);
    });
  }

  private _replaceImports(context: TsMigrationContext) {
    if (!context.declarations.length) {
      return;
    }

    const singleQuoteImport = context.declarations[0].moduleSpecifier.getText()[0] === `'`;
    const componentImportSpecifier = context.componentIdentifiers.length
      ? this.sbbIconComponent
      : undefined;
    const moduleImportSpecifier = context.moduleIdentifiers.length ? this.sbbIconModule : undefined;
    const testingModuleImportSpecifier = context.moduleIdentifiers.length
      ? this.sbbIconTestingModule
      : undefined;
    const iconImports = [componentImportSpecifier, moduleImportSpecifier].filter(
      (s): s is string => !!s
    );

    const importDeclarations: ts.ImportDeclaration[] = [
      this._createImports(iconImports, '@sbb-esta/angular-core/icon', singleQuoteImport),
    ];
    if (this._isSpecFile(context.sourceFile) && testingModuleImportSpecifier) {
      importDeclarations.push(
        this._createImports(
          [testingModuleImportSpecifier],
          '@sbb-esta/angular-core/icon/testing',
          singleQuoteImport
        )
      );
    }
    const newImportStatement = importDeclarations
      .map((newImport) =>
        this.printer.printNode(ts.EmitHint.Unspecified, newImport, context.sourceFile)
      )
      .join('\n');

    const [firstDeclaration, ...declarations] = context.declarations;
    context.recorder.remove(firstDeclaration.getStart(), firstDeclaration.getWidth());
    context.recorder.insertRight(firstDeclaration.getStart(), newImportStatement);
    declarations.forEach((d) => context.recorder.remove(d.getStart(), d.getWidth()));
  }

  private _createImports(
    importSpecifiers: string[],
    importPath: string,
    singleQuoteImport: boolean
  ) {
    return ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports(
          importSpecifiers.map((s) => ts.createImportSpecifier(undefined, ts.createIdentifier(s)))
        )
      ),
      createStringLiteral(importPath, singleQuoteImport)
    );
  }

  private _replaceStringLiterals(context: TsMigrationContext) {
    context.stringLiterals.forEach((matches, stringLiteral) => {
      const replacedValue = matches
        .sort((a, b) => b.start - a.start)
        .reduce((value, match) => {
          const replacement = this._createReplacementCssRule(match, true);
          return (
            value.substring(0, match.start) +
            replacement +
            value.substring(match.start + match.width)
          );
        }, stringLiteral.text);
      const singleQuote = stringLiteral.getFullText()[0] === `'`;
      const newValue = this.printer.printNode(
        ts.EmitHint.Unspecified,
        createStringLiteral(replacedValue, singleQuote),
        context.sourceFile
      );
      context.recorder.remove(stringLiteral.getStart(), stringLiteral.getWidth());
      context.recorder.insertRight(
        stringLiteral.getStart(),
        `${newValue} ${this.sbbIconMigrationWarning}`
      );
    });
  }

  private _processTemplates() {
    this._templateIconOccurences.forEach((context, fileName) => {
      this.logger.info(fileName as any);
      context.resources.forEach((elements, resource) => {
        for (const element of elements) {
          const { fit, size, width, height } = this._resolveIconDimensions(element);
          const attrs = this._normalizeAttributes(element, resource.content, fit);
          const iconName = this._resolveIconName(element, size);

          const attributes = [
            `svgIcon="${iconName}"`,
            width,
            height,
            ...attrs.map((a) => (a.value ? `${a.name}="${a.value}"` : a.name)),
          ]
            .filter((v) => v)
            .join(' ');
          const iconString = `<sbb-icon ${attributes}></sbb-icon>`;

          const start = resource.start + element.sourceCodeLocation!.startOffset;
          const tagWidth =
            element.sourceCodeLocation!.endOffset - element.sourceCodeLocation!.startOffset;
          context.recorder.remove(start, tagWidth);
          context.recorder.insertRight(start, iconString);
        }
      });
    });
  }

  private _resolveIconDimensions(element: DefaultTreeElement) {
    let fit = false;
    let size = 'small';
    const elementAttrs = element.attrs || [];
    if (elementAttrs.some((a) => a.name === 'size')) {
      const attrSize = elementAttrs.find((a) => a.name === 'size')?.value ?? '';
      fit = attrSize.endsWith('grow');
      size = attrSize.startsWith('large')
        ? 'large'
        : attrSize.startsWith('medium')
        ? 'medium'
        : 'small';
    }

    const width = this._resolveSize(elementAttrs, 'width');
    const height = this._resolveSize(elementAttrs, 'height');

    return { fit, size, width, height };
  }

  private _resolveSize(attrs: Attribute[], variant: string) {
    let value = attrs.find((a) => a.name === variant)?.value;
    if (value) {
      return `[style.${variant}]="'${value}'"`;
    }

    value = attrs.find((a) => a.name === `[${variant}]`)?.value;
    return value ? `[style.${variant}]="${value}"` : undefined;
  }

  private _normalizeAttributes(element: DefaultTreeElement, content: string, fit: boolean) {
    if (!element.attrs.length) {
      return [];
    }

    const attrs = element.attrs.filter((a) =>
      ['size', 'width', '[width]', 'height', '[height]', 'svgclass', '[svgclass]'].every(
        (n) => a.name !== n
      )
    );
    const svgClass =
      element.attrs.find((a) => a.name === 'svgclass')?.value ??
      element.attrs.find((a) => a.name === '[svgclass]')?.value.match(/^'([^']+)'$/)?.[1];
    const attr = element.attrs.find((a) => a.name === 'class');
    if (attr?.value) {
      attr.value = attr.value
        .replace(
          /(^sbb-icon-fixed-size$|^sbb-icon-fixed-size | sbb-icon-fixed-size$|^sbb-icon-inherit-color$|^sbb-icon-inherit-color | sbb-icon-inherit-color$)/g,
          ' '
        )
        .replace(/$/, fit ? ` ${this.sbbIconFitClass}` : '')
        .replace(/$/, svgClass ? ` ${svgClass}` : '')
        .trim();
    } else if (fit || svgClass) {
      attrs.push({
        name: 'class',
        value: `${fit ? this.sbbIconFitClass : ''} ${svgClass || ''}`.trim(),
      });
    }

    attrs.forEach((a) => {
      const match = content
        .substring(
          element.sourceCodeLocation!.startOffset,
          element.sourceCodeLocation!.startTag.endOffset
        )
        .match(new RegExp(` (${this._escapeRegExp(a.name)})[ >=]`, 'i'));
      if (match) {
        a.name = match[1];
      }
    });

    return attrs;
  }

  private _resolveIconName(element: DefaultTreeElement, size: string) {
    if (element.nodeName === 'svg') {
      const selector = element.attrs.find((a) => a.name.startsWith('sbbicon'))?.name;
      return selector ? SVG_ICON_MAPPINGS[selector]?.[0] : undefined;
    } else {
      const variants: string[] = ICON_MAPPINGS[element.nodeName];
      return variants.length === 1
        ? variants[0]
        : variants.find((v) => v.endsWith(size)) ?? variants[0];
    }
  }

  private _processStylesheets() {
    this._stylesheetIconOccurences.forEach((context) => {
      context.resources.forEach((rules, resource) => {
        for (const rule of rules) {
          const start = resource.start + rule.start;
          context.recorder.remove(start, rule.width);
          context.recorder.insertRight(
            start,
            `${this._createReplacementCssRule(rule, false)} ${this.sbbIconMigrationWarning}`
          );
        }
      });
    });
  }

  private _isSpecFile(node: ts.Node) {
    return node.getSourceFile().fileName.endsWith('.spec.ts');
  }

  private _createReplacementCssRule(rule: RuleOccurence, camelCase: boolean) {
    const svgIconSelector = camelCase ? 'svgIcon' : 'svgicon';
    return rule.match.startsWith('.sbb-icon') || !(rule.match in ICON_MAPPINGS)
      ? '.sbb-icon'
      : `.sbb-icon[${svgIconSelector}^="${ICON_MAPPINGS[rule.match][0].replace(
          /-(small|medium|large)$/,
          ''
        )}"]`;
  }

  private _escapeRegExp(value: string) {
    return value.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}

/**
 * Creates a string literal from the specified text.
 * @param text Text of the string literal.
 * @param singleQuotes Whether single quotes should be used when printing the literal node.
 */
function createStringLiteral(text: string, singleQuotes: boolean): ts.StringLiteral {
  const literal = ts.createStringLiteral(text);
  // See: https://github.com/microsoft/TypeScript/blob/master/src/compiler/utilities.ts#L584-L590
  literal['singleQuote'] = singleQuotes;
  return literal;
}

class TsMigrationContext {
  readonly declarations: ts.ImportDeclaration[] = [];
  readonly identifiers: ts.Identifier[] = [];
  readonly stringLiterals = new Map<ts.StringLiteral, RuleOccurence[]>();
  get moduleIdentifiers() {
    return this.identifiers.filter((i) => i.text.endsWith('Module'));
  }
  get componentIdentifiers() {
    return this.identifiers.filter((i) => i.text.startsWith('Icon') && !i.text.endsWith('Module'));
  }
  constructor(readonly sourceFile: ts.SourceFile, readonly recorder: UpdateRecorder) {}
}

class TemplateMigrationContext {
  readonly resources = new Map<ResolvedResource, DefaultTreeElement[]>();
  constructor(readonly recorder: UpdateRecorder) {}
}

interface RuleOccurence {
  match: string;
  start: number;
  width: number;
}

class StylesheetMigrationContext {
  readonly resources = new Map<ResolvedResource, RuleOccurence[]>();
  constructor(readonly recorder: UpdateRecorder) {}
}

const ICON_MAPPINGS = {
  'sbb-icon-arrow-circle': ['kom:arrow-circle-small', 'kom:arrow-circle-medium'],
  'sbb-icon-arrow-long-left': ['kom:arrow-long-left-small', 'kom:arrow-long-left-medium'],
  'sbb-icon-arrow-long-right': ['kom:arrow-long-right-small', 'kom:arrow-long-right-medium'],
  'sbb-icon-arrow-right': ['kom:arrow-right-small', 'kom:arrow-right-medium'],
  'sbb-icon-arrows-circle': ['kom:arrows-circle-small', 'kom:arrows-circle-medium'],
  'sbb-icon-arrows-left-right-down-up': [
    'kom:arrows-left-right-down-up-small',
    'kom:arrows-left-right-down-up-medium',
  ],
  'sbb-icon-arrows-left-right': ['kom:arrows-left-right-small', 'kom:arrows-left-right-medium'],
  'sbb-icon-arrows-right-left': ['kom:arrows-right-left-small', 'kom:arrows-right-left-medium'],
  'sbb-icon-arrows-up-down': ['kom:arrows-up-down-small', 'kom:arrows-up-down-medium'],
  'sbb-icon-chevron-right': ['kom:chevron-right-small', 'kom:chevron-right-medium'],
  'sbb-icon-chevron-small-down-circle': [
    'kom:chevron-small-down-circle-small',
    'kom:chevron-small-down-circle-medium',
  ],
  'sbb-icon-chevron-small-down': ['kom:chevron-small-down-small', 'kom:chevron-small-down-medium'],
  'sbb-icon-chevron-small-left-circle': [
    'kom:chevron-small-left-circle-small',
    'kom:chevron-small-left-circle-medium',
  ],
  'sbb-icon-chevron-small-left': ['kom:chevron-small-left-small', 'kom:chevron-small-left-medium'],
  'sbb-icon-chevron-small-right-circle': [
    'kom:chevron-small-right-circle-small',
    'kom:chevron-small-right-circle-medium',
  ],
  'sbb-icon-chevron-small-right': [
    'kom:chevron-small-right-small',
    'kom:chevron-small-right-medium',
  ],
  'sbb-icon-chevron-small-up-circle': [
    'kom:chevron-small-up-circle-small',
    'kom:chevron-small-up-circle-medium',
  ],
  'sbb-icon-chevron-small-up': ['kom:chevron-small-up-small', 'kom:chevron-small-up-medium'],
  'sbb-icon-increase-size': ['kom:increase-size-small', 'kom:increase-size-medium'],
  'sbb-icon-reduce-size': ['kom:reduce-size-small', 'kom:reduce-size-medium'],
  'sbb-icon-fast-forward': ['kom:fast-forward-small', 'kom:fast-forward-medium'],
  'sbb-icon-next': ['kom:next-small', 'kom:next-medium'],
  'sbb-icon-pause': ['kom:pause-small', 'kom:pause-medium'],
  'sbb-icon-play': ['kom:play-small', 'kom:play-medium'],
  'sbb-icon-previous': ['kom:previous-small', 'kom:previous-medium'],
  'sbb-icon-record': ['kom:record-small', 'kom:record-medium'],
  'sbb-icon-rewind': ['kom:rewind-small', 'kom:rewind-medium'],
  'sbb-icon-stop': ['kom:stop-small', 'kom:stop-medium'],
  'sbb-icon-alarm-clock': ['kom:alarm-clock-small', 'kom:alarm-clock-medium'],
  'sbb-icon-app-icon': ['kom:app-icon-small', 'kom:app-icon-medium'],
  'sbb-icon-apple-bag': ['kom:apple-bag-small', 'kom:apple-bag-medium'],
  'sbb-icon-backpack': ['kom:backpack-small', 'kom:backpack-medium'],
  'sbb-icon-bell': ['kom:bell-small', 'kom:bell-medium'],
  'sbb-icon-binoculars': ['kom:binoculars-small', 'kom:binoculars-medium'],
  'sbb-icon-browser': ['kom:browser-small', 'kom:browser-medium'],
  'sbb-icon-calendar': ['kom:calendar-small', 'kom:calendar-medium', 'kom:calendar-large'],
  'sbb-icon-camera': ['kom:camera-small', 'kom:camera-medium'],
  'sbb-icon-chart-column-trend': [
    'kom:chart-column-trend-small',
    'kom:chart-column-trend-medium',
    'kom:chart-column-trend-large',
  ],
  'sbb-icon-chart-column': ['kom:chart-column-small', 'kom:chart-column-medium'],
  'sbb-icon-chart-line': ['kom:chart-line-small', 'kom:chart-line-medium'],
  'sbb-icon-chart-pie': ['kom:chart-pie-small', 'kom:chart-pie-medium'],
  'sbb-icon-circle-information-small': ['kom:circle-information-small'],
  'sbb-icon-circle-information': [
    'kom:circle-information-small',
    'kom:circle-information-medium',
    'kom:circle-information-large',
  ],
  'sbb-icon-circle-play': ['kom:circle-play-small', 'kom:circle-play-medium'],
  'sbb-icon-circle-question-mark': [
    'kom:circle-question-mark-small',
    'kom:circle-question-mark-medium',
  ],
  'sbb-icon-coins': ['kom:coins-small', 'kom:coins-medium', 'kom:coins-large'],
  'sbb-icon-contact': ['kom:contact-small', 'kom:contact-medium'],
  'sbb-icon-controls': ['kom:controls-small', 'kom:controls-medium'],
  'sbb-icon-cup-hot': ['kom:cup-hot-small', 'kom:cup-hot-medium'],
  'sbb-icon-cutlery': ['kom:cutlery-small', 'kom:cutlery-medium'],
  'sbb-icon-database': ['kom:database-small', 'kom:database-medium'],
  'sbb-icon-dog': ['kom:dog-small', 'kom:dog-medium'],
  'sbb-icon-download-large-data': [
    'kom:download-large-data-small',
    'kom:download-large-data-medium',
  ],
  'sbb-icon-download-small-data': [
    'kom:download-small-data-small',
    'kom:download-small-data-medium',
  ],
  'sbb-icon-download': ['kom:download-small', 'kom:download-medium'],
  'sbb-icon-entrance': ['kom:entrance-small', 'kom:entrance-medium'],
  'sbb-icon-envelope-open': ['kom:envelope-open-small', 'kom:envelope-open-medium'],
  'sbb-icon-envelope': ['kom:envelope-small', 'kom:envelope-medium'],
  'sbb-icon-exit': ['kom:exit-small', 'kom:exit-medium'],
  'sbb-icon-face-king': ['kom:face-king-small', 'kom:face-king-medium'],
  'sbb-icon-face-worker': ['kom:face-worker-small', 'kom:face-worker-medium'],
  'sbb-icon-factory': ['kom:factory-small', 'kom:factory-medium'],
  'sbb-icon-filter-x': ['kom:filter-x-small', 'kom:filter-x-medium'],
  'sbb-icon-filter': ['kom:filter-small', 'kom:filter-medium'],
  'sbb-icon-flashlight-on': ['kom:flashlight-on-small', 'kom:flashlight-on-medium'],
  'sbb-icon-form': ['kom:form-small', 'kom:form-medium'],
  'sbb-icon-gears': ['kom:gears-small', 'kom:gears-medium'],
  'sbb-icon-gift': ['kom:gift-small', 'kom:gift-medium'],
  'sbb-icon-globe': ['kom:globe-small', 'kom:globe-medium'],
  'sbb-icon-hand-heart': ['kom:hand-heart-small', 'kom:hand-heart-medium'],
  'sbb-icon-hand-with-service-bell': [
    'kom:hand-with-service-bell-small',
    'kom:hand-with-service-bell-medium',
  ],
  'sbb-icon-heart': ['kom:heart-small', 'kom:heart-medium'],
  'sbb-icon-hierarchy': ['kom:hierarchy-small', 'kom:hierarchy-medium'],
  'sbb-icon-lighthouse': ['kom:lighthouse-small', 'kom:lighthouse-medium'],
  'sbb-icon-link-external': ['kom:link-external-small', 'kom:link-external-medium'],
  'sbb-icon-link': ['kom:link-small', 'kom:link-medium'],
  'sbb-icon-list': ['kom:list-small', 'kom:list-medium'],
  'sbb-icon-magnifying-glass': ['kom:magnifying-glass-small', 'kom:magnifying-glass-medium'],
  'sbb-icon-mug-hot': ['kom:mug-hot-small', 'kom:mug-hot-medium'],
  'sbb-icon-newspaper': ['kom:newspaper-small', 'kom:newspaper-medium'],
  'sbb-icon-paper-aeroplane': ['kom:paper-aeroplane-small', 'kom:paper-aeroplane-medium'],
  'sbb-icon-paper-clip': ['kom:paper-clip-small', 'kom:paper-clip-medium', 'kom:paper-clip-large'],
  'sbb-icon-pen': ['kom:pen-small', 'kom:pen-medium'],
  'sbb-icon-picture': ['kom:picture-small', 'kom:picture-medium'],
  'sbb-icon-pin': ['kom:pin-small', 'kom:pin-medium'],
  'sbb-icon-rocket': ['kom:rocket-large'],
  'sbb-icon-rss': ['kom:rss-small', 'kom:rss-medium'],
  'sbb-icon-service-bell': ['kom:service-bell-small', 'kom:service-bell-medium'],
  'sbb-icon-shopping-cart': [
    'kom:shopping-cart-small',
    'kom:shopping-cart-medium',
    'kom:shopping-cart-large',
  ],
  'sbb-icon-sign-exclamation-point': [
    'kom:sign-exclamation-point-small',
    'kom:sign-exclamation-point-medium',
  ],
  'sbb-icon-sign-x': ['kom:sign-x-small', 'kom:sign-x-medium'],
  'sbb-icon-spanner': ['kom:spanner-small', 'kom:spanner-medium'],
  'sbb-icon-star': ['kom:star-small', 'kom:star-medium'],
  'sbb-icon-switzerland': ['kom:switzerland-small', 'kom:switzerland-medium'],
  'sbb-icon-tag': ['kom:tag-small', 'kom:tag-medium'],
  'sbb-icon-target': ['kom:target-small', 'kom:target-medium', 'kom:target-large'],
  'sbb-icon-torch': ['kom:torch-small', 'kom:torch-medium'],
  'sbb-icon-trash': ['kom:trash-small', 'kom:trash-medium'],
  'sbb-icon-tree': ['kom:tree-small', 'kom:tree-medium'],
  'sbb-icon-upload': ['kom:upload-small', 'kom:upload-medium'],
  'sbb-icon-wallet': ['kom:wallet-small', 'kom:wallet-medium'],
  'sbb-icon-warning-light': ['kom:warning-light-small', 'kom:warning-light-medium'],
  'sbb-icon-wifi': ['kom:wifi-small', 'kom:wifi-medium'],
  'sbb-icon-building-tree': ['kom:building-tree-large'],
  'sbb-icon-city': ['kom:city-small', 'kom:city-medium', 'kom:city-large'],
  'sbb-icon-curriculum-vitae': ['kom:curriculum-vitae-large'],
  'sbb-icon-hand-graduation-cap': ['kom:hand-graduation-cap-large'],
  'sbb-icon-ship-steering-wheel': [
    'kom:ship-steering-wheel-small',
    'kom:ship-steering-wheel-medium',
  ],
  'sbb-icon-bulb-off': ['kom:bulb-off-small', 'kom:bulb-off-medium'],
  'sbb-icon-bulb-on': ['kom:bulb-on-small', 'kom:bulb-on-medium', 'kom:bulb-on-large'],
  'sbb-icon-face-grinning': ['kom:face-grinning-small', 'kom:face-grinning-medium'],
  'sbb-icon-face-neutral': ['kom:face-neutral-small', 'kom:face-neutral-medium'],
  'sbb-icon-face-sad': ['kom:face-sad-small', 'kom:face-sad-medium'],
  'sbb-icon-face-smiling': ['kom:face-smiling-small', 'kom:face-smiling-medium'],
  'sbb-icon-handshake': ['kom:handshake-small', 'kom:handshake-medium', 'kom:handshake-large'],
  'sbb-icon-network': ['kom:network-small', 'kom:network-medium', 'kom:network-large'],
  'sbb-icon-onboarding': ['kom:onboarding-small', 'kom:onboarding-medium'],
  'sbb-icon-question-answer': ['kom:question-answer-small', 'kom:question-answer-medium'],
  'sbb-icon-share': ['kom:share-small', 'kom:share-medium'],
  'sbb-icon-speech-bubble-group-empty': [
    'kom:speech-bubble-group-empty-small',
    'kom:speech-bubble-group-empty-medium',
  ],
  'sbb-icon-speech-bubble': ['kom:speech-bubble-small', 'kom:speech-bubble-medium'],
  'sbb-icon-thumb-down': ['kom:thumb-down-small', 'kom:thumb-down-medium'],
  'sbb-icon-thumb-up': ['kom:thumb-up-small', 'kom:thumb-up-medium'],
  'sbb-icon-translate': ['kom:translate-small', 'kom:translate-medium'],
  'sbb-icon-two-speech-bubbles': [
    'kom:two-speech-bubbles-small',
    'kom:two-speech-bubbles-medium',
    'kom:two-speech-bubbles-large',
  ],
  'sbb-icon-document-check': ['kom:document-check-small', 'kom:document-check-medium'],
  'sbb-icon-document-image': ['kom:document-image-small', 'kom:document-image-medium'],
  'sbb-icon-document-lock': ['kom:document-lock-small', 'kom:document-lock-medium'],
  'sbb-icon-document-pdf': ['kom:document-pdf-small', 'kom:document-pdf-medium'],
  'sbb-icon-document-plus': ['kom:document-plus-small', 'kom:document-plus-medium'],
  'sbb-icon-document-ppt': ['kom:document-ppt-small', 'kom:document-ppt-medium'],
  'sbb-icon-document-sbb': ['kom:document-sbb-small', 'kom:document-sbb-medium'],
  'sbb-icon-document-sound': ['kom:document-sound-small', 'kom:document-sound-medium'],
  'sbb-icon-document-standard': ['kom:document-standard-small', 'kom:document-standard-medium'],
  'sbb-icon-document-text': ['kom:document-text-small', 'kom:document-text-medium'],
  'sbb-icon-document-video': ['kom:document-video-small', 'kom:document-video-medium'],
  'sbb-icon-document-zip': ['kom:document-zip-small', 'kom:document-zip-medium'],
  'sbb-icon-folder-info': ['kom:folder-info-small', 'kom:folder-info-medium'],
  'sbb-icon-folder-lock': ['kom:folder-lock-small', 'kom:folder-lock-medium'],
  'sbb-icon-folder-open-arrow': ['kom:folder-open-arrow-small', 'kom:folder-open-arrow-medium'],
  'sbb-icon-folder-open': ['kom:folder-open-small', 'kom:folder-open-medium'],
  'sbb-icon-folder-plus': ['kom:folder-plus-small', 'kom:folder-plus-medium'],
  'sbb-icon-metadata': ['kom:metadata-small', 'kom:metadata-medium'],
  'sbb-icon-two-folders': ['kom:two-folders-small', 'kom:two-folders-medium'],
  'sbb-icon-archive-box': ['kom:archive-box-small', 'kom:archive-box-medium'],
  'sbb-icon-briefcase': ['kom:briefcase-small', 'kom:briefcase-medium'],
  'sbb-icon-brochure': ['kom:brochure-small', 'kom:brochure-medium'],
  'sbb-icon-desk-adjustable': ['kom:desk-adjustable-small', 'kom:desk-adjustable-medium'],
  'sbb-icon-desk': ['kom:desk-small', 'kom:desk-medium'],
  'sbb-icon-display': ['kom:display-small', 'kom:display-medium'],
  'sbb-icon-keyboard': ['kom:keyboard-small', 'kom:keyboard-medium'],
  'sbb-icon-laptop-smartphone': [
    'kom:laptop-smartphone-small',
    'kom:laptop-smartphone-medium',
    'kom:laptop-smartphone-large',
  ],
  'sbb-icon-laptop': ['kom:laptop-small', 'kom:laptop-medium'],
  'sbb-icon-megaphone': ['kom:megaphone-small', 'kom:megaphone-medium'],
  'sbb-icon-office-chair': ['kom:office-chair-small', 'kom:office-chair-medium'],
  'sbb-icon-power-plug': ['kom:power-plug-small', 'kom:power-plug-medium'],
  'sbb-icon-printer': ['kom:printer-small', 'kom:printer-medium'],
  'sbb-icon-scanner': ['kom:scanner-small', 'kom:scanner-medium'],
  'sbb-icon-smartphone': ['kom:smartphone-small', 'kom:smartphone-medium', 'kom:smartphone-large'],
  'sbb-icon-speaker': ['kom:speaker-small', 'kom:speaker-medium'],
  'sbb-icon-suitcase-disabled': ['kom:suitcase-disabled-small', 'kom:suitcase-disabled-medium'],
  'sbb-icon-suitcase': ['kom:suitcase-small', 'kom:suitcase-medium'],
  'sbb-icon-telephone-gsm': ['kom:telephone-gsm-small', 'kom:telephone-gsm-medium'],
  'sbb-icon-telephone-receiver': ['kom:telephone-receiver-small', 'kom:telephone-receiver-medium'],
  'sbb-icon-walkie-talkie': ['kom:walkie-talkie-small', 'kom:walkie-talkie-medium'],
  'sbb-icon-weight': ['kom:weight-small', 'kom:weight-medium'],
  'sbb-icon-add-stop': ['fpl:add-stop'],
  'sbb-icon-alternative': ['fpl:alternative'],
  'sbb-icon-cancellation': ['fpl:cancellation'],
  'sbb-icon-delay': ['fpl:delay'],
  'sbb-icon-him-construction': ['fpl:construction'],
  'sbb-icon-him-disruption': ['fpl:disruption'],
  'sbb-icon-him-info': ['fpl:info'],
  'sbb-icon-him-replacementbus': ['fpl:replacementbus'],
  'sbb-icon-missed-connection': ['fpl:missed-connection'],
  'sbb-icon-platform-change': ['fpl:platform-change'],
  'sbb-icon-reroute': ['fpl:reroute'],
  'sbb-icon-utilization-high': ['fpl:utilization-high'],
  'sbb-icon-utilization-low': ['fpl:utilization-low'],
  'sbb-icon-utilization-medium': ['fpl:utilization-medium'],
  'sbb-icon-utilization-none': ['fpl:utilization-none'],
  'sbb-icon-construction': ['kom:construction-small', 'kom:construction-medium'],
  'sbb-icon-railway-switch': [
    'kom:railway-switch-small',
    'kom:railway-switch-medium',
    'kom:railway-switch-large',
  ],
  'sbb-icon-train-signal': [
    'kom:train-signal-small',
    'kom:train-signal-medium',
    'kom:train-signal-large',
  ],
  'sbb-icon-train-tracks': [
    'kom:train-tracks-small',
    'kom:train-tracks-medium',
    'kom:train-tracks-large',
  ],
  'sbb-icon-adult-kids': ['kom:adult-kids-large'],
  'sbb-icon-balloons': ['kom:balloons-large'],
  'sbb-icon-christmas-tree-shopping-bag': ['kom:christmas-tree-shopping-bag-large'],
  'sbb-icon-elephant': ['kom:elephant-large'],
  'sbb-icon-ferris-wheel': ['kom:ferris-wheel-large'],
  'sbb-icon-hiking-boot': ['kom:hiking-boot-large'],
  'sbb-icon-leaf': ['kom:leaf-large'],
  'sbb-icon-locomotive-viaduct': ['kom:locomotive-viaduct-large'],
  'sbb-icon-lucerne-chapel-bridge': ['kom:lucerne-chapel-bridge-large'],
  'sbb-icon-market-shopping-bag': ['kom:market-shopping-bag-large'],
  'sbb-icon-mountain-sun': [
    'kom:mountain-sun-small',
    'kom:mountain-sun-medium',
    'kom:mountain-sun-large',
  ],
  'sbb-icon-museum': ['kom:museum-large'],
  'sbb-icon-music-rock-hand-gesture': ['kom:music-rock-hand-gesture-large'],
  'sbb-icon-railway-ship': ['kom:railway-ship-large'],
  'sbb-icon-sledge-snowshoe': ['kom:sledge-snowshoe-large'],
  'sbb-icon-soccer-ball': ['kom:soccer-ball-large'],
  'sbb-icon-three-adults': ['kom:three-adults-large'],
  'sbb-icon-train-ski': ['kom:train-ski-large'],
  'sbb-icon-two-adults-kid': ['kom:two-adults-kid-large'],
  'sbb-icon-arrow-compass': ['kom:arrow-compass-small', 'kom:arrow-compass-medium'],
  'sbb-icon-gps-disabled': ['kom:gps-disabled-small', 'kom:gps-disabled-medium'],
  'sbb-icon-gps': ['kom:gps-small', 'kom:gps-medium'],
  'sbb-icon-location-pin-a': ['kom:location-pin-a-small', 'kom:location-pin-a-medium'],
  'sbb-icon-location-pin-b': ['kom:location-pin-b-small', 'kom:location-pin-b-medium'],
  'sbb-icon-location-pin-map': ['kom:location-pin-map-small', 'kom:location-pin-map-medium'],
  'sbb-icon-location-pin-pulse-surrounding-area': [
    'kom:location-pin-pulse-surrounding-area-small',
    'kom:location-pin-pulse-surrounding-area-medium',
  ],
  'sbb-icon-location-pin-surrounding-area': [
    'kom:location-pin-surrounding-area-small',
    'kom:location-pin-surrounding-area-medium',
  ],
  'sbb-icon-location-pin': ['kom:location-pin-small', 'kom:location-pin-medium'],
  'sbb-icon-mountain-minus': ['kom:mountain-minus-small', 'kom:mountain-minus-medium'],
  'sbb-icon-mountain-plus': ['kom:mountain-plus-small', 'kom:mountain-plus-medium'],
  'sbb-icon-circle-minus': ['kom:circle-minus-small', 'kom:circle-minus-medium'],
  'sbb-icon-circle-plus': ['kom:circle-plus-small', 'kom:circle-plus-medium'],
  'sbb-icon-context-menu': ['kom:context-menu-small', 'kom:context-menu-medium'],
  'sbb-icon-cross': ['kom:cross-small', 'kom:cross-medium'],
  'sbb-icon-drag': ['kom:drag-small', 'kom:drag-medium'],
  'sbb-icon-hamburger-menu': ['kom:hamburger-menu-small', 'kom:hamburger-menu-medium'],
  'sbb-icon-house': ['kom:house-small', 'kom:house-medium'],
  'sbb-icon-layers': ['kom:layers-small', 'kom:layers-medium'],
  'sbb-icon-minus': ['kom:minus-small', 'kom:minus-medium'],
  'sbb-icon-plus': ['kom:plus-small', 'kom:plus-medium'],
  'sbb-icon-two-finger-tap': ['kom:two-finger-tap-small', 'kom:two-finger-tap-medium'],
  'sbb-icon-book': ['kom:book-small', 'kom:book-medium'],
  'sbb-icon-bottle-apple': ['kom:bottle-apple-small', 'kom:bottle-apple-medium'],
  'sbb-icon-customer-assistance-sbb': [
    'kom:customer-assistance-sbb-small',
    'kom:customer-assistance-sbb-medium',
  ],
  'sbb-icon-escalator': ['kom:escalator-small', 'kom:escalator-medium'],
  'sbb-icon-general-display': ['kom:general-display-small', 'kom:general-display-medium'],
  'sbb-icon-hand-plus-circle': [
    'kom:hand-plus-circle-small',
    'kom:hand-plus-circle-medium',
    'kom:hand-plus-circle-large',
  ],
  'sbb-icon-hand-sbb': ['kom:hand-sbb-small', 'kom:hand-sbb-medium'],
  'sbb-icon-hostel': ['kom:hostel-small', 'kom:hostel-medium'],
  'sbb-icon-lift': ['kom:lift-small', 'kom:lift-medium'],
  'sbb-icon-locker': ['kom:locker-small', 'kom:locker-medium'],
  'sbb-icon-lotus': ['kom:lotus-small', 'kom:lotus-medium', 'kom:lotus-large'],
  'sbb-icon-meeting-point': ['kom:meeting-point-small', 'kom:meeting-point-medium'],
  'sbb-icon-money-exchange': ['kom:money-exchange-small', 'kom:money-exchange-medium'],
  'sbb-icon-platform-display': ['kom:platform-display-small', 'kom:platform-display-medium'],
  'sbb-icon-platform': ['kom:platform-large'],
  'sbb-icon-screen-inside-train': [
    'kom:screen-inside-train-small',
    'kom:screen-inside-train-medium',
  ],
  'sbb-icon-shirt-shoe': ['kom:shirt-shoe-small', 'kom:shirt-shoe-medium'],
  'sbb-icon-shopping-bag-coupon': [
    'kom:shopping-bag-coupon-small',
    'kom:shopping-bag-coupon-medium',
  ],
  'sbb-icon-shopping-bag-fast': ['kom:shopping-bag-fast-small', 'kom:shopping-bag-fast-medium'],
  'sbb-icon-shopping-bag': ['kom:shopping-bag-small', 'kom:shopping-bag-medium'],
  'sbb-icon-station-surrounding-area': [
    'kom:station-surrounding-area-small',
    'kom:station-surrounding-area-medium',
  ],
  'sbb-icon-station': ['kom:station-small', 'kom:station-medium', 'kom:station-large'],
  'sbb-icon-ticket-machine-ticket': [
    'kom:ticket-machine-ticket-small',
    'kom:ticket-machine-ticket-medium',
  ],
  'sbb-icon-ticket-machine': ['kom:ticket-machine-small', 'kom:ticket-machine-medium'],
  'sbb-icon-toilet': ['kom:toilet-small', 'kom:toilet-medium'],
  'sbb-icon-train-station': ['kom:train-station-small', 'kom:train-station-medium'],
  'sbb-icon-waiting-room': ['kom:waiting-room-small', 'kom:waiting-room-medium'],
  'sbb-icon-wine-cheese': ['kom:wine-cheese-small', 'kom:wine-cheese-medium'],
  'sbb-icon-button-power': ['kom:button-power-small', 'kom:button-power-medium'],
  'sbb-icon-exclamation-point': ['kom:exclamation-point-small', 'kom:exclamation-point-medium'],
  'sbb-icon-eye-disabled': ['kom:eye-disabled-small', 'kom:eye-disabled-medium'],
  'sbb-icon-eye': ['kom:eye-small', 'kom:eye-medium'],
  'sbb-icon-lock-closed': ['kom:lock-closed-small', 'kom:lock-closed-medium'],
  'sbb-icon-lock-open': ['kom:lock-open-small', 'kom:lock-open-medium'],
  'sbb-icon-question-mark': ['kom:question-mark-small', 'kom:question-mark-medium'],
  'sbb-icon-tick-clipboard': ['kom:clipboard-tick-small', 'kom:clipboard-tick-medium'],
  'sbb-icon-tick': ['kom:tick-small', 'kom:tick-medium'],
  'sbb-icon-qrcode-disabled': ['kom:qrcode-disabled-small', 'kom:qrcode-disabled-medium'],
  'sbb-icon-qrcode': ['kom:qrcode-small', 'kom:qrcode-medium'],
  'sbb-icon-swisspass-temporary': [
    'kom:swisspass-temporary-small',
    'kom:swisspass-temporary-medium',
  ],
  'sbb-icon-swisspass': ['kom:swisspass-small', 'kom:swisspass-medium'],
  'sbb-icon-ticket-day': ['kom:ticket-day-small', 'kom:ticket-day-medium'],
  'sbb-icon-ticket-disabled': ['kom:ticket-disabled-small', 'kom:ticket-disabled-medium'],
  'sbb-icon-ticket-heart': ['kom:ticket-heart-small', 'kom:ticket-heart-medium'],
  'sbb-icon-ticket-journey': ['kom:ticket-journey-small', 'kom:ticket-journey-medium'],
  'sbb-icon-ticket-parking': ['kom:ticket-parking-small', 'kom:ticket-parking-medium'],
  'sbb-icon-ticket-percent': ['kom:ticket-percent-small', 'kom:ticket-percent-medium'],
  'sbb-icon-ticket-route': ['kom:ticket-route-small', 'kom:ticket-route-medium'],
  'sbb-icon-ticket-star': ['kom:ticket-star-small', 'kom:ticket-star-medium'],
  'sbb-icon-tickets-class': ['kom:tickets-class-small', 'kom:tickets-class-medium'],
  'sbb-icon-arrow-change': ['kom:arrow-change-small', 'kom:arrow-change-medium'],
  'sbb-icon-avatar-train-staff-disabled': [
    'kom:avatar-train-staff-disabled-small',
    'kom:avatar-train-staff-disabled-medium',
  ],
  'sbb-icon-avatar-train-staff': ['kom:avatar-train-staff-small', 'kom:avatar-train-staff-medium'],
  'sbb-icon-clock': ['kom:clock-small', 'kom:clock-medium', 'kom:clock-large'],
  'sbb-icon-hourglass': ['kom:hourglass-small', 'kom:hourglass-medium'],
  'sbb-icon-locomotive': ['kom:locomotive-small', 'kom:locomotive-medium'],
  'sbb-icon-percent-tag': ['kom:percent-tag-small', 'kom:percent-tag-medium'],
  'sbb-icon-percent': ['kom:percent-small', 'kom:percent-medium', 'kom:percent-large'],
  'sbb-icon-punctuality': [
    'kom:punctuality-small',
    'kom:punctuality-medium',
    'kom:punctuality-large',
  ],
  'sbb-icon-route-circle-end': ['kom:route-circle-end-small', 'kom:route-circle-end-medium'],
  'sbb-icon-route-circle-start': ['kom:route-circle-start-small', 'kom:route-circle-start-medium'],
  'sbb-icon-seat-window': ['kom:seat-window-small', 'kom:seat-window-medium'],
  'sbb-icon-switzerland-route': [
    'kom:switzerland-route-small',
    'kom:switzerland-route-medium',
    'kom:switzerland-route-large',
  ],
  'sbb-icon-timetable': ['kom:timetable-small', 'kom:timetable-medium'],
  'sbb-icon-walk-fast': ['kom:walk-fast-small', 'kom:walk-fast-medium'],
  'sbb-icon-walk-slow': ['kom:walk-slow-small', 'kom:walk-slow-medium'],
  'sbb-icon-walk': ['kom:walk-small', 'kom:walk-medium'],
  'sbb-icon-wheelchair-inaccessible': [
    'kom:wheelchair-inaccessible-small',
    'kom:wheelchair-inaccessible-medium',
  ],
  'sbb-icon-wheelchair-partially': [
    'kom:wheelchair-partially-small',
    'kom:wheelchair-partially-medium',
  ],
  'sbb-icon-wheelchair-reservation': [
    'kom:wheelchair-reservation-small',
    'kom:wheelchair-reservation-medium',
  ],
  'sbb-icon-wheelchair-uncertain': [
    'kom:wheelchair-uncertain-small',
    'kom:wheelchair-uncertain-medium',
  ],
  'sbb-icon-wheelchair': ['kom:wheelchair-small', 'kom:wheelchair-medium'],
  'sbb-icon-sa-1': ['fpl:sa-1'],
  'sbb-icon-sa-2': ['fpl:sa-2'],
  'sbb-icon-sa-aw': ['fpl:sa-aw'],
  'sbb-icon-sa-b': ['fpl:sa-b'],
  'sbb-icon-sa-be': ['fpl:sa-be'],
  'sbb-icon-sa-bk': ['fpl:sa-bk'],
  'sbb-icon-sa-bl': ['fpl:sa-bl'],
  'sbb-icon-sa-br': ['fpl:sa-br'],
  'sbb-icon-sa-bv': ['fpl:sa-bv'],
  'sbb-icon-sa-bz': ['fpl:sa-bz'],
  'sbb-icon-sa-cc': ['fpl:sa-cc'],
  'sbb-icon-sa-dz': ['fpl:sa-dz'],
  'sbb-icon-sa-ep': ['fpl:sa-ep'],
  'sbb-icon-sa-fa': ['fpl:sa-fa'],
  'sbb-icon-sa-fl': ['fpl:sa-fl'],
  'sbb-icon-sa-fw': ['fpl:sa-fw'],
  'sbb-icon-sa-fz': ['fpl:sa-fz'],
  'sbb-icon-sa-gl': ['fpl:sa-gl'],
  'sbb-icon-sa-gn': ['fpl:sa-gn'],
  'sbb-icon-sa-gp': ['fpl:sa-gp'],
  'sbb-icon-sa-gr': ['fpl:sa-gr'],
  'sbb-icon-sa-gz': ['fpl:sa-gz'],
  'sbb-icon-sa-hk': ['fpl:sa-hk'],
  'sbb-icon-sa-hn': ['fpl:sa-hn'],
  'sbb-icon-sa-je': ['fpl:sa-je'],
  'sbb-icon-sa-kw': ['fpl:sa-kw'],
  'sbb-icon-sa-lc': ['fpl:sa-lc'],
  'sbb-icon-sa-le': ['fpl:sa-le'],
  'sbb-icon-sa-me': ['fpl:sa-me'],
  'sbb-icon-sa-mi': ['fpl:sa-mi'],
  'sbb-icon-sa-mp': ['fpl:sa-mp'],
  'sbb-icon-sa-nf': ['fpl:sa-nf'],
  'sbb-icon-sa-nj': ['fpl:sa-nj'],
  'sbb-icon-sa-p': ['fpl:sa-p'],
  'sbb-icon-sa-pa': ['fpl:sa-pa'],
  'sbb-icon-sa-pl': ['fpl:sa-pl'],
  'sbb-icon-sa-pr': ['fpl:sa-pr'],
  'sbb-icon-sa-r': ['fpl:sa-r'],
  'sbb-icon-sa-rb': ['fpl:sa-rb'],
  'sbb-icon-sa-rc': ['fpl:sa-rc'],
  'sbb-icon-sa-re': ['fpl:sa-re'],
  'sbb-icon-sa-rq': ['fpl:sa-rq'],
  'sbb-icon-sa-rr': ['fpl:sa-rr'],
  'sbb-icon-sa-rt': ['fpl:sa-rt'],
  'sbb-icon-sa-ry': ['fpl:sa-ry'],
  'sbb-icon-sa-rz': ['fpl:sa-rz'],
  'sbb-icon-sa-s': ['fpl:sa-s'],
  'sbb-icon-sa-sb': ['fpl:sa-sb'],
  'sbb-icon-sa-sc': ['fpl:sa-sc'],
  'sbb-icon-sa-sd': ['fpl:sa-sd'],
  'sbb-icon-sa-sh': ['fpl:sa-sh'],
  'sbb-icon-sa-sl': ['fpl:sa-sl'],
  'sbb-icon-sa-sm': ['fpl:sa-sm'],
  'sbb-icon-sa-sn': ['fpl:sa-sn'],
  'sbb-icon-sa-sv': ['fpl:sa-sv'],
  'sbb-icon-sa-sz': ['fpl:sa-sz'],
  'sbb-icon-sa-tc': ['fpl:sa-tc'],
  'sbb-icon-sa-tf': ['fpl:sa-tf'],
  'sbb-icon-sa-tg': ['fpl:sa-tg'],
  'sbb-icon-sa-tk': ['fpl:sa-tk'],
  'sbb-icon-sa-ts': ['fpl:sa-ts'],
  'sbb-icon-sa-tt': ['fpl:sa-tt'],
  'sbb-icon-sa-vi': ['fpl:sa-vi'],
  'sbb-icon-sa-vl': ['fpl:sa-vl'],
  'sbb-icon-sa-vn': ['fpl:sa-vn'],
  'sbb-icon-sa-vp': ['fpl:sa-vp'],
  'sbb-icon-sa-vr': ['fpl:sa-vr'],
  'sbb-icon-sa-vx': ['fpl:sa-vx'],
  'sbb-icon-sa-wl': ['fpl:sa-wl'],
  'sbb-icon-sa-wr': ['fpl:sa-wr'],
  'sbb-icon-sa-ws': ['fpl:sa-ws'],
  'sbb-icon-sa-wv': ['fpl:sa-wv'],
  'sbb-icon-sa-x': ['fpl:sa-x'],
  'sbb-icon-sa-xp': ['fpl:sa-xp'],
  'sbb-icon-sa-xr': ['fpl:sa-xr'],
  'sbb-icon-sa-xt': ['fpl:sa-xt'],
  'sbb-icon-sa-y': ['fpl:sa-y'],
  'sbb-icon-sa-yb': ['fpl:sa-yb'],
  'sbb-icon-sa-ym': ['fpl:sa-ym'],
  'sbb-icon-sa-yt': ['fpl:sa-yt'],
  'sbb-icon-sa-z': ['fpl:sa-z'],
  'sbb-icon-sa-zm': ['fpl:sa-zm'],
  'sbb-icon-product-bex': ['fpl:product-bex'],
  'sbb-icon-product-cnl': ['fpl:product-cnl'],
  'sbb-icon-product-ec': ['fpl:product-ec'],
  'sbb-icon-product-en': ['fpl:product-en'],
  'sbb-icon-product-gex': ['fpl:product-gex'],
  'sbb-icon-product-ic-1': ['fpl:product-ic-1'],
  'sbb-icon-product-ic-11': ['fpl:product-ic-11'],
  'sbb-icon-product-ic-2': ['fpl:product-ic-2'],
  'sbb-icon-product-ic-21': ['fpl:product-ic-21'],
  'sbb-icon-product-ic-3': ['fpl:product-ic-3'],
  'sbb-icon-product-ic-4': ['fpl:product-ic-4'],
  'sbb-icon-product-ic-5': ['fpl:product-ic-5'],
  'sbb-icon-product-ic-51': ['fpl:product-ic-51'],
  'sbb-icon-product-ic-6': ['fpl:product-ic-6'],
  'sbb-icon-product-ic-61': ['fpl:product-ic-61'],
  'sbb-icon-product-ic-7': ['fpl:product-ic-7'],
  'sbb-icon-product-ic-8': ['fpl:product-ic-8'],
  'sbb-icon-product-ic-9': ['fpl:product-ic-9'],
  'sbb-icon-product-ic': ['fpl:product-ic'],
  'sbb-icon-product-ice': ['fpl:product-ice'],
  'sbb-icon-product-icn': ['fpl:product-icn'],
  'sbb-icon-product-ir-13': ['fpl:product-ir-13'],
  'sbb-icon-product-ir-15': ['fpl:product-ir-15'],
  'sbb-icon-product-ir-16': ['fpl:product-ir-16'],
  'sbb-icon-product-ir-17': ['fpl:product-ir-17'],
  'sbb-icon-product-ir-25': ['fpl:product-ir-25'],
  'sbb-icon-product-ir-26': ['fpl:product-ir-26'],
  'sbb-icon-product-ir-27': ['fpl:product-ir-27'],
  'sbb-icon-product-ir-35': ['fpl:product-ir-35'],
  'sbb-icon-product-ir-36': ['fpl:product-ir-36'],
  'sbb-icon-product-ir-37': ['fpl:product-ir-37'],
  'sbb-icon-product-ir-45': ['fpl:product-ir-45'],
  'sbb-icon-product-ir-46': ['fpl:product-ir-46'],
  'sbb-icon-product-ir-55': ['fpl:product-ir-55'],
  'sbb-icon-product-ir-56': ['fpl:product-ir-56'],
  'sbb-icon-product-ir-65': ['fpl:product-ir-65'],
  'sbb-icon-product-ir-66': ['fpl:product-ir-66'],
  'sbb-icon-product-ir-70': ['fpl:product-ir-70'],
  'sbb-icon-product-ir-75': ['fpl:product-ir-75'],
  'sbb-icon-product-ir-90': ['fpl:product-ir-90'],
  'sbb-icon-product-ir-95': ['fpl:product-ir-95'],
  'sbb-icon-product-ir': ['fpl:product-ir'],
  'sbb-icon-product-nj': ['fpl:product-nj'],
  'sbb-icon-product-pe': ['fpl:product-pe'],
  'sbb-icon-product-re': ['fpl:product-re'],
  'sbb-icon-product-rj': ['fpl:product-rj'],
  'sbb-icon-product-rjx': ['fpl:product-rjx'],
  'sbb-icon-product-rx': ['fpl:product-rx'],
  'sbb-icon-product-sn': ['fpl:product-sn'],
  'sbb-icon-product-tgv': ['fpl:product-tgv'],
  'sbb-icon-product-vae': ['fpl:product-vae'],
  'sbb-icon-airplane': ['kom:airplane-small', 'kom:airplane-medium'],
  'sbb-icon-bicycle': ['kom:bicycle-small', 'kom:bicycle-medium', 'kom:bicycle-large'],
  'sbb-icon-bus-circle': ['kom:bus-surrounding-area-small', 'kom:bus-surrounding-area-medium'],
  'sbb-icon-bus-sbb': ['kom:bus-sbb-small', 'kom:bus-sbb-medium'],
  'sbb-icon-bus-stop': ['kom:bus-stop-small', 'kom:bus-stop-medium'],
  'sbb-icon-bus': ['kom:bus-small', 'kom:bus-medium'],
  'sbb-icon-car-parking': ['kom:car-sign-parking-small', 'kom:car-sign-parking-medium'],
  'sbb-icon-car': ['kom:car-small', 'kom:car-medium'],
  'sbb-icon-charging-station': ['kom:charging-station-small', 'kom:charging-station-medium'],
  'sbb-icon-combined-mobility': ['kom:combined-mobility-small', 'kom:combined-mobility-medium'],
  'sbb-icon-container': ['kom:container-small', 'kom:container-medium'],
  'sbb-icon-driverless-bus': ['kom:moving-bus-small', 'kom:moving-bus-medium'],
  'sbb-icon-freight-wagon': ['kom:freight-wagon-small', 'kom:freight-wagon-medium'],
  'sbb-icon-k-r': ['kom:k-r-small', 'kom:k-r-medium'],
  'sbb-icon-park-and-rail': ['kom:park-and-rail-small', 'kom:park-and-rail-medium'],
  'sbb-icon-petrol-station': ['kom:petrol-station-small', 'kom:petrol-station-medium'],
  'sbb-icon-shuttle': ['kom:shuttle-small', 'kom:shuttle-medium'],
  'sbb-icon-taxi': ['kom:taxi-small', 'kom:taxi-medium'],
  'sbb-icon-train': ['kom:train-small', 'kom:train-medium', 'kom:train-large'],
  'sbb-icon-tram': ['kom:tram-small', 'kom:tram-medium'],
  'sbb-icon-avatar-police': ['kom:avatar-police-small', 'kom:avatar-police-medium'],
  'sbb-icon-employees-sbb': ['kom:employees-sbb-large'],
  'sbb-icon-key': ['kom:key-small', 'kom:key-medium'],
  'sbb-icon-pie': ['kom:pie-small', 'kom:pie-medium'],
  'sbb-icon-two-users': ['kom:two-users-small', 'kom:two-users-medium'],
  'sbb-icon-user-change': ['kom:user-change-small', 'kom:user-change-medium'],
  'sbb-icon-user-group-round-table': [
    'kom:user-group-round-table-small',
    'kom:user-group-round-table-medium',
  ],
  'sbb-icon-user-group-row': ['kom:user-group-row-small', 'kom:user-group-row-medium'],
  'sbb-icon-user-group': ['kom:user-group-small', 'kom:user-group-medium', 'kom:user-group-large'],
  'sbb-icon-user-hat': ['kom:user-hat-small', 'kom:user-hat-medium'],
  'sbb-icon-user-headset': ['kom:user-headset-small', 'kom:user-headset-medium'],
  'sbb-icon-user-key': ['kom:user-key-small', 'kom:user-key-medium'],
  'sbb-icon-user-plus': ['kom:user-plus-small', 'kom:user-plus-medium'],
  'sbb-icon-user-tie': ['kom:user-tie-small', 'kom:user-tie-medium'],
  'sbb-icon-user': ['kom:user-small', 'kom:user-medium'],
  'sbb-icon-cloud-dense-fog': ['kom:cloud-dense-fog-small', 'kom:cloud-dense-fog-medium'],
  'sbb-icon-cloud-drops-moon': ['kom:cloud-drops-moon-small', 'kom:cloud-drops-moon-medium'],
  'sbb-icon-cloud-drops': ['kom:cloud-drops-small', 'kom:cloud-drops-medium'],
  'sbb-icon-cloud-fog': ['kom:cloud-fog-small', 'kom:cloud-fog-medium'],
  'sbb-icon-cloud-ice': ['kom:cloud-ice-small', 'kom:cloud-ice-medium'],
  'sbb-icon-cloud-lightning-moon': [
    'kom:cloud-lightning-moon-small',
    'kom:cloud-lightning-moon-medium',
  ],
  'sbb-icon-cloud-lightning': ['kom:cloud-lightning-small', 'kom:cloud-lightning-medium'],
  'sbb-icon-cloud-little-snow-moon': [
    'kom:cloud-little-snow-moon-small',
    'kom:cloud-little-snow-moon-medium',
  ],
  'sbb-icon-cloud-little-snow-sun': [
    'kom:cloud-little-snow-sun-small',
    'kom:cloud-little-snow-sun-medium',
  ],
  'sbb-icon-cloud-moon': ['kom:cloud-moon-small', 'kom:cloud-moon-medium'],
  'sbb-icon-cloud-rain-snow-moon': [
    'kom:cloud-rain-snow-moon-small',
    'kom:cloud-rain-snow-moon-medium',
  ],
  'sbb-icon-cloud-rain-snow-sun': [
    'kom:cloud-rain-snow-sun-small',
    'kom:cloud-rain-snow-sun-medium',
  ],
  'sbb-icon-cloud-rain-snow': ['kom:cloud-rain-snow-small', 'kom:cloud-rain-snow-medium'],
  'sbb-icon-cloud-rain-sun': ['kom:cloud-rain-sun-small', 'kom:cloud-rain-sun-medium'],
  'sbb-icon-cloud-rain': ['kom:cloud-rain-small', 'kom:cloud-rain-medium'],
  'sbb-icon-cloud-snow-lightning': [
    'kom:cloud-snow-lightning-small',
    'kom:cloud-snow-lightning-medium',
  ],
  'sbb-icon-cloud-snow-moon': ['kom:cloud-snow-moon-small', 'kom:cloud-snow-moon-medium'],
  'sbb-icon-cloud-snow-sun': ['kom:cloud-snow-sun-small', 'kom:cloud-snow-sun-medium'],
  'sbb-icon-cloud-snow': ['kom:cloud-snow-small', 'kom:cloud-snow-medium'],
  'sbb-icon-cloud-snowflake-sun': [
    'kom:cloud-snowflake-sun-small',
    'kom:cloud-snowflake-sun-medium',
  ],
  'sbb-icon-cloud-snowflake': ['kom:cloud-snowflake-small', 'kom:cloud-snowflake-medium'],
  'sbb-icon-cloud-strong-rain-moon': [
    'kom:cloud-strong-rain-moon-small',
    'kom:cloud-strong-rain-moon-medium',
  ],
  'sbb-icon-cloud-strong-rain-sun': [
    'kom:cloud-strong-rain-sun-small',
    'kom:cloud-strong-rain-sun-medium',
  ],
  'sbb-icon-cloud-sun': ['kom:cloud-sun-small', 'kom:cloud-sun-medium'],
  'sbb-icon-cloud-sunshine': ['kom:cloud-sunshine-small', 'kom:cloud-sunshine-medium'],
  'sbb-icon-cloud': ['kom:cloud-small', 'kom:cloud-medium'],
  'sbb-icon-fog': ['kom:fog-small', 'kom:fog-medium'],
  'sbb-icon-moon': ['kom:moon-small', 'kom:moon-medium'],
  'sbb-icon-sun-moon': ['kom:sun-moon-small', 'kom:sun-moon-medium'],
  'sbb-icon-sunrise': ['kom:sunrise-small', 'kom:sunrise-medium'],
  'sbb-icon-sunshine': ['kom:sunshine-small', 'kom:sunshine-medium'],
  'sbb-icon-weather-unknown': ['kom:weather-unknown-small', 'kom:weather-unknown-medium'],
  'sbb-icon-sa-aa': ['fpl:sa-aa'],
  'sbb-icon-sa-af': ['fpl:sa-af'],
  'sbb-icon-sa-at': ['fpl:sa-at'],
  'sbb-icon-sa-bb': ['fpl:sa-bb'],
  'sbb-icon-sa-bi': ['fpl:sa-bi'],
  'sbb-icon-sa-bs': ['fpl:sa-bs'],
  'sbb-icon-sa-ds': ['fpl:sa-ds'],
  'sbb-icon-sa-gk': ['fpl:sa-gk'],
  'sbb-icon-sa-gx': ['fpl:sa-gx'],
  'sbb-icon-sa-ii': ['fpl:sa-ii'],
  'sbb-icon-sa-kb': ['fpl:sa-kb'],
  'sbb-icon-sa-nv': ['fpl:sa-nv'],
  'sbb-icon-sa-ob': ['fpl:sa-ob'],
  'sbb-icon-sa-ph': ['fpl:sa-ph'],
  'sbb-icon-sa-sf': ['fpl:sa-sf'],
  'sbb-icon-sa-sk': ['fpl:sa-sk'],
  'sbb-icon-sa-ta': ['fpl:sa-ta'],
  'sbb-icon-sa-tn': ['fpl:sa-tn'],
  'sbb-icon-sa-tx': ['fpl:sa-tx'],
  'sbb-icon-sa-vc': ['fpl:sa-vc'],
  'sbb-icon-sa-vt': ['fpl:sa-vt'],
  'sbb-icon-sa-wb': ['fpl:sa-wb'],
  'sbb-icon-arrow-circle-medium': ['kom:arrow-circle-medium'],
  'sbb-icon-arrow-circle-small': ['kom:arrow-circle-small'],
  'sbb-icon-arrow-long-left-medium': ['kom:arrow-long-left-medium'],
  'sbb-icon-arrow-long-left-small': ['kom:arrow-long-left-small'],
  'sbb-icon-arrow-long-right-medium': ['kom:arrow-long-right-medium'],
  'sbb-icon-arrow-long-right-small': ['kom:arrow-long-right-small'],
  'sbb-icon-arrow-right-medium': ['kom:arrow-right-medium'],
  'sbb-icon-arrow-right-small': ['kom:arrow-right-small'],
  'sbb-icon-arrows-circle-medium': ['kom:arrows-circle-medium'],
  'sbb-icon-arrows-circle-small': ['kom:arrows-circle-small'],
  'sbb-icon-arrows-left-right-down-up-medium': ['kom:arrows-left-right-down-up-medium'],
  'sbb-icon-arrows-left-right-down-up-small': ['kom:arrows-left-right-down-up-small'],
  'sbb-icon-arrows-left-right-medium': ['kom:arrows-left-right-medium'],
  'sbb-icon-arrows-left-right-small': ['kom:arrows-left-right-small'],
  'sbb-icon-arrows-right-left-medium': ['kom:arrows-right-left-medium'],
  'sbb-icon-arrows-right-left-small': ['kom:arrows-right-left-small'],
  'sbb-icon-arrows-up-down-medium': ['kom:arrows-up-down-medium'],
  'sbb-icon-arrows-up-down-small': ['kom:arrows-up-down-small'],
  'sbb-icon-chevron-right-medium': ['kom:chevron-right-medium'],
  'sbb-icon-chevron-right-small': ['kom:chevron-right-small'],
  'sbb-icon-chevron-small-down-circle-medium': ['kom:chevron-small-down-circle-medium'],
  'sbb-icon-chevron-small-down-circle-small': ['kom:chevron-small-down-circle-small'],
  'sbb-icon-chevron-small-down-medium': ['kom:chevron-small-down-medium'],
  'sbb-icon-chevron-small-down-small': ['kom:chevron-small-down-small'],
  'sbb-icon-chevron-small-left-circle-medium': ['kom:chevron-small-left-circle-medium'],
  'sbb-icon-chevron-small-left-circle-small': ['kom:chevron-small-left-circle-small'],
  'sbb-icon-chevron-small-left-medium': ['kom:chevron-small-left-medium'],
  'sbb-icon-chevron-small-left-small': ['kom:chevron-small-left-small'],
  'sbb-icon-chevron-small-right-circle-medium': ['kom:chevron-small-right-circle-medium'],
  'sbb-icon-chevron-small-right-circle-small': ['kom:chevron-small-right-circle-small'],
  'sbb-icon-chevron-small-right-medium': ['kom:chevron-small-right-medium'],
  'sbb-icon-chevron-small-right-small': ['kom:chevron-small-right-small'],
  'sbb-icon-chevron-small-up-circle-medium': ['kom:chevron-small-up-circle-medium'],
  'sbb-icon-chevron-small-up-circle-small': ['kom:chevron-small-up-circle-small'],
  'sbb-icon-chevron-small-up-medium': ['kom:chevron-small-up-medium'],
  'sbb-icon-chevron-small-up-small': ['kom:chevron-small-up-small'],
  'sbb-icon-increase-size-medium': ['kom:increase-size-medium'],
  'sbb-icon-increase-size-small': ['kom:increase-size-small'],
  'sbb-icon-reduce-size-medium': ['kom:reduce-size-medium'],
  'sbb-icon-reduce-size-small': ['kom:reduce-size-small'],
  'sbb-icon-fast-forward-medium': ['kom:fast-forward-medium'],
  'sbb-icon-fast-forward-small': ['kom:fast-forward-small'],
  'sbb-icon-next-medium': ['kom:next-medium'],
  'sbb-icon-next-small': ['kom:next-small'],
  'sbb-icon-pause-medium': ['kom:pause-medium'],
  'sbb-icon-pause-small': ['kom:pause-small'],
  'sbb-icon-play-medium': ['kom:play-medium'],
  'sbb-icon-play-small': ['kom:play-small'],
  'sbb-icon-previous-medium': ['kom:previous-medium'],
  'sbb-icon-previous-small': ['kom:previous-small'],
  'sbb-icon-record-medium': ['kom:record-medium'],
  'sbb-icon-record-small': ['kom:record-small'],
  'sbb-icon-rewind-medium': ['kom:rewind-medium'],
  'sbb-icon-rewind-small': ['kom:rewind-small'],
  'sbb-icon-stop-medium': ['kom:stop-medium'],
  'sbb-icon-stop-small': ['kom:stop-small'],
  'sbb-icon-alarm-clock-medium': ['kom:alarm-clock-medium'],
  'sbb-icon-alarm-clock-small': ['kom:alarm-clock-small'],
  'sbb-icon-app-icon-medium': ['kom:app-icon-medium'],
  'sbb-icon-app-icon-small': ['kom:app-icon-small'],
  'sbb-icon-apple-bag-medium': ['kom:apple-bag-medium'],
  'sbb-icon-apple-bag-small': ['kom:apple-bag-small'],
  'sbb-icon-backpack-medium': ['kom:backpack-medium'],
  'sbb-icon-backpack-small': ['kom:backpack-small'],
  'sbb-icon-bell-medium': ['kom:bell-medium'],
  'sbb-icon-bell-small': ['kom:bell-small'],
  'sbb-icon-binoculars-medium': ['kom:binoculars-medium'],
  'sbb-icon-binoculars-small': ['kom:binoculars-small'],
  'sbb-icon-browser-medium': ['kom:browser-medium'],
  'sbb-icon-browser-small': ['kom:browser-small'],
  'sbb-icon-calendar-large': ['kom:calendar-large'],
  'sbb-icon-calendar-medium': ['kom:calendar-medium'],
  'sbb-icon-calendar-small': ['kom:calendar-small'],
  'sbb-icon-camera-medium': ['kom:camera-medium'],
  'sbb-icon-camera-small': ['kom:camera-small'],
  'sbb-icon-chart-column-medium': ['kom:chart-column-medium'],
  'sbb-icon-chart-column-small': ['kom:chart-column-small'],
  'sbb-icon-chart-column-trend-large': ['kom:chart-column-trend-large'],
  'sbb-icon-chart-column-trend-medium': ['kom:chart-column-trend-medium'],
  'sbb-icon-chart-column-trend-small': ['kom:chart-column-trend-small'],
  'sbb-icon-chart-line-medium': ['kom:chart-line-medium'],
  'sbb-icon-chart-line-small': ['kom:chart-line-small'],
  'sbb-icon-chart-pie-medium': ['kom:chart-pie-medium'],
  'sbb-icon-chart-pie-small': ['kom:chart-pie-small'],
  'sbb-icon-circle-information-medium': ['kom:circle-information-medium'],
  'sbb-icon-circle-information-small-medium': ['kom:circle-information-small-medium'],
  'sbb-icon-circle-information-small-small': ['kom:circle-information-small-small'],
  'sbb-icon-circle-play-medium': ['kom:circle-play-medium'],
  'sbb-icon-circle-play-small': ['kom:circle-play-small'],
  'sbb-icon-circle-question-mark-medium': ['kom:circle-question-mark-medium'],
  'sbb-icon-circle-question-mark-small': ['kom:circle-question-mark-small'],
  'sbb-icon-coins-large': ['kom:coins-large'],
  'sbb-icon-contact-medium': ['kom:contact-medium'],
  'sbb-icon-contact-small': ['kom:contact-small'],
  'sbb-icon-controls-medium': ['kom:controls-medium'],
  'sbb-icon-controls-small': ['kom:controls-small'],
  'sbb-icon-cup-hot-medium': ['kom:cup-hot-medium'],
  'sbb-icon-cup-hot-small': ['kom:cup-hot-small'],
  'sbb-icon-cutlery-medium': ['kom:cutlery-medium'],
  'sbb-icon-cutlery-small': ['kom:cutlery-small'],
  'sbb-icon-database-medium': ['kom:database-medium'],
  'sbb-icon-database-small': ['kom:database-small'],
  'sbb-icon-dog-medium': ['kom:dog-medium'],
  'sbb-icon-dog-small': ['kom:dog-small'],
  'sbb-icon-download-large-data-medium': ['kom:download-large-data-medium'],
  'sbb-icon-download-large-data-small': ['kom:download-large-data-small'],
  'sbb-icon-download-medium': ['kom:download-medium'],
  'sbb-icon-download-small-data-medium': ['kom:download-small-data-medium'],
  'sbb-icon-download-small-data-small': ['kom:download-small-data-small'],
  'sbb-icon-download-small': ['kom:download-small'],
  'sbb-icon-entrance-medium': ['kom:entrance-medium'],
  'sbb-icon-entrance-small': ['kom:entrance-small'],
  'sbb-icon-envelope-medium': ['kom:envelope-medium'],
  'sbb-icon-envelope-open-medium': ['kom:envelope-open-medium'],
  'sbb-icon-envelope-open-small': ['kom:envelope-open-small'],
  'sbb-icon-envelope-small': ['kom:envelope-small'],
  'sbb-icon-exit-medium': ['kom:exit-medium'],
  'sbb-icon-exit-small': ['kom:exit-small'],
  'sbb-icon-face-king-medium': ['kom:face-king-medium'],
  'sbb-icon-face-king-small': ['kom:face-king-small'],
  'sbb-icon-face-worker-medium': ['kom:face-worker-medium'],
  'sbb-icon-face-worker-small': ['kom:face-worker-small'],
  'sbb-icon-factory-medium': ['kom:factory-medium'],
  'sbb-icon-factory-small': ['kom:factory-small'],
  'sbb-icon-filter-medium': ['kom:filter-medium'],
  'sbb-icon-filter-small': ['kom:filter-small'],
  'sbb-icon-filter-x-medium': ['kom:filter-x-medium'],
  'sbb-icon-filter-x-small': ['kom:filter-x-small'],
  'sbb-icon-flashlight-on-medium': ['kom:flashlight-on-medium'],
  'sbb-icon-flashlight-on-small': ['kom:flashlight-on-small'],
  'sbb-icon-form-medium': ['kom:form-medium'],
  'sbb-icon-form-small': ['kom:form-small'],
  'sbb-icon-gears-medium': ['kom:gears-medium'],
  'sbb-icon-gears-small': ['kom:gears-small'],
  'sbb-icon-gift-medium': ['kom:gift-medium'],
  'sbb-icon-gift-small': ['kom:gift-small'],
  'sbb-icon-globe-medium': ['kom:globe-medium'],
  'sbb-icon-globe-small': ['kom:globe-small'],
  'sbb-icon-hand-heart-medium': ['kom:hand-heart-medium'],
  'sbb-icon-hand-heart-small': ['kom:hand-heart-small'],
  'sbb-icon-hand-with-service-bell-medium': ['kom:hand-with-service-bell-medium'],
  'sbb-icon-hand-with-service-bell-small': ['kom:hand-with-service-bell-small'],
  'sbb-icon-heart-medium': ['kom:heart-medium'],
  'sbb-icon-heart-small': ['kom:heart-small'],
  'sbb-icon-hierarchy-medium': ['kom:hierarchy-medium'],
  'sbb-icon-hierarchy-small': ['kom:hierarchy-small'],
  'sbb-icon-lighthouse-medium': ['kom:lighthouse-medium'],
  'sbb-icon-lighthouse-small': ['kom:lighthouse-small'],
  'sbb-icon-link-external-medium': ['kom:link-external-medium'],
  'sbb-icon-link-external-small': ['kom:link-external-small'],
  'sbb-icon-link-medium': ['kom:link-medium'],
  'sbb-icon-link-small': ['kom:link-small'],
  'sbb-icon-list-medium': ['kom:list-medium'],
  'sbb-icon-list-small': ['kom:list-small'],
  'sbb-icon-magnifying-glass-medium': ['kom:magnifying-glass-medium'],
  'sbb-icon-magnifying-glass-small': ['kom:magnifying-glass-small'],
  'sbb-icon-mug-hot-medium': ['kom:mug-hot-medium'],
  'sbb-icon-mug-hot-small': ['kom:mug-hot-small'],
  'sbb-icon-newspaper-medium': ['kom:newspaper-medium'],
  'sbb-icon-newspaper-small': ['kom:newspaper-small'],
  'sbb-icon-paper-aeroplane-medium': ['kom:paper-aeroplane-medium'],
  'sbb-icon-paper-aeroplane-small': ['kom:paper-aeroplane-small'],
  'sbb-icon-paper-clip-medium': ['kom:paper-clip-medium'],
  'sbb-icon-paper-clip-small': ['kom:paper-clip-small'],
  'sbb-icon-pen-medium': ['kom:pen-medium'],
  'sbb-icon-pen-small': ['kom:pen-small'],
  'sbb-icon-picture-medium': ['kom:picture-medium'],
  'sbb-icon-picture-small': ['kom:picture-small'],
  'sbb-icon-pin-medium': ['kom:pin-medium'],
  'sbb-icon-pin-small': ['kom:pin-small'],
  'sbb-icon-rocket-large': ['kom:rocket-large'],
  'sbb-icon-rss-medium': ['kom:rss-medium'],
  'sbb-icon-rss-small': ['kom:rss-small'],
  'sbb-icon-service-bell-medium': ['kom:service-bell-medium'],
  'sbb-icon-service-bell-small': ['kom:service-bell-small'],
  'sbb-icon-shopping-cart-large': ['kom:shopping-cart-large'],
  'sbb-icon-shopping-cart-medium': ['kom:shopping-cart-medium'],
  'sbb-icon-shopping-cart-small': ['kom:shopping-cart-small'],
  'sbb-icon-sign-exclamation-point-medium': ['kom:sign-exclamation-point-medium'],
  'sbb-icon-sign-exclamation-point-small': ['kom:sign-exclamation-point-small'],
  'sbb-icon-sign-x-medium': ['kom:sign-x-medium'],
  'sbb-icon-sign-x-small': ['kom:sign-x-small'],
  'sbb-icon-spanner-medium': ['kom:spanner-medium'],
  'sbb-icon-spanner-small': ['kom:spanner-small'],
  'sbb-icon-star-medium': ['kom:star-medium'],
  'sbb-icon-star-small': ['kom:star-small'],
  'sbb-icon-switzerland-medium': ['kom:switzerland-medium'],
  'sbb-icon-switzerland-small': ['kom:switzerland-small'],
  'sbb-icon-tag-medium': ['kom:tag-medium'],
  'sbb-icon-tag-small': ['kom:tag-small'],
  'sbb-icon-target-medium': ['kom:target-medium'],
  'sbb-icon-target-small': ['kom:target-small'],
  'sbb-icon-torch-medium': ['kom:torch-medium'],
  'sbb-icon-torch-small': ['kom:torch-small'],
  'sbb-icon-trash-medium': ['kom:trash-medium'],
  'sbb-icon-trash-small': ['kom:trash-small'],
  'sbb-icon-tree-medium': ['kom:tree-medium'],
  'sbb-icon-tree-small': ['kom:tree-small'],
  'sbb-icon-upload-medium': ['kom:upload-medium'],
  'sbb-icon-upload-small': ['kom:upload-small'],
  'sbb-icon-wallet-medium': ['kom:wallet-medium'],
  'sbb-icon-wallet-small': ['kom:wallet-small'],
  'sbb-icon-warning-light-medium': ['kom:warning-light-medium'],
  'sbb-icon-warning-light-small': ['kom:warning-light-small'],
  'sbb-icon-wifi-medium': ['kom:wifi-medium'],
  'sbb-icon-wifi-small': ['kom:wifi-small'],
  'sbb-icon-building-tree-large': ['kom:building-tree-large'],
  'sbb-icon-city-large': ['kom:city-large'],
  'sbb-icon-city-medium': ['kom:city-medium'],
  'sbb-icon-city-small': ['kom:city-small'],
  'sbb-icon-curriculum-vitae-large': ['kom:curriculum-vitae-large'],
  'sbb-icon-hand-graduation-cap-large': ['kom:hand-graduation-cap-large'],
  'sbb-icon-ship-steering-wheel-medium': ['kom:ship-steering-wheel-medium'],
  'sbb-icon-ship-steering-wheel-small': ['kom:ship-steering-wheel-small'],
  'sbb-icon-bulb-off-medium': ['kom:bulb-off-medium'],
  'sbb-icon-bulb-off-small': ['kom:bulb-off-small'],
  'sbb-icon-bulb-on-large': ['kom:bulb-on-large'],
  'sbb-icon-bulb-on-medium': ['kom:bulb-on-medium'],
  'sbb-icon-bulb-on-small': ['kom:bulb-on-small'],
  'sbb-icon-face-grinning-medium': ['kom:face-grinning-medium'],
  'sbb-icon-face-grinning-small': ['kom:face-grinning-small'],
  'sbb-icon-face-neutral-medium': ['kom:face-neutral-medium'],
  'sbb-icon-face-neutral-small': ['kom:face-neutral-small'],
  'sbb-icon-face-sad-medium': ['kom:face-sad-medium'],
  'sbb-icon-face-sad-small': ['kom:face-sad-small'],
  'sbb-icon-face-smiling-medium': ['kom:face-smiling-medium'],
  'sbb-icon-face-smiling-small': ['kom:face-smiling-small'],
  'sbb-icon-handshake-large': ['kom:handshake-large'],
  'sbb-icon-handshake-medium': ['kom:handshake-medium'],
  'sbb-icon-handshake-small': ['kom:handshake-small'],
  'sbb-icon-network-large': ['kom:network-large'],
  'sbb-icon-network-medium': ['kom:network-medium'],
  'sbb-icon-network-small': ['kom:network-small'],
  'sbb-icon-onboarding-medium': ['kom:onboarding-medium'],
  'sbb-icon-onboarding-small': ['kom:onboarding-small'],
  'sbb-icon-question-answer-medium': ['kom:question-answer-medium'],
  'sbb-icon-question-answer-small': ['kom:question-answer-small'],
  'sbb-icon-share-medium': ['kom:share-medium'],
  'sbb-icon-share-small': ['kom:share-small'],
  'sbb-icon-speech-bubble-group-empty-medium': ['kom:speech-bubble-group-empty-medium'],
  'sbb-icon-speech-bubble-group-empty-small': ['kom:speech-bubble-group-empty-small'],
  'sbb-icon-speech-bubble-medium': ['kom:speech-bubble-medium'],
  'sbb-icon-speech-bubble-small': ['kom:speech-bubble-small'],
  'sbb-icon-thumb-down-medium': ['kom:thumb-down-medium'],
  'sbb-icon-thumb-down-small': ['kom:thumb-down-small'],
  'sbb-icon-thumb-up-medium': ['kom:thumb-up-medium'],
  'sbb-icon-thumb-up-small': ['kom:thumb-up-small'],
  'sbb-icon-translate-medium': ['kom:translate-medium'],
  'sbb-icon-translate-small': ['kom:translate-small'],
  'sbb-icon-two-speech-bubbles-large': ['kom:two-speech-bubbles-large'],
  'sbb-icon-two-speech-bubbles-medium': ['kom:two-speech-bubbles-medium'],
  'sbb-icon-two-speech-bubbles-small': ['kom:two-speech-bubbles-small'],
  'sbb-icon-document-check-medium': ['kom:document-check-medium'],
  'sbb-icon-document-check-small': ['kom:document-check-small'],
  'sbb-icon-document-image-medium': ['kom:document-image-medium'],
  'sbb-icon-document-image-small': ['kom:document-image-small'],
  'sbb-icon-document-lock-medium': ['kom:document-lock-medium'],
  'sbb-icon-document-lock-small': ['kom:document-lock-small'],
  'sbb-icon-document-medium': ['kom:document-standard-medium'],
  'sbb-icon-document-pdf-medium': ['kom:document-pdf-medium'],
  'sbb-icon-document-pdf-small': ['kom:document-pdf-small'],
  'sbb-icon-document-plus-medium': ['kom:document-plus-medium'],
  'sbb-icon-document-plus-small': ['kom:document-plus-small'],
  'sbb-icon-document-ppt-medium': ['kom:document-ppt-medium'],
  'sbb-icon-document-ppt-small': ['kom:document-ppt-small'],
  'sbb-icon-document-small': ['kom:document-standard-small'],
  'sbb-icon-document-sound-medium': ['kom:document-sound-medium'],
  'sbb-icon-document-sound-small': ['kom:document-sound-small'],
  'sbb-icon-document-standard-medium': ['kom:document-standard-medium'],
  'sbb-icon-document-standard-small': ['kom:document-standard-small'],
  'sbb-icon-document-text-medium': ['kom:document-text-medium'],
  'sbb-icon-document-text-small': ['kom:document-text-small'],
  'sbb-icon-document-video-medium': ['kom:document-video-medium'],
  'sbb-icon-document-video-small': ['kom:document-video-small'],
  'sbb-icon-document-zip-medium': ['kom:document-zip-medium'],
  'sbb-icon-document-zip-small': ['kom:document-zip-small'],
  'sbb-icon-folder-info-medium': ['kom:folder-info-medium'],
  'sbb-icon-folder-info-small': ['kom:folder-info-small'],
  'sbb-icon-folder-lock-medium': ['kom:folder-lock-medium'],
  'sbb-icon-folder-lock-small': ['kom:folder-lock-small'],
  'sbb-icon-folder-open-arrow-medium': ['kom:folder-open-arrow-medium'],
  'sbb-icon-folder-open-arrow-small': ['kom:folder-open-arrow-small'],
  'sbb-icon-folder-open-medium': ['kom:folder-open-medium'],
  'sbb-icon-folder-open-small': ['kom:folder-open-small'],
  'sbb-icon-folder-plus-medium': ['kom:folder-plus-medium'],
  'sbb-icon-folder-plus-small': ['kom:folder-plus-small'],
  'sbb-icon-metadata-medium': ['kom:metadata-medium'],
  'sbb-icon-metadata-small': ['kom:metadata-small'],
  'sbb-icon-two-folders-medium': ['kom:two-folders-medium'],
  'sbb-icon-two-folders-small': ['kom:two-folders-small'],
  'sbb-icon-archive-box-medium': ['kom:archive-box-medium'],
  'sbb-icon-archive-box-small': ['kom:archive-box-small'],
  'sbb-icon-briefcase-medium': ['kom:briefcase-medium'],
  'sbb-icon-briefcase-small': ['kom:briefcase-small'],
  'sbb-icon-brochure-medium': ['kom:brochure-medium'],
  'sbb-icon-brochure-small': ['kom:brochure-small'],
  'sbb-icon-desk-adjustable-medium': ['kom:desk-adjustable-medium'],
  'sbb-icon-desk-adjustable-small': ['kom:desk-adjustable-small'],
  'sbb-icon-desk-medium': ['kom:desk-medium'],
  'sbb-icon-desk-small': ['kom:desk-small'],
  'sbb-icon-display-medium': ['kom:display-medium'],
  'sbb-icon-display-small': ['kom:display-small'],
  'sbb-icon-keyboard-medium': ['kom:keyboard-medium'],
  'sbb-icon-keyboard-small': ['kom:keyboard-small'],
  'sbb-icon-laptop-medium': ['kom:laptop-medium'],
  'sbb-icon-laptop-small': ['kom:laptop-small'],
  'sbb-icon-laptop-smartphone-large': ['kom:laptop-smartphone-large'],
  'sbb-icon-laptop-smartphone-medium': ['kom:laptop-smartphone-medium'],
  'sbb-icon-laptop-smartphone-small': ['kom:laptop-smartphone-small'],
  'sbb-icon-megaphone-medium': ['kom:megaphone-medium'],
  'sbb-icon-megaphone-small': ['kom:megaphone-small'],
  'sbb-icon-office-chair-medium': ['kom:office-chair-medium'],
  'sbb-icon-office-chair-small': ['kom:office-chair-small'],
  'sbb-icon-power-plug-medium': ['kom:power-plug-medium'],
  'sbb-icon-power-plug-small': ['kom:power-plug-small'],
  'sbb-icon-printer-medium': ['kom:printer-medium'],
  'sbb-icon-printer-small': ['kom:printer-small'],
  'sbb-icon-scanner-medium': ['kom:scanner-medium'],
  'sbb-icon-scanner-small': ['kom:scanner-small'],
  'sbb-icon-smartphone-medium': ['kom:smartphone-medium'],
  'sbb-icon-smartphone-small': ['kom:smartphone-small'],
  'sbb-icon-speaker-medium': ['kom:speaker-medium'],
  'sbb-icon-speaker-small': ['kom:speaker-small'],
  'sbb-icon-suitcase-disabled-medium': ['kom:suitcase-disabled-medium'],
  'sbb-icon-suitcase-disabled-small': ['kom:suitcase-disabled-small'],
  'sbb-icon-suitcase-medium': ['kom:suitcase-medium'],
  'sbb-icon-suitcase-small': ['kom:suitcase-small'],
  'sbb-icon-telephone-gsm-medium': ['kom:telephone-gsm-medium'],
  'sbb-icon-telephone-gsm-small': ['kom:telephone-gsm-small'],
  'sbb-icon-telephone-receiver-medium': ['kom:telephone-receiver-medium'],
  'sbb-icon-telephone-receiver-small': ['kom:telephone-receiver-small'],
  'sbb-icon-walkie-talkie-medium': ['kom:walkie-talkie-medium'],
  'sbb-icon-walkie-talkie-small': ['kom:walkie-talkie-small'],
  'sbb-icon-weight-medium': ['kom:weight-medium'],
  'sbb-icon-weight-small': ['kom:weight-small'],
  'sbb-icon-construction-medium': ['kom:construction-medium'],
  'sbb-icon-construction-small': ['kom:construction-small'],
  'sbb-icon-railway-switch-large': ['kom:railway-switch-large'],
  'sbb-icon-railway-switch-medium': ['kom:railway-switch-medium'],
  'sbb-icon-railway-switch-small': ['kom:railway-switch-small'],
  'sbb-icon-train-signal-large': ['kom:train-signal-large'],
  'sbb-icon-train-tracks-large': ['kom:train-tracks-large'],
  'sbb-icon-adult-kids-large': ['kom:adult-kids-large'],
  'sbb-icon-balloons-large': ['kom:balloons-large'],
  'sbb-icon-christmas-tree-shopping-bag-large': ['kom:christmas-tree-shopping-bag-large'],
  'sbb-icon-elephant-large': ['kom:elephant-large'],
  'sbb-icon-ferris-wheel-large': ['kom:ferris-wheel-large'],
  'sbb-icon-hiking-boot-large': ['kom:hiking-boot-large'],
  'sbb-icon-leaf-large': ['kom:leaf-large'],
  'sbb-icon-locomotive-viaduct-large': ['kom:locomotive-viaduct-large'],
  'sbb-icon-lucerne-chapel-bridge-large': ['kom:lucerne-chapel-bridge-large'],
  'sbb-icon-market-shopping-bag-large': ['kom:market-shopping-bag-large'],
  'sbb-icon-mountain-sun-large': ['kom:mountain-sun-large'],
  'sbb-icon-mountain-sun-medium': ['kom:mountain-sun-medium'],
  'sbb-icon-mountain-sun-small': ['kom:mountain-sun-small'],
  'sbb-icon-museum-large': ['kom:museum-large'],
  'sbb-icon-music-rock-hand-gesture-large': ['kom:music-rock-hand-gesture-large'],
  'sbb-icon-railway-ship-large': ['kom:railway-ship-large'],
  'sbb-icon-sledge-snowshoe-large': ['kom:sledge-snowshoe-large'],
  'sbb-icon-soccer-ball-large': ['kom:soccer-ball-large'],
  'sbb-icon-three-adults-large': ['kom:three-adults-large'],
  'sbb-icon-train-ski-large': ['kom:train-ski-large'],
  'sbb-icon-two-adults-kid-large': ['kom:two-adults-kid-large'],
  'sbb-icon-arrow-compass-medium': ['kom:arrow-compass-medium'],
  'sbb-icon-arrow-compass-small': ['kom:arrow-compass-small'],
  'sbb-icon-gps-disabled-medium': ['kom:gps-disabled-medium'],
  'sbb-icon-gps-disabled-small': ['kom:gps-disabled-small'],
  'sbb-icon-gps-medium': ['kom:gps-medium'],
  'sbb-icon-gps-small': ['kom:gps-small'],
  'sbb-icon-location-pin-a-medium': ['kom:location-pin-a-medium'],
  'sbb-icon-location-pin-a-small': ['kom:location-pin-a-small'],
  'sbb-icon-location-pin-b-medium': ['kom:location-pin-b-medium'],
  'sbb-icon-location-pin-b-small': ['kom:location-pin-b-small'],
  'sbb-icon-location-pin-map-medium': ['kom:location-pin-map-medium'],
  'sbb-icon-location-pin-map-small': ['kom:location-pin-map-small'],
  'sbb-icon-location-pin-medium': ['kom:location-pin-medium'],
  'sbb-icon-location-pin-pulse-surrounding-area-medium': [
    'kom:location-pin-pulse-surrounding-area-medium',
  ],
  'sbb-icon-location-pin-pulse-surrounding-area-small': [
    'kom:location-pin-pulse-surrounding-area-small',
  ],
  'sbb-icon-location-pin-small': ['kom:location-pin-small'],
  'sbb-icon-location-pin-surrounding-area-medium': ['kom:location-pin-surrounding-area-medium'],
  'sbb-icon-location-pin-surrounding-area-small': ['kom:location-pin-surrounding-area-small'],
  'sbb-icon-mountain-minus-medium': ['kom:mountain-minus-medium'],
  'sbb-icon-mountain-minus-small': ['kom:mountain-minus-small'],
  'sbb-icon-mountain-plus-medium': ['kom:mountain-plus-medium'],
  'sbb-icon-mountain-plus-small': ['kom:mountain-plus-small'],
  'sbb-icon-circle-minus-medium': ['kom:circle-minus-medium'],
  'sbb-icon-circle-minus-small': ['kom:circle-minus-small'],
  'sbb-icon-circle-plus-medium': ['kom:circle-plus-medium'],
  'sbb-icon-circle-plus-small': ['kom:circle-plus-small'],
  'sbb-icon-context-menu-medium': ['kom:context-menu-medium'],
  'sbb-icon-context-menu-small': ['kom:context-menu-small'],
  'sbb-icon-cross-medium': ['kom:cross-medium'],
  'sbb-icon-cross-small': ['kom:cross-small'],
  'sbb-icon-drag-medium': ['kom:drag-medium'],
  'sbb-icon-drag-small': ['kom:drag-small'],
  'sbb-icon-hamburger-menu-medium': ['kom:hamburger-menu-medium'],
  'sbb-icon-hamburger-menu-small': ['kom:hamburger-menu-small'],
  'sbb-icon-house-medium': ['kom:house-medium'],
  'sbb-icon-house-small': ['kom:house-small'],
  'sbb-icon-layers-medium': ['kom:layers-medium'],
  'sbb-icon-layers-small': ['kom:layers-small'],
  'sbb-icon-minus-medium': ['kom:minus-medium'],
  'sbb-icon-minus-small': ['kom:minus-small'],
  'sbb-icon-plus-medium': ['kom:plus-medium'],
  'sbb-icon-plus-small': ['kom:plus-small'],
  'sbb-icon-two-finger-tap-medium': ['kom:two-finger-tap-medium'],
  'sbb-icon-two-finger-tap-small': ['kom:two-finger-tap-small'],
  'sbb-icon-book-medium': ['kom:book-medium'],
  'sbb-icon-book-small': ['kom:book-small'],
  'sbb-icon-bottle-apple-medium': ['kom:bottle-apple-medium'],
  'sbb-icon-bottle-apple-small': ['kom:bottle-apple-small'],
  'sbb-icon-customer-assistance-medium': ['kom:customer-assistance-sbb-medium'],
  'sbb-icon-customer-assistance-small': ['kom:customer-assistance-sbb-small'],
  'sbb-icon-escalator-medium': ['kom:escalator-medium'],
  'sbb-icon-escalator-small': ['kom:escalator-small'],
  'sbb-icon-general-display-medium': ['kom:general-display-medium'],
  'sbb-icon-general-display-small': ['kom:general-display-small'],
  'sbb-icon-hand-medium': ['kom:hand-sbb-medium'],
  'sbb-icon-hand-plus-circle-medium': ['kom:hand-plus-circle-medium'],
  'sbb-icon-hand-plus-circle-small': ['kom:hand-plus-circle-small'],
  'sbb-icon-hand-small': ['kom:hand-sbb-small'],
  'sbb-icon-hostel-medium': ['kom:hostel-medium'],
  'sbb-icon-hostel-small': ['kom:hostel-small'],
  'sbb-icon-lift-medium': ['kom:lift-medium'],
  'sbb-icon-lift-small': ['kom:lift-small'],
  'sbb-icon-locker-medium': ['kom:locker-medium'],
  'sbb-icon-locker-small': ['kom:locker-small'],
  'sbb-icon-lotus-large': ['kom:lotus-large'],
  'sbb-icon-lotus-medium': ['kom:lotus-medium'],
  'sbb-icon-lotus-small': ['kom:lotus-small'],
  'sbb-icon-meeting-point-medium': ['kom:meeting-point-medium'],
  'sbb-icon-meeting-point-small': ['kom:meeting-point-small'],
  'sbb-icon-money-exchange-medium': ['kom:money-exchange-medium'],
  'sbb-icon-money-exchange-small': ['kom:money-exchange-small'],
  'sbb-icon-platform-display-medium': ['kom:platform-display-medium'],
  'sbb-icon-platform-display-small': ['kom:platform-display-small'],
  'sbb-icon-platform-large': ['kom:platform-large'],
  'sbb-icon-screen-inside-train-medium': ['kom:screen-inside-train-medium'],
  'sbb-icon-screen-inside-train-small': ['kom:screen-inside-train-small'],
  'sbb-icon-shirt-shoe-medium': ['kom:shirt-shoe-medium'],
  'sbb-icon-shirt-shoe-small': ['kom:shirt-shoe-small'],
  'sbb-icon-shopping-bag-coupon-medium': ['kom:shopping-bag-coupon-medium'],
  'sbb-icon-shopping-bag-coupon-small': ['kom:shopping-bag-coupon-small'],
  'sbb-icon-shopping-bag-fast-medium': ['kom:shopping-bag-fast-medium'],
  'sbb-icon-shopping-bag-fast-small': ['kom:shopping-bag-fast-small'],
  'sbb-icon-shopping-bag-medium': ['kom:shopping-bag-medium'],
  'sbb-icon-shopping-bag-small': ['kom:shopping-bag-small'],
  'sbb-icon-station-large': ['kom:station-large'],
  'sbb-icon-station-medium': ['kom:station-medium'],
  'sbb-icon-station-small': ['kom:station-small'],
  'sbb-icon-station-surrounding-area-medium': ['kom:station-surrounding-area-medium'],
  'sbb-icon-station-surrounding-area-small': ['kom:station-surrounding-area-small'],
  'sbb-icon-ticket-machine-medium': ['kom:ticket-machine-medium'],
  'sbb-icon-ticket-machine-small': ['kom:ticket-machine-small'],
  'sbb-icon-ticket-machine-ticket-medium': ['kom:ticket-machine-ticket-medium'],
  'sbb-icon-ticket-machine-ticket-small': ['kom:ticket-machine-ticket-small'],
  'sbb-icon-toilet-medium': ['kom:toilet-medium'],
  'sbb-icon-toilet-small': ['kom:toilet-small'],
  'sbb-icon-train-station-medium': ['kom:train-station-medium'],
  'sbb-icon-train-station-small': ['kom:train-station-small'],
  'sbb-icon-waiting-room-medium': ['kom:waiting-room-medium'],
  'sbb-icon-waiting-room-small': ['kom:waiting-room-small'],
  'sbb-icon-wine-cheese-medium': ['kom:wine-cheese-medium'],
  'sbb-icon-wine-cheese-small': ['kom:wine-cheese-small'],
  'sbb-icon-button-power-medium': ['kom:button-power-medium'],
  'sbb-icon-button-power-small': ['kom:button-power-small'],
  'sbb-icon-exclamation-point-medium': ['kom:exclamation-point-medium'],
  'sbb-icon-exclamation-point-small': ['kom:exclamation-point-small'],
  'sbb-icon-eye-disabled-medium': ['kom:eye-disabled-medium'],
  'sbb-icon-eye-disabled-small': ['kom:eye-disabled-small'],
  'sbb-icon-eye-medium': ['kom:eye-medium'],
  'sbb-icon-eye-small': ['kom:eye-small'],
  'sbb-icon-lock-closed-medium': ['kom:lock-closed-medium'],
  'sbb-icon-lock-closed-small': ['kom:lock-closed-small'],
  'sbb-icon-lock-open-medium': ['kom:lock-open-medium'],
  'sbb-icon-lock-open-small': ['kom:lock-open-small'],
  'sbb-icon-question-mark-medium': ['kom:question-mark-medium'],
  'sbb-icon-question-mark-small': ['kom:question-mark-small'],
  'sbb-icon-tick-clipboard-medium': ['kom:clipboard-tick-medium'],
  'sbb-icon-tick-clipboard-small': ['kom:clipboard-tick-small'],
  'sbb-icon-tick-medium': ['kom:tick-medium'],
  'sbb-icon-tick-small': ['kom:tick-small'],
  'sbb-icon-qrcode-disabled-medium': ['kom:qrcode-disabled-medium'],
  'sbb-icon-qrcode-disabled-small': ['kom:qrcode-disabled-small'],
  'sbb-icon-qrcode-medium': ['kom:qrcode-medium'],
  'sbb-icon-qrcode-small': ['kom:qrcode-small'],
  'sbb-icon-swisspass-medium': ['kom:swisspass-medium'],
  'sbb-icon-swisspass-small': ['kom:swisspass-small'],
  'sbb-icon-swisspass-temporary-medium': ['kom:swisspass-temporary-medium'],
  'sbb-icon-swisspass-temporary-small': ['kom:swisspass-temporary-small'],
  'sbb-icon-ticket-day-medium': ['kom:ticket-day-medium'],
  'sbb-icon-ticket-day-small': ['kom:ticket-day-small'],
  'sbb-icon-ticket-disabled-medium': ['kom:ticket-disabled-medium'],
  'sbb-icon-ticket-disabled-small': ['kom:ticket-disabled-small'],
  'sbb-icon-ticket-heart-medium': ['kom:ticket-heart-medium'],
  'sbb-icon-ticket-heart-small': ['kom:ticket-heart-small'],
  'sbb-icon-ticket-journey-medium': ['kom:ticket-journey-medium'],
  'sbb-icon-ticket-journey-small': ['kom:ticket-journey-small'],
  'sbb-icon-ticket-parking-medium': ['kom:ticket-parking-medium'],
  'sbb-icon-ticket-parking-small': ['kom:ticket-parking-small'],
  'sbb-icon-ticket-percent-medium': ['kom:ticket-percent-medium'],
  'sbb-icon-ticket-percent-small': ['kom:ticket-percent-small'],
  'sbb-icon-ticket-route-medium': ['kom:ticket-route-medium'],
  'sbb-icon-ticket-route-small': ['kom:ticket-route-small'],
  'sbb-icon-ticket-star-medium': ['kom:ticket-star-medium'],
  'sbb-icon-ticket-star-small': ['kom:ticket-star-small'],
  'sbb-icon-tickets-class-medium': ['kom:tickets-class-medium'],
  'sbb-icon-tickets-class-small': ['kom:tickets-class-small'],
  'sbb-icon-arrow-change-medium': ['kom:arrow-change-medium'],
  'sbb-icon-arrow-change-small': ['kom:arrow-change-small'],
  'sbb-icon-avatar-train-staff-disabled-medium': ['kom:avatar-train-staff-disabled-medium'],
  'sbb-icon-avatar-train-staff-disabled-small': ['kom:avatar-train-staff-disabled-small'],
  'sbb-icon-avatar-train-staff-medium': ['kom:avatar-train-staff-medium'],
  'sbb-icon-avatar-train-staff-small': ['kom:avatar-train-staff-small'],
  'sbb-icon-clock-medium': ['kom:clock-medium'],
  'sbb-icon-clock-small': ['kom:clock-small'],
  'sbb-icon-hourglass-medium': ['kom:hourglass-medium'],
  'sbb-icon-hourglass-small': ['kom:hourglass-small'],
  'sbb-icon-locomotive-medium': ['kom:locomotive-medium'],
  'sbb-icon-locomotive-small': ['kom:locomotive-small'],
  'sbb-icon-percent-large': ['kom:percent-large'],
  'sbb-icon-percent-medium': ['kom:percent-medium'],
  'sbb-icon-percent-small': ['kom:percent-small'],
  'sbb-icon-percent-tag-medium': ['kom:percent-tag-medium'],
  'sbb-icon-percent-tag-small': ['kom:percent-tag-small'],
  'sbb-icon-punctuality-medium': ['kom:punctuality-medium'],
  'sbb-icon-punctuality-small': ['kom:punctuality-small'],
  'sbb-icon-route-circle-end-medium': ['kom:route-circle-end-medium'],
  'sbb-icon-route-circle-end-small': ['kom:route-circle-end-small'],
  'sbb-icon-route-circle-start-medium': ['kom:route-circle-start-medium'],
  'sbb-icon-route-circle-start-small': ['kom:route-circle-start-small'],
  'sbb-icon-seat-window-medium': ['kom:seat-window-medium'],
  'sbb-icon-seat-window-small': ['kom:seat-window-small'],
  'sbb-icon-switzerland-route-large': ['kom:switzerland-route-large'],
  'sbb-icon-switzerland-route-medium': ['kom:switzerland-route-medium'],
  'sbb-icon-switzerland-route-small': ['kom:switzerland-route-small'],
  'sbb-icon-timetable-medium': ['kom:timetable-medium'],
  'sbb-icon-timetable-small': ['kom:timetable-small'],
  'sbb-icon-walk-fast-medium': ['kom:walk-fast-medium'],
  'sbb-icon-walk-fast-small': ['kom:walk-fast-small'],
  'sbb-icon-walk-medium': ['kom:walk-medium'],
  'sbb-icon-walk-slow-medium': ['kom:walk-slow-medium'],
  'sbb-icon-walk-slow-small': ['kom:walk-slow-small'],
  'sbb-icon-walk-small': ['kom:walk-small'],
  'sbb-icon-wheelchair-inaccessible-medium': ['kom:wheelchair-inaccessible-medium'],
  'sbb-icon-wheelchair-inaccessible-small': ['kom:wheelchair-inaccessible-small'],
  'sbb-icon-wheelchair-medium': ['kom:wheelchair-medium'],
  'sbb-icon-wheelchair-partially-medium': ['kom:wheelchair-partially-medium'],
  'sbb-icon-wheelchair-partially-small': ['kom:wheelchair-partially-small'],
  'sbb-icon-wheelchair-reservation-medium': ['kom:wheelchair-reservation-medium'],
  'sbb-icon-wheelchair-reservation-small': ['kom:wheelchair-reservation-small'],
  'sbb-icon-wheelchair-small': ['kom:wheelchair-small'],
  'sbb-icon-wheelchair-uncertain-medium': ['kom:wheelchair-uncertain-medium'],
  'sbb-icon-wheelchair-uncertain-small': ['kom:wheelchair-uncertain-small'],
  'sbb-icon-airplane-medium': ['kom:airplane-medium'],
  'sbb-icon-airplane-small': ['kom:airplane-small'],
  'sbb-icon-bicycle-large': ['kom:bicycle-large'],
  'sbb-icon-bicycle-medium': ['kom:bicycle-medium'],
  'sbb-icon-bicycle-small': ['kom:bicycle-small'],
  'sbb-icon-bus-circle-medium': ['kom:bus-surrounding-area-medium'],
  'sbb-icon-bus-circle-small': ['kom:bus-surrounding-area-small'],
  'sbb-icon-bus-medium': ['kom:bus-medium'],
  'sbb-icon-bus-sbb-medium': ['kom:bus-sbb-medium'],
  'sbb-icon-bus-sbb-small': ['kom:bus-sbb-small'],
  'sbb-icon-bus-small': ['kom:bus-small'],
  'sbb-icon-bus-stop-medium': ['kom:bus-stop-medium'],
  'sbb-icon-bus-stop-small': ['kom:bus-stop-small'],
  'sbb-icon-car-medium': ['kom:car-medium'],
  'sbb-icon-car-parking-medium': ['kom:car-sign-parking-medium'],
  'sbb-icon-car-parking-small': ['kom:car-sign-parking-small'],
  'sbb-icon-car-small': ['kom:car-small'],
  'sbb-icon-charging-station-medium': ['kom:charging-station-medium'],
  'sbb-icon-charging-station-small': ['kom:charging-station-small'],
  'sbb-icon-combined-mobility-medium': ['kom:combined-mobility-medium'],
  'sbb-icon-combined-mobility-small': ['kom:combined-mobility-small'],
  'sbb-icon-container-medium': ['kom:container-medium'],
  'sbb-icon-container-small': ['kom:container-small'],
  'sbb-icon-driverless-bus-medium': ['kom:moving-bus-medium'],
  'sbb-icon-driverless-bus-small': ['kom:moving-bus-small'],
  'sbb-icon-freight-wagon-medium': ['kom:freight-wagon-medium'],
  'sbb-icon-freight-wagon-small': ['kom:freight-wagon-small'],
  'sbb-icon-k-r-medium': ['kom:k-r-medium'],
  'sbb-icon-k-r-small': ['kom:k-r-small'],
  'sbb-icon-park-and-rail-medium': ['kom:park-and-rail-medium'],
  'sbb-icon-park-and-rail-small': ['kom:park-and-rail-small'],
  'sbb-icon-petrol-station-medium': ['kom:petrol-station-medium'],
  'sbb-icon-petrol-station-small': ['kom:petrol-station-small'],
  'sbb-icon-shuttle-medium': ['kom:shuttle-medium'],
  'sbb-icon-shuttle-small': ['kom:shuttle-small'],
  'sbb-icon-taxi-medium': ['kom:taxi-medium'],
  'sbb-icon-taxi-small': ['kom:taxi-small'],
  'sbb-icon-train-large': ['kom:train-large'],
  'sbb-icon-train-medium': ['kom:train-medium'],
  'sbb-icon-train-small': ['kom:train-small'],
  'sbb-icon-tram-medium': ['kom:tram-medium'],
  'sbb-icon-tram-small': ['kom:tram-small'],
  'sbb-icon-avatar-police-medium': ['kom:avatar-police-medium'],
  'sbb-icon-avatar-police-small': ['kom:avatar-police-small'],
  'sbb-icon-employees-large': ['kom:employees-sbb-large'],
  'sbb-icon-key-medium': ['kom:key-medium'],
  'sbb-icon-key-small': ['kom:key-small'],
  'sbb-icon-pie-medium': ['kom:pie-medium'],
  'sbb-icon-pie-small': ['kom:pie-small'],
  'sbb-icon-two-users-medium': ['kom:two-users-medium'],
  'sbb-icon-two-users-small': ['kom:two-users-small'],
  'sbb-icon-user-change-medium': ['kom:user-change-medium'],
  'sbb-icon-user-change-small': ['kom:user-change-small'],
  'sbb-icon-user-group-large': ['kom:user-group-large'],
  'sbb-icon-user-group-medium': ['kom:user-group-medium'],
  'sbb-icon-user-group-round-table-medium': ['kom:user-group-round-table-medium'],
  'sbb-icon-user-group-round-table-small': ['kom:user-group-round-table-small'],
  'sbb-icon-user-group-row-medium': ['kom:user-group-row-medium'],
  'sbb-icon-user-group-row-small': ['kom:user-group-row-small'],
  'sbb-icon-user-group-small': ['kom:user-group-small'],
  'sbb-icon-user-hat-medium': ['kom:user-hat-medium'],
  'sbb-icon-user-hat-small': ['kom:user-hat-small'],
  'sbb-icon-user-headset-medium': ['kom:user-headset-medium'],
  'sbb-icon-user-headset-small': ['kom:user-headset-small'],
  'sbb-icon-user-key-medium': ['kom:user-key-medium'],
  'sbb-icon-user-key-small': ['kom:user-key-small'],
  'sbb-icon-user-medium': ['kom:user-medium'],
  'sbb-icon-user-plus-medium': ['kom:user-plus-medium'],
  'sbb-icon-user-plus-small': ['kom:user-plus-small'],
  'sbb-icon-user-small': ['kom:user-small'],
  'sbb-icon-user-tie-medium': ['kom:user-tie-medium'],
  'sbb-icon-user-tie-small': ['kom:user-tie-small'],
  'sbb-icon-cloud-dense-fog-medium': ['kom:cloud-dense-fog-medium'],
  'sbb-icon-cloud-dense-fog-small': ['kom:cloud-dense-fog-small'],
  'sbb-icon-cloud-drops-medium': ['kom:cloud-drops-medium'],
  'sbb-icon-cloud-drops-moon-medium': ['kom:cloud-drops-moon-medium'],
  'sbb-icon-cloud-drops-moon-small': ['kom:cloud-drops-moon-small'],
  'sbb-icon-cloud-drops-small': ['kom:cloud-drops-small'],
  'sbb-icon-cloud-fog-medium': ['kom:cloud-fog-medium'],
  'sbb-icon-cloud-fog-small': ['kom:cloud-fog-small'],
  'sbb-icon-cloud-ice-medium': ['kom:cloud-ice-medium'],
  'sbb-icon-cloud-ice-small': ['kom:cloud-ice-small'],
  'sbb-icon-cloud-lightning-medium': ['kom:cloud-lightning-medium'],
  'sbb-icon-cloud-lightning-moon-medium': ['kom:cloud-lightning-moon-medium'],
  'sbb-icon-cloud-lightning-moon-small': ['kom:cloud-lightning-moon-small'],
  'sbb-icon-cloud-lightning-small': ['kom:cloud-lightning-small'],
  'sbb-icon-cloud-little-snow-moon-medium': ['kom:cloud-little-snow-moon-medium'],
  'sbb-icon-cloud-little-snow-moon-small': ['kom:cloud-little-snow-moon-small'],
  'sbb-icon-cloud-little-snow-sun-medium': ['kom:cloud-little-snow-sun-medium'],
  'sbb-icon-cloud-little-snow-sun-small': ['kom:cloud-little-snow-sun-small'],
  'sbb-icon-cloud-medium': ['kom:cloud-medium'],
  'sbb-icon-cloud-moon-medium': ['kom:cloud-moon-medium'],
  'sbb-icon-cloud-moon-small': ['kom:cloud-moon-small'],
  'sbb-icon-cloud-rain-medium': ['kom:cloud-rain-medium'],
  'sbb-icon-cloud-rain-small': ['kom:cloud-rain-small'],
  'sbb-icon-cloud-rain-snow-medium': ['kom:cloud-rain-snow-medium'],
  'sbb-icon-cloud-rain-snow-moon-medium': ['kom:cloud-rain-snow-moon-medium'],
  'sbb-icon-cloud-rain-snow-moon-small': ['kom:cloud-rain-snow-moon-small'],
  'sbb-icon-cloud-rain-snow-small': ['kom:cloud-rain-snow-small'],
  'sbb-icon-cloud-rain-snow-sun-medium': ['kom:cloud-rain-snow-sun-medium'],
  'sbb-icon-cloud-rain-snow-sun-small': ['kom:cloud-rain-snow-sun-small'],
  'sbb-icon-cloud-rain-sun-medium': ['kom:cloud-rain-sun-medium'],
  'sbb-icon-cloud-rain-sun-small': ['kom:cloud-rain-sun-small'],
  'sbb-icon-cloud-small': ['kom:cloud-small'],
  'sbb-icon-cloud-snow-lightning-medium': ['kom:cloud-snow-lightning-medium'],
  'sbb-icon-cloud-snow-lightning-small': ['kom:cloud-snow-lightning-small'],
  'sbb-icon-cloud-snow-medium': ['kom:cloud-snow-medium'],
  'sbb-icon-cloud-snow-moon-medium': ['kom:cloud-snow-moon-medium'],
  'sbb-icon-cloud-snow-moon-small': ['kom:cloud-snow-moon-small'],
  'sbb-icon-cloud-snow-small': ['kom:cloud-snow-small'],
  'sbb-icon-cloud-snow-sun-medium': ['kom:cloud-snow-sun-medium'],
  'sbb-icon-cloud-snow-sun-small': ['kom:cloud-snow-sun-small'],
  'sbb-icon-cloud-snowflake-medium': ['kom:cloud-snowflake-medium'],
  'sbb-icon-cloud-snowflake-small': ['kom:cloud-snowflake-small'],
  'sbb-icon-cloud-snowflake-sun-medium': ['kom:cloud-snowflake-sun-medium'],
  'sbb-icon-cloud-snowflake-sun-small': ['kom:cloud-snowflake-sun-small'],
  'sbb-icon-cloud-strong-rain-moon-medium': ['kom:cloud-strong-rain-moon-medium'],
  'sbb-icon-cloud-strong-rain-moon-small': ['kom:cloud-strong-rain-moon-small'],
  'sbb-icon-cloud-strong-rain-sun-medium': ['kom:cloud-strong-rain-sun-medium'],
  'sbb-icon-cloud-strong-rain-sun-small': ['kom:cloud-strong-rain-sun-small'],
  'sbb-icon-cloud-sun-medium': ['kom:cloud-sun-medium'],
  'sbb-icon-cloud-sun-small': ['kom:cloud-sun-small'],
  'sbb-icon-cloud-sunshine-medium': ['kom:cloud-sunshine-medium'],
  'sbb-icon-cloud-sunshine-small': ['kom:cloud-sunshine-small'],
  'sbb-icon-fog-medium': ['kom:fog-medium'],
  'sbb-icon-fog-small': ['kom:fog-small'],
  'sbb-icon-moon-medium': ['kom:moon-medium'],
  'sbb-icon-moon-small': ['kom:moon-small'],
  'sbb-icon-sun-moon-medium': ['kom:sun-moon-medium'],
  'sbb-icon-sun-moon-small': ['kom:sun-moon-small'],
  'sbb-icon-sunrise-medium': ['kom:sunrise-medium'],
  'sbb-icon-sunrise-small': ['kom:sunrise-small'],
  'sbb-icon-sunshine-medium': ['kom:sunshine-medium'],
  'sbb-icon-sunshine-small': ['kom:sunshine-small'],
  'sbb-icon-weather-unknown-medium': ['kom:weather-unknown-medium'],
  'sbb-icon-weather-unknown-small': ['kom:weather-unknown-small'],
};
const SVG_ICON_MAPPINGS = {
  sbbiconaddstop: ['fpl:add-stop'],
  sbbiconalternative: ['fpl:alternative'],
  sbbiconcancellation: ['fpl:cancellation'],
  sbbicondelay: ['fpl:delay'],
  sbbiconhimconstruction: ['fpl:construction'],
  sbbiconhimdisruption: ['fpl:disruption'],
  sbbiconhiminfo: ['fpl:info'],
  sbbiconhimreplacementbus: ['fpl:replacementbus'],
  sbbiconmissedconnection: ['fpl:missed-connection'],
  sbbiconplatformchange: ['fpl:platform-change'],
  sbbiconreroute: ['fpl:reroute'],
  sbbiconutilizationhigh: ['fpl:utilization-high'],
  sbbiconutilizationlow: ['fpl:utilization-low'],
  sbbiconutilizationmedium: ['fpl:utilization-medium'],
  sbbiconutilizationnone: ['fpl:utilization-none'],
  sbbiconsa1: ['fpl:sa-1'],
  sbbiconsa2: ['fpl:sa-2'],
  sbbiconsaaa: ['fpl:sa-aa'],
  sbbiconsaaf: ['fpl:sa-af'],
  sbbiconsaat: ['fpl:sa-at'],
  sbbiconsaaw: ['fpl:sa-aw'],
  sbbiconsab: ['fpl:sa-b'],
  sbbiconsabb: ['fpl:sa-bb'],
  sbbiconsabe: ['fpl:sa-be'],
  sbbiconsabi: ['fpl:sa-bi'],
  sbbiconsabk: ['fpl:sa-bk'],
  sbbiconsabl: ['fpl:sa-bl'],
  sbbiconsabr: ['fpl:sa-br'],
  sbbiconsabs: ['fpl:sa-bs'],
  sbbiconsabv: ['fpl:sa-bv'],
  sbbiconsabz: ['fpl:sa-bz'],
  sbbiconsacc: ['fpl:sa-cc'],
  sbbiconsads: ['fpl:sa-ds'],
  sbbiconsadz: ['fpl:sa-dz'],
  sbbiconsaep: ['fpl:sa-ep'],
  sbbiconsafa: ['fpl:sa-fa'],
  sbbiconsafl: ['fpl:sa-fl'],
  sbbiconsafw: ['fpl:sa-fw'],
  sbbiconsafz: ['fpl:sa-fz'],
  sbbiconsagk: ['fpl:sa-gk'],
  sbbiconsagl: ['fpl:sa-gl'],
  sbbiconsagn: ['fpl:sa-gn'],
  sbbiconsagp: ['fpl:sa-gp'],
  sbbiconsagr: ['fpl:sa-gr'],
  sbbiconsagx: ['fpl:sa-gx'],
  sbbiconsagz: ['fpl:sa-gz'],
  sbbiconsahk: ['fpl:sa-hk'],
  sbbiconsahn: ['fpl:sa-hn'],
  sbbiconsaii: ['fpl:sa-ii'],
  sbbiconsaje: ['fpl:sa-je'],
  sbbiconsakb: ['fpl:sa-kb'],
  sbbiconsakw: ['fpl:sa-kw'],
  sbbiconsalc: ['fpl:sa-lc'],
  sbbiconsale: ['fpl:sa-le'],
  sbbiconsame: ['fpl:sa-me'],
  sbbiconsami: ['fpl:sa-mi'],
  sbbiconsamp: ['fpl:sa-mp'],
  sbbiconsanf: ['fpl:sa-nf'],
  sbbiconsanj: ['fpl:sa-nj'],
  sbbiconsanv: ['fpl:sa-nv'],
  sbbiconsaob: ['fpl:sa-ob'],
  sbbiconsap: ['fpl:sa-p'],
  sbbiconsapa: ['fpl:sa-pa'],
  sbbiconsaph: ['fpl:sa-ph'],
  sbbiconsapl: ['fpl:sa-pl'],
  sbbiconsapr: ['fpl:sa-pr'],
  sbbiconsar: ['fpl:sa-r'],
  sbbiconsarb: ['fpl:sa-rb'],
  sbbiconsarc: ['fpl:sa-rc'],
  sbbiconsare: ['fpl:sa-re'],
  sbbiconsarq: ['fpl:sa-rq'],
  sbbiconsarr: ['fpl:sa-rr'],
  sbbiconsart: ['fpl:sa-rt'],
  sbbiconsary: ['fpl:sa-ry'],
  sbbiconsarz: ['fpl:sa-rz'],
  sbbiconsas: ['fpl:sa-s'],
  sbbiconsasb: ['fpl:sa-sb'],
  sbbiconsasc: ['fpl:sa-sc'],
  sbbiconsasd: ['fpl:sa-sd'],
  sbbiconsasf: ['fpl:sa-sf'],
  sbbiconsash: ['fpl:sa-sh'],
  sbbiconsask: ['fpl:sa-sk'],
  sbbiconsasl: ['fpl:sa-sl'],
  sbbiconsasm: ['fpl:sa-sm'],
  sbbiconsasn: ['fpl:sa-sn'],
  sbbiconsasv: ['fpl:sa-sv'],
  sbbiconsasz: ['fpl:sa-sz'],
  sbbiconsata: ['fpl:sa-ta'],
  sbbiconsatc: ['fpl:sa-tc'],
  sbbiconsatf: ['fpl:sa-tf'],
  sbbiconsatg: ['fpl:sa-tg'],
  sbbiconsatk: ['fpl:sa-tk'],
  sbbiconsatn: ['fpl:sa-tn'],
  sbbiconsats: ['fpl:sa-ts'],
  sbbiconsatt: ['fpl:sa-tt'],
  sbbiconsatx: ['fpl:sa-tx'],
  sbbiconsavc: ['fpl:sa-vc'],
  sbbiconsavi: ['fpl:sa-vi'],
  sbbiconsavl: ['fpl:sa-vl'],
  sbbiconsavn: ['fpl:sa-vn'],
  sbbiconsavp: ['fpl:sa-vp'],
  sbbiconsavr: ['fpl:sa-vr'],
  sbbiconsavt: ['fpl:sa-vt'],
  sbbiconsavx: ['fpl:sa-vx'],
  sbbiconsawb: ['fpl:sa-wb'],
  sbbiconsawl: ['fpl:sa-wl'],
  sbbiconsawr: ['fpl:sa-wr'],
  sbbiconsaws: ['fpl:sa-ws'],
  sbbiconsawv: ['fpl:sa-wv'],
  sbbiconsax: ['fpl:sa-x'],
  sbbiconsaxp: ['fpl:sa-xp'],
  sbbiconsaxr: ['fpl:sa-xr'],
  sbbiconsaxt: ['fpl:sa-xt'],
  sbbiconsay: ['fpl:sa-y'],
  sbbiconsayb: ['fpl:sa-yb'],
  sbbiconsaym: ['fpl:sa-ym'],
  sbbiconsayt: ['fpl:sa-yt'],
  sbbiconsaz: ['fpl:sa-z'],
  sbbiconsazm: ['fpl:sa-zm'],
  sbbiconproductbex: ['fpl:product-bex'],
  sbbiconproductcnl: ['fpl:product-cnl'],
  sbbiconproductec: ['fpl:product-ec'],
  sbbiconproducten: ['fpl:product-en'],
  sbbiconproductgex: ['fpl:product-gex'],
  sbbiconproductic1: ['fpl:product-ic-1'],
  sbbiconproductic11: ['fpl:product-ic-11'],
  sbbiconproductic2: ['fpl:product-ic-2'],
  sbbiconproductic21: ['fpl:product-ic-21'],
  sbbiconproductic3: ['fpl:product-ic-3'],
  sbbiconproductic4: ['fpl:product-ic-4'],
  sbbiconproductic5: ['fpl:product-ic-5'],
  sbbiconproductic51: ['fpl:product-ic-51'],
  sbbiconproductic6: ['fpl:product-ic-6'],
  sbbiconproductic61: ['fpl:product-ic-61'],
  sbbiconproductic7: ['fpl:product-ic-7'],
  sbbiconproductic8: ['fpl:product-ic-8'],
  sbbiconproductic9: ['fpl:product-ic-9'],
  sbbiconproductic: ['fpl:product-ic'],
  sbbiconproductice: ['fpl:product-ice'],
  sbbiconproducticn: ['fpl:product-icn'],
  sbbiconproductir13: ['fpl:product-ir-13'],
  sbbiconproductir15: ['fpl:product-ir-15'],
  sbbiconproductir16: ['fpl:product-ir-16'],
  sbbiconproductir17: ['fpl:product-ir-17'],
  sbbiconproductir25: ['fpl:product-ir-25'],
  sbbiconproductir26: ['fpl:product-ir-26'],
  sbbiconproductir27: ['fpl:product-ir-27'],
  sbbiconproductir35: ['fpl:product-ir-35'],
  sbbiconproductir36: ['fpl:product-ir-36'],
  sbbiconproductir37: ['fpl:product-ir-37'],
  sbbiconproductir45: ['fpl:product-ir-45'],
  sbbiconproductir46: ['fpl:product-ir-46'],
  sbbiconproductir55: ['fpl:product-ir-55'],
  sbbiconproductir56: ['fpl:product-ir-56'],
  sbbiconproductir65: ['fpl:product-ir-65'],
  sbbiconproductir66: ['fpl:product-ir-66'],
  sbbiconproductir70: ['fpl:product-ir-70'],
  sbbiconproductir75: ['fpl:product-ir-75'],
  sbbiconproductir90: ['fpl:product-ir-90'],
  sbbiconproductir95: ['fpl:product-ir-95'],
  sbbiconproductir: ['fpl:product-ir'],
  sbbiconproductnj: ['fpl:product-nj'],
  sbbiconproductpe: ['fpl:product-pe'],
  sbbiconproductre: ['fpl:product-re'],
  sbbiconproductrj: ['fpl:product-rj'],
  sbbiconproductrjx: ['fpl:product-rjx'],
  sbbiconproductrx: ['fpl:product-rx'],
  sbbiconproductsn: ['fpl:product-sn'],
  sbbiconproducttgv: ['fpl:product-tgv'],
  sbbiconproductvae: ['fpl:product-vae'],
  sbbiconarrowcirclemedium: ['kom:arrow-circle-medium'],
  sbbiconarrowcirclesmall: ['kom:arrow-circle-small'],
  sbbiconarrowlongleftmedium: ['kom:arrow-long-left-medium'],
  sbbiconarrowlongleftsmall: ['kom:arrow-long-left-small'],
  sbbiconarrowlongrightmedium: ['kom:arrow-long-right-medium'],
  sbbiconarrowlongrightsmall: ['kom:arrow-long-right-small'],
  sbbiconarrowrightmedium: ['kom:arrow-right-medium'],
  sbbiconarrowrightsmall: ['kom:arrow-right-small'],
  sbbiconarrowscirclemedium: ['kom:arrows-circle-medium'],
  sbbiconarrowscirclesmall: ['kom:arrows-circle-small'],
  sbbiconarrowsleftrightdownupmedium: ['kom:arrows-left-right-down-up-medium'],
  sbbiconarrowsleftrightdownupsmall: ['kom:arrows-left-right-down-up-small'],
  sbbiconarrowsleftrightmedium: ['kom:arrows-left-right-medium'],
  sbbiconarrowsleftrightsmall: ['kom:arrows-left-right-small'],
  sbbiconarrowsrightleftmedium: ['kom:arrows-right-left-medium'],
  sbbiconarrowsrightleftsmall: ['kom:arrows-right-left-small'],
  sbbiconarrowsupdownmedium: ['kom:arrows-up-down-medium'],
  sbbiconarrowsupdownsmall: ['kom:arrows-up-down-small'],
  sbbiconchevronrightmedium: ['kom:chevron-right-medium'],
  sbbiconchevronrightsmall: ['kom:chevron-right-small'],
  sbbiconchevronsmalldowncirclemedium: ['kom:chevron-small-down-circle-medium'],
  sbbiconchevronsmalldowncirclesmall: ['kom:chevron-small-down-circle-small'],
  sbbiconchevronsmalldownmedium: ['kom:chevron-small-down-medium'],
  sbbiconchevronsmalldownsmall: ['kom:chevron-small-down-small'],
  sbbiconchevronsmallleftcirclemedium: ['kom:chevron-small-left-circle-medium'],
  sbbiconchevronsmallleftcirclesmall: ['kom:chevron-small-left-circle-small'],
  sbbiconchevronsmallleftmedium: ['kom:chevron-small-left-medium'],
  sbbiconchevronsmallleftsmall: ['kom:chevron-small-left-small'],
  sbbiconchevronsmallrightcirclemedium: ['kom:chevron-small-right-circle-medium'],
  sbbiconchevronsmallrightcirclesmall: ['kom:chevron-small-right-circle-small'],
  sbbiconchevronsmallrightmedium: ['kom:chevron-small-right-medium'],
  sbbiconchevronsmallrightsmall: ['kom:chevron-small-right-small'],
  sbbiconchevronsmallupcirclemedium: ['kom:chevron-small-up-circle-medium'],
  sbbiconchevronsmallupcirclesmall: ['kom:chevron-small-up-circle-small'],
  sbbiconchevronsmallupmedium: ['kom:chevron-small-up-medium'],
  sbbiconchevronsmallupsmall: ['kom:chevron-small-up-small'],
  sbbiconincreasesizemedium: ['kom:increase-size-medium'],
  sbbiconincreasesizesmall: ['kom:increase-size-small'],
  sbbiconreducesizemedium: ['kom:reduce-size-medium'],
  sbbiconreducesizesmall: ['kom:reduce-size-small'],
  sbbiconfastforwardmedium: ['kom:fast-forward-medium'],
  sbbiconfastforwardsmall: ['kom:fast-forward-small'],
  sbbiconnextmedium: ['kom:next-medium'],
  sbbiconnextsmall: ['kom:next-small'],
  sbbiconpausemedium: ['kom:pause-medium'],
  sbbiconpausesmall: ['kom:pause-small'],
  sbbiconplaymedium: ['kom:play-medium'],
  sbbiconplaysmall: ['kom:play-small'],
  sbbiconpreviousmedium: ['kom:previous-medium'],
  sbbiconprevioussmall: ['kom:previous-small'],
  sbbiconrecordmedium: ['kom:record-medium'],
  sbbiconrecordsmall: ['kom:record-small'],
  sbbiconrewindmedium: ['kom:rewind-medium'],
  sbbiconrewindsmall: ['kom:rewind-small'],
  sbbiconstopmedium: ['kom:stop-medium'],
  sbbiconstopsmall: ['kom:stop-small'],
  sbbiconalarmclockmedium: ['kom:alarm-clock-medium'],
  sbbiconalarmclocksmall: ['kom:alarm-clock-small'],
  sbbiconappiconmedium: ['kom:app-icon-medium'],
  sbbiconappiconsmall: ['kom:app-icon-small'],
  sbbiconapplebagmedium: ['kom:apple-bag-medium'],
  sbbiconapplebagsmall: ['kom:apple-bag-small'],
  sbbiconbackpackmedium: ['kom:backpack-medium'],
  sbbiconbackpacksmall: ['kom:backpack-small'],
  sbbiconbellmedium: ['kom:bell-medium'],
  sbbiconbellsmall: ['kom:bell-small'],
  sbbiconbinocularsmedium: ['kom:binoculars-medium'],
  sbbiconbinocularssmall: ['kom:binoculars-small'],
  sbbiconbrowsermedium: ['kom:browser-medium'],
  sbbiconbrowsersmall: ['kom:browser-small'],
  sbbiconcalendarlarge: ['kom:calendar-large'],
  sbbiconcalendarmedium: ['kom:calendar-medium'],
  sbbiconcalendarsmall: ['kom:calendar-small'],
  sbbiconcameramedium: ['kom:camera-medium'],
  sbbiconcamerasmall: ['kom:camera-small'],
  sbbiconchartcolumnmedium: ['kom:chart-column-medium'],
  sbbiconchartcolumnsmall: ['kom:chart-column-small'],
  sbbiconchartcolumntrendlarge: ['kom:chart-column-trend-large'],
  sbbiconchartcolumntrendmedium: ['kom:chart-column-trend-medium'],
  sbbiconchartcolumntrendsmall: ['kom:chart-column-trend-small'],
  sbbiconchartlinemedium: ['kom:chart-line-medium'],
  sbbiconchartlinesmall: ['kom:chart-line-small'],
  sbbiconchartpiemedium: ['kom:chart-pie-medium'],
  sbbiconchartpiesmall: ['kom:chart-pie-small'],
  sbbiconcircleinformationmedium: ['kom:circle-information-medium'],
  sbbiconcircleinformationsmallmedium: ['kom:circle-information-small-medium'],
  sbbiconcircleinformationsmallsmall: ['kom:circle-information-small-small'],
  sbbiconcircleinformationsmall: ['kom:circle-information-small'],
  sbbiconcircleplaymedium: ['kom:circle-play-medium'],
  sbbiconcircleplaysmall: ['kom:circle-play-small'],
  sbbiconcirclequestionmarkmedium: ['kom:circle-question-mark-medium'],
  sbbiconcirclequestionmarksmall: ['kom:circle-question-mark-small'],
  sbbiconcoinslarge: ['kom:coins-large'],
  sbbiconcontactmedium: ['kom:contact-medium'],
  sbbiconcontactsmall: ['kom:contact-small'],
  sbbiconcontrolsmedium: ['kom:controls-medium'],
  sbbiconcontrolssmall: ['kom:controls-small'],
  sbbiconcuphotmedium: ['kom:cup-hot-medium'],
  sbbiconcuphotsmall: ['kom:cup-hot-small'],
  sbbiconcutlerymedium: ['kom:cutlery-medium'],
  sbbiconcutlerysmall: ['kom:cutlery-small'],
  sbbicondatabasemedium: ['kom:database-medium'],
  sbbicondatabasesmall: ['kom:database-small'],
  sbbicondogmedium: ['kom:dog-medium'],
  sbbicondogsmall: ['kom:dog-small'],
  sbbicondownloadlargedatamedium: ['kom:download-large-data-medium'],
  sbbicondownloadlargedatasmall: ['kom:download-large-data-small'],
  sbbicondownloadmedium: ['kom:download-medium'],
  sbbicondownloadsmalldatamedium: ['kom:download-small-data-medium'],
  sbbicondownloadsmalldatasmall: ['kom:download-small-data-small'],
  sbbicondownloadsmall: ['kom:download-small'],
  sbbiconentrancemedium: ['kom:entrance-medium'],
  sbbiconentrancesmall: ['kom:entrance-small'],
  sbbiconenvelopemedium: ['kom:envelope-medium'],
  sbbiconenvelopeopenmedium: ['kom:envelope-open-medium'],
  sbbiconenvelopeopensmall: ['kom:envelope-open-small'],
  sbbiconenvelopesmall: ['kom:envelope-small'],
  sbbiconexitmedium: ['kom:exit-medium'],
  sbbiconexitsmall: ['kom:exit-small'],
  sbbiconfacekingmedium: ['kom:face-king-medium'],
  sbbiconfacekingsmall: ['kom:face-king-small'],
  sbbiconfaceworkermedium: ['kom:face-worker-medium'],
  sbbiconfaceworkersmall: ['kom:face-worker-small'],
  sbbiconfactorymedium: ['kom:factory-medium'],
  sbbiconfactorysmall: ['kom:factory-small'],
  sbbiconfiltermedium: ['kom:filter-medium'],
  sbbiconfiltersmall: ['kom:filter-small'],
  sbbiconfilterxmedium: ['kom:filter-x-medium'],
  sbbiconfilterxsmall: ['kom:filter-x-small'],
  sbbiconflashlightonmedium: ['kom:flashlight-on-medium'],
  sbbiconflashlightonsmall: ['kom:flashlight-on-small'],
  sbbiconformmedium: ['kom:form-medium'],
  sbbiconformsmall: ['kom:form-small'],
  sbbicongearsmedium: ['kom:gears-medium'],
  sbbicongearssmall: ['kom:gears-small'],
  sbbicongiftmedium: ['kom:gift-medium'],
  sbbicongiftsmall: ['kom:gift-small'],
  sbbiconglobemedium: ['kom:globe-medium'],
  sbbiconglobesmall: ['kom:globe-small'],
  sbbiconhandheartmedium: ['kom:hand-heart-medium'],
  sbbiconhandheartsmall: ['kom:hand-heart-small'],
  sbbiconhandwithservicebellmedium: ['kom:hand-with-service-bell-medium'],
  sbbiconhandwithservicebellsmall: ['kom:hand-with-service-bell-small'],
  sbbiconheartmedium: ['kom:heart-medium'],
  sbbiconheartsmall: ['kom:heart-small'],
  sbbiconhierarchymedium: ['kom:hierarchy-medium'],
  sbbiconhierarchysmall: ['kom:hierarchy-small'],
  sbbiconlighthousemedium: ['kom:lighthouse-medium'],
  sbbiconlighthousesmall: ['kom:lighthouse-small'],
  sbbiconlinkexternalmedium: ['kom:link-external-medium'],
  sbbiconlinkexternalsmall: ['kom:link-external-small'],
  sbbiconlinkmedium: ['kom:link-medium'],
  sbbiconlinksmall: ['kom:link-small'],
  sbbiconlistmedium: ['kom:list-medium'],
  sbbiconlistsmall: ['kom:list-small'],
  sbbiconmagnifyingglassmedium: ['kom:magnifying-glass-medium'],
  sbbiconmagnifyingglasssmall: ['kom:magnifying-glass-small'],
  sbbiconmughotmedium: ['kom:mug-hot-medium'],
  sbbiconmughotsmall: ['kom:mug-hot-small'],
  sbbiconnewspapermedium: ['kom:newspaper-medium'],
  sbbiconnewspapersmall: ['kom:newspaper-small'],
  sbbiconpaperaeroplanemedium: ['kom:paper-aeroplane-medium'],
  sbbiconpaperaeroplanesmall: ['kom:paper-aeroplane-small'],
  sbbiconpaperclipmedium: ['kom:paper-clip-medium'],
  sbbiconpaperclipsmall: ['kom:paper-clip-small'],
  sbbiconpenmedium: ['kom:pen-medium'],
  sbbiconpensmall: ['kom:pen-small'],
  sbbiconpicturemedium: ['kom:picture-medium'],
  sbbiconpicturesmall: ['kom:picture-small'],
  sbbiconpinmedium: ['kom:pin-medium'],
  sbbiconpinsmall: ['kom:pin-small'],
  sbbiconrocketlarge: ['kom:rocket-large'],
  sbbiconrssmedium: ['kom:rss-medium'],
  sbbiconrsssmall: ['kom:rss-small'],
  sbbiconservicebellmedium: ['kom:service-bell-medium'],
  sbbiconservicebellsmall: ['kom:service-bell-small'],
  sbbiconshoppingcartlarge: ['kom:shopping-cart-large'],
  sbbiconshoppingcartmedium: ['kom:shopping-cart-medium'],
  sbbiconshoppingcartsmall: ['kom:shopping-cart-small'],
  sbbiconsignexclamationpointmedium: ['kom:sign-exclamation-point-medium'],
  sbbiconsignexclamationpointsmall: ['kom:sign-exclamation-point-small'],
  sbbiconsignxmedium: ['kom:sign-x-medium'],
  sbbiconsignxsmall: ['kom:sign-x-small'],
  sbbiconspannermedium: ['kom:spanner-medium'],
  sbbiconspannersmall: ['kom:spanner-small'],
  sbbiconstarmedium: ['kom:star-medium'],
  sbbiconstarsmall: ['kom:star-small'],
  sbbiconswitzerlandmedium: ['kom:switzerland-medium'],
  sbbiconswitzerlandsmall: ['kom:switzerland-small'],
  sbbicontagmedium: ['kom:tag-medium'],
  sbbicontagsmall: ['kom:tag-small'],
  sbbicontargetmedium: ['kom:target-medium'],
  sbbicontargetsmall: ['kom:target-small'],
  sbbicontorchmedium: ['kom:torch-medium'],
  sbbicontorchsmall: ['kom:torch-small'],
  sbbicontrashmedium: ['kom:trash-medium'],
  sbbicontrashsmall: ['kom:trash-small'],
  sbbicontreemedium: ['kom:tree-medium'],
  sbbicontreesmall: ['kom:tree-small'],
  sbbiconuploadmedium: ['kom:upload-medium'],
  sbbiconuploadsmall: ['kom:upload-small'],
  sbbiconwalletmedium: ['kom:wallet-medium'],
  sbbiconwalletsmall: ['kom:wallet-small'],
  sbbiconwarninglightmedium: ['kom:warning-light-medium'],
  sbbiconwarninglightsmall: ['kom:warning-light-small'],
  sbbiconwifimedium: ['kom:wifi-medium'],
  sbbiconwifismall: ['kom:wifi-small'],
  sbbiconbuildingtreelarge: ['kom:building-tree-large'],
  sbbiconcitylarge: ['kom:city-large'],
  sbbiconcitymedium: ['kom:city-medium'],
  sbbiconcitysmall: ['kom:city-small'],
  sbbiconcurriculumvitaelarge: ['kom:curriculum-vitae-large'],
  sbbiconhandgraduationcaplarge: ['kom:hand-graduation-cap-large'],
  sbbiconshipsteeringwheelmedium: ['kom:ship-steering-wheel-medium'],
  sbbiconshipsteeringwheelsmall: ['kom:ship-steering-wheel-small'],
  sbbiconbulboffmedium: ['kom:bulb-off-medium'],
  sbbiconbulboffsmall: ['kom:bulb-off-small'],
  sbbiconbulbonlarge: ['kom:bulb-on-large'],
  sbbiconbulbonmedium: ['kom:bulb-on-medium'],
  sbbiconbulbonsmall: ['kom:bulb-on-small'],
  sbbiconfacegrinningmedium: ['kom:face-grinning-medium'],
  sbbiconfacegrinningsmall: ['kom:face-grinning-small'],
  sbbiconfaceneutralmedium: ['kom:face-neutral-medium'],
  sbbiconfaceneutralsmall: ['kom:face-neutral-small'],
  sbbiconfacesadmedium: ['kom:face-sad-medium'],
  sbbiconfacesadsmall: ['kom:face-sad-small'],
  sbbiconfacesmilingmedium: ['kom:face-smiling-medium'],
  sbbiconfacesmilingsmall: ['kom:face-smiling-small'],
  sbbiconhandshakelarge: ['kom:handshake-large'],
  sbbiconhandshakemedium: ['kom:handshake-medium'],
  sbbiconhandshakesmall: ['kom:handshake-small'],
  sbbiconnetworklarge: ['kom:network-large'],
  sbbiconnetworkmedium: ['kom:network-medium'],
  sbbiconnetworksmall: ['kom:network-small'],
  sbbicononboardingmedium: ['kom:onboarding-medium'],
  sbbicononboardingsmall: ['kom:onboarding-small'],
  sbbiconquestionanswermedium: ['kom:question-answer-medium'],
  sbbiconquestionanswersmall: ['kom:question-answer-small'],
  sbbiconsharemedium: ['kom:share-medium'],
  sbbiconsharesmall: ['kom:share-small'],
  sbbiconspeechbubblegroupemptymedium: ['kom:speech-bubble-group-empty-medium'],
  sbbiconspeechbubblegroupemptysmall: ['kom:speech-bubble-group-empty-small'],
  sbbiconspeechbubblemedium: ['kom:speech-bubble-medium'],
  sbbiconspeechbubblesmall: ['kom:speech-bubble-small'],
  sbbiconthumbdownmedium: ['kom:thumb-down-medium'],
  sbbiconthumbdownsmall: ['kom:thumb-down-small'],
  sbbiconthumbupmedium: ['kom:thumb-up-medium'],
  sbbiconthumbupsmall: ['kom:thumb-up-small'],
  sbbicontranslatemedium: ['kom:translate-medium'],
  sbbicontranslatesmall: ['kom:translate-small'],
  sbbicontwospeechbubbleslarge: ['kom:two-speech-bubbles-large'],
  sbbicontwospeechbubblesmedium: ['kom:two-speech-bubbles-medium'],
  sbbicontwospeechbubblessmall: ['kom:two-speech-bubbles-small'],
  sbbicondocumentcheckmedium: ['kom:document-check-medium'],
  sbbicondocumentchecksmall: ['kom:document-check-small'],
  sbbicondocumentimagemedium: ['kom:document-image-medium'],
  sbbicondocumentimagesmall: ['kom:document-image-small'],
  sbbicondocumentlockmedium: ['kom:document-lock-medium'],
  sbbicondocumentlocksmall: ['kom:document-lock-small'],
  sbbicondocumentmedium: ['kom:document-standard-medium'],
  sbbicondocumentpdfmedium: ['kom:document-pdf-medium'],
  sbbicondocumentpdfsmall: ['kom:document-pdf-small'],
  sbbicondocumentplusmedium: ['kom:document-plus-medium'],
  sbbicondocumentplussmall: ['kom:document-plus-small'],
  sbbicondocumentpptmedium: ['kom:document-ppt-medium'],
  sbbicondocumentpptsmall: ['kom:document-ppt-small'],
  sbbicondocumentsmall: ['kom:document-standard-small'],
  sbbicondocumentsoundmedium: ['kom:document-sound-medium'],
  sbbicondocumentsoundsmall: ['kom:document-sound-small'],
  sbbicondocumentstandardmedium: ['kom:document-standard-medium'],
  sbbicondocumentstandardsmall: ['kom:document-standard-small'],
  sbbicondocumenttextmedium: ['kom:document-text-medium'],
  sbbicondocumenttextsmall: ['kom:document-text-small'],
  sbbicondocumentvideomedium: ['kom:document-video-medium'],
  sbbicondocumentvideosmall: ['kom:document-video-small'],
  sbbicondocumentzipmedium: ['kom:document-zip-medium'],
  sbbicondocumentzipsmall: ['kom:document-zip-small'],
  sbbiconfolderinfomedium: ['kom:folder-info-medium'],
  sbbiconfolderinfosmall: ['kom:folder-info-small'],
  sbbiconfolderlockmedium: ['kom:folder-lock-medium'],
  sbbiconfolderlocksmall: ['kom:folder-lock-small'],
  sbbiconfolderopenarrowmedium: ['kom:folder-open-arrow-medium'],
  sbbiconfolderopenarrowsmall: ['kom:folder-open-arrow-small'],
  sbbiconfolderopenmedium: ['kom:folder-open-medium'],
  sbbiconfolderopensmall: ['kom:folder-open-small'],
  sbbiconfolderplusmedium: ['kom:folder-plus-medium'],
  sbbiconfolderplussmall: ['kom:folder-plus-small'],
  sbbiconmetadatamedium: ['kom:metadata-medium'],
  sbbiconmetadatasmall: ['kom:metadata-small'],
  sbbicontwofoldersmedium: ['kom:two-folders-medium'],
  sbbicontwofolderssmall: ['kom:two-folders-small'],
  sbbiconarchiveboxmedium: ['kom:archive-box-medium'],
  sbbiconarchiveboxsmall: ['kom:archive-box-small'],
  sbbiconbriefcasemedium: ['kom:briefcase-medium'],
  sbbiconbriefcasesmall: ['kom:briefcase-small'],
  sbbiconbrochuremedium: ['kom:brochure-medium'],
  sbbiconbrochuresmall: ['kom:brochure-small'],
  sbbicondeskadjustablemedium: ['kom:desk-adjustable-medium'],
  sbbicondeskadjustablesmall: ['kom:desk-adjustable-small'],
  sbbicondeskmedium: ['kom:desk-medium'],
  sbbicondesksmall: ['kom:desk-small'],
  sbbicondisplaymedium: ['kom:display-medium'],
  sbbicondisplaysmall: ['kom:display-small'],
  sbbiconkeyboardmedium: ['kom:keyboard-medium'],
  sbbiconkeyboardsmall: ['kom:keyboard-small'],
  sbbiconlaptopmedium: ['kom:laptop-medium'],
  sbbiconlaptopsmall: ['kom:laptop-small'],
  sbbiconlaptopsmartphonelarge: ['kom:laptop-smartphone-large'],
  sbbiconlaptopsmartphonemedium: ['kom:laptop-smartphone-medium'],
  sbbiconlaptopsmartphonesmall: ['kom:laptop-smartphone-small'],
  sbbiconmegaphonemedium: ['kom:megaphone-medium'],
  sbbiconmegaphonesmall: ['kom:megaphone-small'],
  sbbiconofficechairmedium: ['kom:office-chair-medium'],
  sbbiconofficechairsmall: ['kom:office-chair-small'],
  sbbiconpowerplugmedium: ['kom:power-plug-medium'],
  sbbiconpowerplugsmall: ['kom:power-plug-small'],
  sbbiconprintermedium: ['kom:printer-medium'],
  sbbiconprintersmall: ['kom:printer-small'],
  sbbiconscannermedium: ['kom:scanner-medium'],
  sbbiconscannersmall: ['kom:scanner-small'],
  sbbiconsmartphonemedium: ['kom:smartphone-medium'],
  sbbiconsmartphonesmall: ['kom:smartphone-small'],
  sbbiconspeakermedium: ['kom:speaker-medium'],
  sbbiconspeakersmall: ['kom:speaker-small'],
  sbbiconsuitcasedisabledmedium: ['kom:suitcase-disabled-medium'],
  sbbiconsuitcasedisabledsmall: ['kom:suitcase-disabled-small'],
  sbbiconsuitcasemedium: ['kom:suitcase-medium'],
  sbbiconsuitcasesmall: ['kom:suitcase-small'],
  sbbicontelephonegsmmedium: ['kom:telephone-gsm-medium'],
  sbbicontelephonegsmsmall: ['kom:telephone-gsm-small'],
  sbbicontelephonereceivermedium: ['kom:telephone-receiver-medium'],
  sbbicontelephonereceiversmall: ['kom:telephone-receiver-small'],
  sbbiconwalkietalkiemedium: ['kom:walkie-talkie-medium'],
  sbbiconwalkietalkiesmall: ['kom:walkie-talkie-small'],
  sbbiconweightmedium: ['kom:weight-medium'],
  sbbiconweightsmall: ['kom:weight-small'],
  sbbiconconstructionmedium: ['kom:construction-medium'],
  sbbiconconstructionsmall: ['kom:construction-small'],
  sbbiconrailwayswitchlarge: ['kom:railway-switch-large'],
  sbbiconrailwayswitchmedium: ['kom:railway-switch-medium'],
  sbbiconrailwayswitchsmall: ['kom:railway-switch-small'],
  sbbicontrainsignallarge: ['kom:train-signal-large'],
  sbbicontraintrackslarge: ['kom:train-tracks-large'],
  sbbiconadultkidslarge: ['kom:adult-kids-large'],
  sbbiconballoonslarge: ['kom:balloons-large'],
  sbbiconchristmastreeshoppingbaglarge: ['kom:christmas-tree-shopping-bag-large'],
  sbbiconelephantlarge: ['kom:elephant-large'],
  sbbiconferriswheellarge: ['kom:ferris-wheel-large'],
  sbbiconhikingbootlarge: ['kom:hiking-boot-large'],
  sbbiconleaflarge: ['kom:leaf-large'],
  sbbiconlocomotiveviaductlarge: ['kom:locomotive-viaduct-large'],
  sbbiconlucernechapelbridgelarge: ['kom:lucerne-chapel-bridge-large'],
  sbbiconmarketshoppingbaglarge: ['kom:market-shopping-bag-large'],
  sbbiconmountainsunlarge: ['kom:mountain-sun-large'],
  sbbiconmountainsunmedium: ['kom:mountain-sun-medium'],
  sbbiconmountainsunsmall: ['kom:mountain-sun-small'],
  sbbiconmuseumlarge: ['kom:museum-large'],
  sbbiconmusicrockhandgesturelarge: ['kom:music-rock-hand-gesture-large'],
  sbbiconrailwayshiplarge: ['kom:railway-ship-large'],
  sbbiconsledgesnowshoelarge: ['kom:sledge-snowshoe-large'],
  sbbiconsoccerballlarge: ['kom:soccer-ball-large'],
  sbbiconthreeadultslarge: ['kom:three-adults-large'],
  sbbicontrainskilarge: ['kom:train-ski-large'],
  sbbicontwoadultskidlarge: ['kom:two-adults-kid-large'],
  sbbiconarrowcompassmedium: ['kom:arrow-compass-medium'],
  sbbiconarrowcompasssmall: ['kom:arrow-compass-small'],
  sbbicongpsdisabledmedium: ['kom:gps-disabled-medium'],
  sbbicongpsdisabledsmall: ['kom:gps-disabled-small'],
  sbbicongpsmedium: ['kom:gps-medium'],
  sbbicongpssmall: ['kom:gps-small'],
  sbbiconlocationpinamedium: ['kom:location-pin-a-medium'],
  sbbiconlocationpinasmall: ['kom:location-pin-a-small'],
  sbbiconlocationpinbmedium: ['kom:location-pin-b-medium'],
  sbbiconlocationpinbsmall: ['kom:location-pin-b-small'],
  sbbiconlocationpinmapmedium: ['kom:location-pin-map-medium'],
  sbbiconlocationpinmapsmall: ['kom:location-pin-map-small'],
  sbbiconlocationpinmedium: ['kom:location-pin-medium'],
  sbbiconlocationpinpulsesurroundingareamedium: ['kom:location-pin-pulse-surrounding-area-medium'],
  sbbiconlocationpinpulsesurroundingareasmall: ['kom:location-pin-pulse-surrounding-area-small'],
  sbbiconlocationpinsmall: ['kom:location-pin-small'],
  sbbiconlocationpinsurroundingareamedium: ['kom:location-pin-surrounding-area-medium'],
  sbbiconlocationpinsurroundingareasmall: ['kom:location-pin-surrounding-area-small'],
  sbbiconmountainminusmedium: ['kom:mountain-minus-medium'],
  sbbiconmountainminussmall: ['kom:mountain-minus-small'],
  sbbiconmountainplusmedium: ['kom:mountain-plus-medium'],
  sbbiconmountainplussmall: ['kom:mountain-plus-small'],
  sbbiconcircleminusmedium: ['kom:circle-minus-medium'],
  sbbiconcircleminussmall: ['kom:circle-minus-small'],
  sbbiconcircleplusmedium: ['kom:circle-plus-medium'],
  sbbiconcircleplussmall: ['kom:circle-plus-small'],
  sbbiconcontextmenumedium: ['kom:context-menu-medium'],
  sbbiconcontextmenusmall: ['kom:context-menu-small'],
  sbbiconcrossmedium: ['kom:cross-medium'],
  sbbiconcrosssmall: ['kom:cross-small'],
  sbbicondragmedium: ['kom:drag-medium'],
  sbbicondragsmall: ['kom:drag-small'],
  sbbiconhamburgermenumedium: ['kom:hamburger-menu-medium'],
  sbbiconhamburgermenusmall: ['kom:hamburger-menu-small'],
  sbbiconhousemedium: ['kom:house-medium'],
  sbbiconhousesmall: ['kom:house-small'],
  sbbiconlayersmedium: ['kom:layers-medium'],
  sbbiconlayerssmall: ['kom:layers-small'],
  sbbiconminusmedium: ['kom:minus-medium'],
  sbbiconminussmall: ['kom:minus-small'],
  sbbiconplusmedium: ['kom:plus-medium'],
  sbbiconplussmall: ['kom:plus-small'],
  sbbicontwofingertapmedium: ['kom:two-finger-tap-medium'],
  sbbicontwofingertapsmall: ['kom:two-finger-tap-small'],
  sbbiconbookmedium: ['kom:book-medium'],
  sbbiconbooksmall: ['kom:book-small'],
  sbbiconbottleapplemedium: ['kom:bottle-apple-medium'],
  sbbiconbottleapplesmall: ['kom:bottle-apple-small'],
  sbbiconcustomerassistancemedium: ['kom:customer-assistance-sbb-medium'],
  sbbiconcustomerassistancesmall: ['kom:customer-assistance-sbb-small'],
  sbbiconescalatormedium: ['kom:escalator-medium'],
  sbbiconescalatorsmall: ['kom:escalator-small'],
  sbbicongeneraldisplaymedium: ['kom:general-display-medium'],
  sbbicongeneraldisplaysmall: ['kom:general-display-small'],
  sbbiconhandmedium: ['kom:hand-sbb-medium'],
  sbbiconhandpluscirclemedium: ['kom:hand-plus-circle-medium'],
  sbbiconhandpluscirclesmall: ['kom:hand-plus-circle-small'],
  sbbiconhandsmall: ['kom:hand-sbb-small'],
  sbbiconhostelmedium: ['kom:hostel-medium'],
  sbbiconhostelsmall: ['kom:hostel-small'],
  sbbiconliftmedium: ['kom:lift-medium'],
  sbbiconliftsmall: ['kom:lift-small'],
  sbbiconlockermedium: ['kom:locker-medium'],
  sbbiconlockersmall: ['kom:locker-small'],
  sbbiconlotuslarge: ['kom:lotus-large'],
  sbbiconlotusmedium: ['kom:lotus-medium'],
  sbbiconlotussmall: ['kom:lotus-small'],
  sbbiconmeetingpointmedium: ['kom:meeting-point-medium'],
  sbbiconmeetingpointsmall: ['kom:meeting-point-small'],
  sbbiconmoneyexchangemedium: ['kom:money-exchange-medium'],
  sbbiconmoneyexchangesmall: ['kom:money-exchange-small'],
  sbbiconplatformdisplaymedium: ['kom:platform-display-medium'],
  sbbiconplatformdisplaysmall: ['kom:platform-display-small'],
  sbbiconplatformlarge: ['kom:platform-large'],
  sbbiconscreeninsidetrainmedium: ['kom:screen-inside-train-medium'],
  sbbiconscreeninsidetrainsmall: ['kom:screen-inside-train-small'],
  sbbiconshirtshoemedium: ['kom:shirt-shoe-medium'],
  sbbiconshirtshoesmall: ['kom:shirt-shoe-small'],
  sbbiconshoppingbagcouponmedium: ['kom:shopping-bag-coupon-medium'],
  sbbiconshoppingbagcouponsmall: ['kom:shopping-bag-coupon-small'],
  sbbiconshoppingbagfastmedium: ['kom:shopping-bag-fast-medium'],
  sbbiconshoppingbagfastsmall: ['kom:shopping-bag-fast-small'],
  sbbiconshoppingbagmedium: ['kom:shopping-bag-medium'],
  sbbiconshoppingbagsmall: ['kom:shopping-bag-small'],
  sbbiconstationlarge: ['kom:station-large'],
  sbbiconstationmedium: ['kom:station-medium'],
  sbbiconstationsmall: ['kom:station-small'],
  sbbiconstationsurroundingareamedium: ['kom:station-surrounding-area-medium'],
  sbbiconstationsurroundingareasmall: ['kom:station-surrounding-area-small'],
  sbbiconticketmachinemedium: ['kom:ticket-machine-medium'],
  sbbiconticketmachinesmall: ['kom:ticket-machine-small'],
  sbbiconticketmachineticketmedium: ['kom:ticket-machine-ticket-medium'],
  sbbiconticketmachineticketsmall: ['kom:ticket-machine-ticket-small'],
  sbbicontoiletmedium: ['kom:toilet-medium'],
  sbbicontoiletsmall: ['kom:toilet-small'],
  sbbicontrainstationmedium: ['kom:train-station-medium'],
  sbbicontrainstationsmall: ['kom:train-station-small'],
  sbbiconwaitingroommedium: ['kom:waiting-room-medium'],
  sbbiconwaitingroomsmall: ['kom:waiting-room-small'],
  sbbiconwinecheesemedium: ['kom:wine-cheese-medium'],
  sbbiconwinecheesesmall: ['kom:wine-cheese-small'],
  sbbiconbuttonpowermedium: ['kom:button-power-medium'],
  sbbiconbuttonpowersmall: ['kom:button-power-small'],
  sbbiconexclamationpointmedium: ['kom:exclamation-point-medium'],
  sbbiconexclamationpointsmall: ['kom:exclamation-point-small'],
  sbbiconeyedisabledmedium: ['kom:eye-disabled-medium'],
  sbbiconeyedisabledsmall: ['kom:eye-disabled-small'],
  sbbiconeyemedium: ['kom:eye-medium'],
  sbbiconeyesmall: ['kom:eye-small'],
  sbbiconlockclosedmedium: ['kom:lock-closed-medium'],
  sbbiconlockclosedsmall: ['kom:lock-closed-small'],
  sbbiconlockopenmedium: ['kom:lock-open-medium'],
  sbbiconlockopensmall: ['kom:lock-open-small'],
  sbbiconquestionmarkmedium: ['kom:question-mark-medium'],
  sbbiconquestionmarksmall: ['kom:question-mark-small'],
  sbbicontickclipboardmedium: ['kom:clipboard-tick-medium'],
  sbbicontickclipboardsmall: ['kom:clipboard-tick-small'],
  sbbicontickmedium: ['kom:tick-medium'],
  sbbiconticksmall: ['kom:tick-small'],
  sbbiconqrcodedisabledmedium: ['kom:qrcode-disabled-medium'],
  sbbiconqrcodedisabledsmall: ['kom:qrcode-disabled-small'],
  sbbiconqrcodemedium: ['kom:qrcode-medium'],
  sbbiconqrcodesmall: ['kom:qrcode-small'],
  sbbiconswisspassmedium: ['kom:swisspass-medium'],
  sbbiconswisspasssmall: ['kom:swisspass-small'],
  sbbiconswisspasstemporarymedium: ['kom:swisspass-temporary-medium'],
  sbbiconswisspasstemporarysmall: ['kom:swisspass-temporary-small'],
  sbbiconticketdaymedium: ['kom:ticket-day-medium'],
  sbbiconticketdaysmall: ['kom:ticket-day-small'],
  sbbiconticketdisabledmedium: ['kom:ticket-disabled-medium'],
  sbbiconticketdisabledsmall: ['kom:ticket-disabled-small'],
  sbbiconticketheartmedium: ['kom:ticket-heart-medium'],
  sbbiconticketheartsmall: ['kom:ticket-heart-small'],
  sbbiconticketjourneymedium: ['kom:ticket-journey-medium'],
  sbbiconticketjourneysmall: ['kom:ticket-journey-small'],
  sbbiconticketparkingmedium: ['kom:ticket-parking-medium'],
  sbbiconticketparkingsmall: ['kom:ticket-parking-small'],
  sbbiconticketpercentmedium: ['kom:ticket-percent-medium'],
  sbbiconticketpercentsmall: ['kom:ticket-percent-small'],
  sbbiconticketroutemedium: ['kom:ticket-route-medium'],
  sbbiconticketroutesmall: ['kom:ticket-route-small'],
  sbbiconticketstarmedium: ['kom:ticket-star-medium'],
  sbbiconticketstarsmall: ['kom:ticket-star-small'],
  sbbiconticketsclassmedium: ['kom:tickets-class-medium'],
  sbbiconticketsclasssmall: ['kom:tickets-class-small'],
  sbbiconarrowchangemedium: ['kom:arrow-change-medium'],
  sbbiconarrowchangesmall: ['kom:arrow-change-small'],
  sbbiconavatartrainstaffdisabledmedium: ['kom:avatar-train-staff-disabled-medium'],
  sbbiconavatartrainstaffdisabledsmall: ['kom:avatar-train-staff-disabled-small'],
  sbbiconavatartrainstaffmedium: ['kom:avatar-train-staff-medium'],
  sbbiconavatartrainstaffsmall: ['kom:avatar-train-staff-small'],
  sbbiconclockmedium: ['kom:clock-medium'],
  sbbiconclocksmall: ['kom:clock-small'],
  sbbiconhourglassmedium: ['kom:hourglass-medium'],
  sbbiconhourglasssmall: ['kom:hourglass-small'],
  sbbiconlocomotivemedium: ['kom:locomotive-medium'],
  sbbiconlocomotivesmall: ['kom:locomotive-small'],
  sbbiconpercentlarge: ['kom:percent-large'],
  sbbiconpercentmedium: ['kom:percent-medium'],
  sbbiconpercentsmall: ['kom:percent-small'],
  sbbiconpercenttagmedium: ['kom:percent-tag-medium'],
  sbbiconpercenttagsmall: ['kom:percent-tag-small'],
  sbbiconpunctualitymedium: ['kom:punctuality-medium'],
  sbbiconpunctualitysmall: ['kom:punctuality-small'],
  sbbiconroutecircleendmedium: ['kom:route-circle-end-medium'],
  sbbiconroutecircleendsmall: ['kom:route-circle-end-small'],
  sbbiconroutecirclestartmedium: ['kom:route-circle-start-medium'],
  sbbiconroutecirclestartsmall: ['kom:route-circle-start-small'],
  sbbiconseatwindowmedium: ['kom:seat-window-medium'],
  sbbiconseatwindowsmall: ['kom:seat-window-small'],
  sbbiconswitzerlandroutelarge: ['kom:switzerland-route-large'],
  sbbiconswitzerlandroutemedium: ['kom:switzerland-route-medium'],
  sbbiconswitzerlandroutesmall: ['kom:switzerland-route-small'],
  sbbicontimetablemedium: ['kom:timetable-medium'],
  sbbicontimetablesmall: ['kom:timetable-small'],
  sbbiconwalkfastmedium: ['kom:walk-fast-medium'],
  sbbiconwalkfastsmall: ['kom:walk-fast-small'],
  sbbiconwalkmedium: ['kom:walk-medium'],
  sbbiconwalkslowmedium: ['kom:walk-slow-medium'],
  sbbiconwalkslowsmall: ['kom:walk-slow-small'],
  sbbiconwalksmall: ['kom:walk-small'],
  sbbiconwheelchairinaccessiblemedium: ['kom:wheelchair-inaccessible-medium'],
  sbbiconwheelchairinaccessiblesmall: ['kom:wheelchair-inaccessible-small'],
  sbbiconwheelchairmedium: ['kom:wheelchair-medium'],
  sbbiconwheelchairpartiallymedium: ['kom:wheelchair-partially-medium'],
  sbbiconwheelchairpartiallysmall: ['kom:wheelchair-partially-small'],
  sbbiconwheelchairreservationmedium: ['kom:wheelchair-reservation-medium'],
  sbbiconwheelchairreservationsmall: ['kom:wheelchair-reservation-small'],
  sbbiconwheelchairsmall: ['kom:wheelchair-small'],
  sbbiconwheelchairuncertainmedium: ['kom:wheelchair-uncertain-medium'],
  sbbiconwheelchairuncertainsmall: ['kom:wheelchair-uncertain-small'],
  sbbiconairplanemedium: ['kom:airplane-medium'],
  sbbiconairplanesmall: ['kom:airplane-small'],
  sbbiconbicyclelarge: ['kom:bicycle-large'],
  sbbiconbicyclemedium: ['kom:bicycle-medium'],
  sbbiconbicyclesmall: ['kom:bicycle-small'],
  sbbiconbuscirclemedium: ['kom:bus-surrounding-area-medium'],
  sbbiconbuscirclesmall: ['kom:bus-surrounding-area-small'],
  sbbiconbusmedium: ['kom:bus-medium'],
  sbbiconbussbbmedium: ['kom:bus-sbb-medium'],
  sbbiconbussbbsmall: ['kom:bus-sbb-small'],
  sbbiconbussmall: ['kom:bus-small'],
  sbbiconbusstopmedium: ['kom:bus-stop-medium'],
  sbbiconbusstopsmall: ['kom:bus-stop-small'],
  sbbiconcarmedium: ['kom:car-medium'],
  sbbiconcarparkingmedium: ['kom:car-sign-parking-medium'],
  sbbiconcarparkingsmall: ['kom:car-sign-parking-small'],
  sbbiconcarsmall: ['kom:car-small'],
  sbbiconchargingstationmedium: ['kom:charging-station-medium'],
  sbbiconchargingstationsmall: ['kom:charging-station-small'],
  sbbiconcombinedmobilitymedium: ['kom:combined-mobility-medium'],
  sbbiconcombinedmobilitysmall: ['kom:combined-mobility-small'],
  sbbiconcontainermedium: ['kom:container-medium'],
  sbbiconcontainersmall: ['kom:container-small'],
  sbbicondriverlessbusmedium: ['kom:moving-bus-medium'],
  sbbicondriverlessbussmall: ['kom:moving-bus-small'],
  sbbiconfreightwagonmedium: ['kom:freight-wagon-medium'],
  sbbiconfreightwagonsmall: ['kom:freight-wagon-small'],
  sbbiconkrmedium: ['kom:k-r-medium'],
  sbbiconkrsmall: ['kom:k-r-small'],
  sbbiconparkandrailmedium: ['kom:park-and-rail-medium'],
  sbbiconparkandrailsmall: ['kom:park-and-rail-small'],
  sbbiconpetrolstationmedium: ['kom:petrol-station-medium'],
  sbbiconpetrolstationsmall: ['kom:petrol-station-small'],
  sbbiconshuttlemedium: ['kom:shuttle-medium'],
  sbbiconshuttlesmall: ['kom:shuttle-small'],
  sbbicontaximedium: ['kom:taxi-medium'],
  sbbicontaxismall: ['kom:taxi-small'],
  sbbicontrainlarge: ['kom:train-large'],
  sbbicontrainmedium: ['kom:train-medium'],
  sbbicontrainsmall: ['kom:train-small'],
  sbbicontrammedium: ['kom:tram-medium'],
  sbbicontramsmall: ['kom:tram-small'],
  sbbiconavatarpolicemedium: ['kom:avatar-police-medium'],
  sbbiconavatarpolicesmall: ['kom:avatar-police-small'],
  sbbiconemployeeslarge: ['kom:employees-sbb-large'],
  sbbiconkeymedium: ['kom:key-medium'],
  sbbiconkeysmall: ['kom:key-small'],
  sbbiconpiemedium: ['kom:pie-medium'],
  sbbiconpiesmall: ['kom:pie-small'],
  sbbicontwousersmedium: ['kom:two-users-medium'],
  sbbicontwouserssmall: ['kom:two-users-small'],
  sbbiconuserchangemedium: ['kom:user-change-medium'],
  sbbiconuserchangesmall: ['kom:user-change-small'],
  sbbiconusergrouplarge: ['kom:user-group-large'],
  sbbiconusergroupmedium: ['kom:user-group-medium'],
  sbbiconusergrouproundtablemedium: ['kom:user-group-round-table-medium'],
  sbbiconusergrouproundtablesmall: ['kom:user-group-round-table-small'],
  sbbiconusergrouprowmedium: ['kom:user-group-row-medium'],
  sbbiconusergrouprowsmall: ['kom:user-group-row-small'],
  sbbiconusergroupsmall: ['kom:user-group-small'],
  sbbiconuserhatmedium: ['kom:user-hat-medium'],
  sbbiconuserhatsmall: ['kom:user-hat-small'],
  sbbiconuserheadsetmedium: ['kom:user-headset-medium'],
  sbbiconuserheadsetsmall: ['kom:user-headset-small'],
  sbbiconuserkeymedium: ['kom:user-key-medium'],
  sbbiconuserkeysmall: ['kom:user-key-small'],
  sbbiconusermedium: ['kom:user-medium'],
  sbbiconuserplusmedium: ['kom:user-plus-medium'],
  sbbiconuserplussmall: ['kom:user-plus-small'],
  sbbiconusersmall: ['kom:user-small'],
  sbbiconusertiemedium: ['kom:user-tie-medium'],
  sbbiconusertiesmall: ['kom:user-tie-small'],
  sbbiconclouddensefogmedium: ['kom:cloud-dense-fog-medium'],
  sbbiconclouddensefogsmall: ['kom:cloud-dense-fog-small'],
  sbbiconclouddropsmedium: ['kom:cloud-drops-medium'],
  sbbiconclouddropsmoonmedium: ['kom:cloud-drops-moon-medium'],
  sbbiconclouddropsmoonsmall: ['kom:cloud-drops-moon-small'],
  sbbiconclouddropssmall: ['kom:cloud-drops-small'],
  sbbiconcloudfogmedium: ['kom:cloud-fog-medium'],
  sbbiconcloudfogsmall: ['kom:cloud-fog-small'],
  sbbiconcloudicemedium: ['kom:cloud-ice-medium'],
  sbbiconcloudicesmall: ['kom:cloud-ice-small'],
  sbbiconcloudlightningmedium: ['kom:cloud-lightning-medium'],
  sbbiconcloudlightningmoonmedium: ['kom:cloud-lightning-moon-medium'],
  sbbiconcloudlightningmoonsmall: ['kom:cloud-lightning-moon-small'],
  sbbiconcloudlightningsmall: ['kom:cloud-lightning-small'],
  sbbiconcloudlittlesnowmoonmedium: ['kom:cloud-little-snow-moon-medium'],
  sbbiconcloudlittlesnowmoonsmall: ['kom:cloud-little-snow-moon-small'],
  sbbiconcloudlittlesnowsunmedium: ['kom:cloud-little-snow-sun-medium'],
  sbbiconcloudlittlesnowsunsmall: ['kom:cloud-little-snow-sun-small'],
  sbbiconcloudmedium: ['kom:cloud-medium'],
  sbbiconcloudmoonmedium: ['kom:cloud-moon-medium'],
  sbbiconcloudmoonsmall: ['kom:cloud-moon-small'],
  sbbiconcloudrainmedium: ['kom:cloud-rain-medium'],
  sbbiconcloudrainsmall: ['kom:cloud-rain-small'],
  sbbiconcloudrainsnowmedium: ['kom:cloud-rain-snow-medium'],
  sbbiconcloudrainsnowmoonmedium: ['kom:cloud-rain-snow-moon-medium'],
  sbbiconcloudrainsnowmoonsmall: ['kom:cloud-rain-snow-moon-small'],
  sbbiconcloudrainsnowsmall: ['kom:cloud-rain-snow-small'],
  sbbiconcloudrainsnowsunmedium: ['kom:cloud-rain-snow-sun-medium'],
  sbbiconcloudrainsnowsunsmall: ['kom:cloud-rain-snow-sun-small'],
  sbbiconcloudrainsunmedium: ['kom:cloud-rain-sun-medium'],
  sbbiconcloudrainsunsmall: ['kom:cloud-rain-sun-small'],
  sbbiconcloudsmall: ['kom:cloud-small'],
  sbbiconcloudsnowlightningmedium: ['kom:cloud-snow-lightning-medium'],
  sbbiconcloudsnowlightningsmall: ['kom:cloud-snow-lightning-small'],
  sbbiconcloudsnowmedium: ['kom:cloud-snow-medium'],
  sbbiconcloudsnowmoonmedium: ['kom:cloud-snow-moon-medium'],
  sbbiconcloudsnowmoonsmall: ['kom:cloud-snow-moon-small'],
  sbbiconcloudsnowsmall: ['kom:cloud-snow-small'],
  sbbiconcloudsnowsunmedium: ['kom:cloud-snow-sun-medium'],
  sbbiconcloudsnowsunsmall: ['kom:cloud-snow-sun-small'],
  sbbiconcloudsnowflakemedium: ['kom:cloud-snowflake-medium'],
  sbbiconcloudsnowflakesmall: ['kom:cloud-snowflake-small'],
  sbbiconcloudsnowflakesunmedium: ['kom:cloud-snowflake-sun-medium'],
  sbbiconcloudsnowflakesunsmall: ['kom:cloud-snowflake-sun-small'],
  sbbiconcloudstrongrainmoonmedium: ['kom:cloud-strong-rain-moon-medium'],
  sbbiconcloudstrongrainmoonsmall: ['kom:cloud-strong-rain-moon-small'],
  sbbiconcloudstrongrainsunmedium: ['kom:cloud-strong-rain-sun-medium'],
  sbbiconcloudstrongrainsunsmall: ['kom:cloud-strong-rain-sun-small'],
  sbbiconcloudsunmedium: ['kom:cloud-sun-medium'],
  sbbiconcloudsunsmall: ['kom:cloud-sun-small'],
  sbbiconcloudsunshinemedium: ['kom:cloud-sunshine-medium'],
  sbbiconcloudsunshinesmall: ['kom:cloud-sunshine-small'],
  sbbiconfogmedium: ['kom:fog-medium'],
  sbbiconfogsmall: ['kom:fog-small'],
  sbbiconmoonmedium: ['kom:moon-medium'],
  sbbiconmoonsmall: ['kom:moon-small'],
  sbbiconsunmoonmedium: ['kom:sun-moon-medium'],
  sbbiconsunmoonsmall: ['kom:sun-moon-small'],
  sbbiconsunrisemedium: ['kom:sunrise-medium'],
  sbbiconsunrisesmall: ['kom:sunrise-small'],
  sbbiconsunshinemedium: ['kom:sunshine-medium'],
  sbbiconsunshinesmall: ['kom:sunshine-small'],
  sbbiconweatherunknownmedium: ['kom:weather-unknown-medium'],
  sbbiconweatherunknownsmall: ['kom:weather-unknown-small'],
};
