import { DevkitContext, Migration, TargetVersion } from '@angular/cdk/schematics';
import { EOL } from 'os';
import * as ts from 'typescript';

import { classNames } from '../data';

const NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR =
  `Imports from SBB Angular should import ` +
  `specific symbols rather than importing the entire library.`;

/**
 *  Import path of the SBB Angular library
 */
const ANGULAR_FILEPATH = '@sbb-esta/angular';

/**
 * Regex for testing file paths against to determine if the file is from the
 * SBB Angular library.
 */
const ANGULAR_FILEPATH_REGEX = new RegExp(`(${ANGULAR_FILEPATH})/(.*?)`);

// Map of all moved symbols
const ENTRY_POINT_MAPPINGS = new Map(
  Object.entries({
    [TargetVersion.V19]: {},
  }),
);

interface SecondaryEntryPointContext {
  importMap: Map<string, ts.ImportSpecifier[]>;
  declarations: ts.ImportDeclaration[];
  singleQuoteImport: boolean;
}

/**
 * Migration that updates imports which refer to the primary SBB Angular
 * entry-point to use the appropriate secondary entry points
 * (e.g. @sbb-esta/angular/loading-indicator).
 */
export class SecondaryEntryPointsMigration extends Migration<null, DevkitContext> {
  printer = ts.createPrinter();

  enabled: boolean = !!this.targetVersion && ENTRY_POINT_MAPPINGS.has(this.targetVersion);

  private _entryPointMappings = {
    ...require('./sbb-angular-symbols.json'),
    ...ENTRY_POINT_MAPPINGS.get(this.targetVersion || ''),
  };

  private _fileImportMap = new Map<ts.SourceFile, SecondaryEntryPointContext>();

  private _classNameRenames = classNames[this.targetVersion || '']?.reduce(
    (renames, entry) =>
      entry.changes.reduce((current, next) => current.set(next.replace, next.replaceWith), renames),
    new Map<string, string>(),
  );

  visitNode(declaration: ts.Node): void {
    // Only look at import declarations.
    if (
      !ts.isImportDeclaration(declaration) ||
      !ts.isStringLiteralLike(declaration.moduleSpecifier)
    ) {
      return;
    }
    const importLocation = declaration.moduleSpecifier.text;
    // If the import module is not in an SBB angular module or an i18n import specifier, skip the check.
    if (
      !ANGULAR_FILEPATH_REGEX.test(importLocation) ||
      importLocation === '@sbb-esta/angular/i18n'
    ) {
      return;
    }

    // If no import clause is found, or nothing is named as a binding in the
    // import, add failure saying to import symbols in clause.
    if (!declaration.importClause || !declaration.importClause.namedBindings) {
      this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
      return;
    }

    // All named bindings in import clauses must be named symbols, otherwise add
    // failure saying to import symbols in clause.
    if (!ts.isNamedImports(declaration.importClause.namedBindings)) {
      this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
      return;
    }

    // If no symbols are in the named bindings then add failure saying to
    // import symbols in clause.
    if (!declaration.importClause.namedBindings.elements.length) {
      this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
      return;
    }

    // Whether the existing import declaration is using a single quote module specifier.
    const singleQuoteImport = declaration.moduleSpecifier.getText()[0] === `'`;

    let context = this._fileImportMap.get(declaration.getSourceFile());

    if (!context) {
      context = {
        importMap: new Map<string, ts.ImportSpecifier[]>(),
        declarations: [declaration],
        singleQuoteImport,
      };
      this._fileImportMap.set(declaration.getSourceFile(), context);
    } else {
      context.declarations.push(declaration);
    }

    // Map which consists of secondary entry-points and import specifiers which are used
    // within the current import declaration.
    const importMap = context.importMap;

    // Determine the subpackage each symbol in the namedBinding comes from.
    for (const element of declaration.importClause.namedBindings.elements) {
      let elementName = element.propertyName ? element.propertyName : element.name;
      if (this._classNameRenames?.has(elementName.text)) {
        elementName = ts.factory.createIdentifier(this._classNameRenames.get(elementName.text)!);
      }

      // Try to resolve the module name via our list of symbol to entry point mappings, and, if it fails, fall back to
      // resolving it from the type checker. Using the type checker is
      // more accurate and doesn't require us to keep a list of symbols, but it won't work if
      // the symbols don't exist anymore (e.g. after we remove the top-level package).
      const moduleName =
        this._entryPointMappings?.[elementName.text] ||
        resolveModuleName(elementName, this.typeChecker) ||
        null;

      if (!moduleName) {
        this.createFailureAtNode(
          element,
          `"${element.getText()}" was not found in the @sbb-esta/angular library.`,
        );
        return;
      }

      // The module name where the symbol is defined e.g. card, dialog. The
      // first capture group is contains the module name.
      const fullModuleName = moduleName.startsWith('@')
        ? moduleName
        : `${ANGULAR_FILEPATH}/${moduleName}`;
      if (importMap.has(fullModuleName)) {
        importMap.get(fullModuleName)!.push(element);
      } else {
        importMap.set(fullModuleName, [element]);
      }
    }
  }

  postAnalysis() {
    this._fileImportMap.forEach(({ declarations, importMap, singleQuoteImport }, file) => {
      // Transforms the import declaration into multiple import declarations that import
      // the given symbols from the individual secondary entry-points. For example:
      // import {SbbUsermenuModule, SbbUsermenu} from '@sbb-esta/angular-business/usermenu';
      // import {SbbLoadingModule} from '@sbb-esta/angular-business/loading';
      const newImportStatements = Array.from(importMap.entries())
        .sort()
        .map(([name, elements]) => {
          const newImport = ts.factory.createImportDeclaration(
            undefined,
            ts.factory.createImportClause(
              false,
              undefined,
              ts.factory.createNamedImports(this._applyRenames(elements)),
            ),
            ts.factory.createStringLiteral(name, singleQuoteImport),
          );
          return this.printer.printNode(ts.EmitHint.Unspecified, newImport, file);
        })
        .join('\n');

      const filePath = this.fileSystem.resolve(file.fileName);
      const recorder = this.fileSystem.edit(filePath);

      // Perform the replacement that switches the primary entry-point import to
      // the individual secondary entry-point imports.
      declarations.forEach((d) => {
        const match = file
          .getFullText()
          .substring(d.getStart() + d.getWidth())
          .match(/^(\r\n|\n\r|\n)/);
        recorder.remove(d.getStart(), d.getWidth() + (match ? match[0].length : 0));
      });
      recorder.insertRight(declarations[0].getStart(), newImportStatements + EOL);
    });
  }

  /** Applies the renames from the class migration to the given elements. */
  private _applyRenames(elements: ts.ImportSpecifier[]) {
    return (
      elements
        .map((element) => {
          const elementName = element.propertyName ? element.propertyName : element.name;
          if (!this._classNameRenames?.has(elementName.text)) {
            return element;
          }

          const nameIdentifier = ts.factory.createIdentifier(
            this._classNameRenames.get(elementName.text)!,
          );
          return element.propertyName
            ? ts.factory.createImportSpecifier(false, nameIdentifier, element.name)
            : ts.factory.createImportSpecifier(false, undefined, nameIdentifier);
        })
        // If the import name occurs multiple times, filter out the duplicates.
        // (e.g. both SbbLinksModule and SbbButtonModule will be SbbButtonModule,
        // so the second import should be removed)
        .filter(
          (e, i, a) =>
            e.propertyName ||
            a.findIndex((v) => !v.propertyName && v.name.text === e.name.text) === i,
        )
    );
  }
}

/** Gets the symbol that contains the value declaration of the given node. */
function getDeclarationSymbolOfNode(node: ts.Node, checker: ts.TypeChecker): ts.Symbol | undefined {
  const symbol = checker.getSymbolAtLocation(node);

  // Symbols can be aliases of the declaration symbol. e.g. in named import specifiers.
  // We need to resolve the aliased symbol back to the declaration symbol.
  // tslint:disable-next-line:no-bitwise
  if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
    return checker.getAliasedSymbol(symbol);
  }
  return symbol;
}

/** Tries to resolve the name of the SBB Angular module that a node is imported from. */
function resolveModuleName(node: ts.Identifier, typeChecker: ts.TypeChecker) {
  // Get the symbol for the named binding element. Note that we cannot determine the
  // value declaration based on the type of the element as types are not necessarily
  // specific to a given secondary entry-point (e.g. exports with the type of "string")
  // would resolve to the module types provided by TypeScript itself.
  const symbol = getDeclarationSymbolOfNode(node, typeChecker);

  // If the symbol can't be found, or no declaration could be found within
  // the symbol, add failure to report that the given symbol can't be found.
  if (
    !symbol ||
    !(symbol.valueDeclaration || (symbol.declarations && symbol.declarations.length !== 0))
  ) {
    return null;
  }

  // The filename for the source file of the node that contains the
  // first declaration of the symbol. All symbol declarations must be
  // part of a defining node, so parent can be asserted to be defined.
  const resolvedNode = symbol.valueDeclaration || symbol.declarations?.[0];

  if (resolvedNode === undefined) {
    return null;
  }

  const sourceFile = resolvedNode.getSourceFile().fileName;

  // File the module the symbol belongs to from a regex match of the
  // filename. This will always match since only SBB Angular elements are analyzed.
  const matches = sourceFile.match(ANGULAR_FILEPATH_REGEX);
  return matches ? matches[2] : null;
}
