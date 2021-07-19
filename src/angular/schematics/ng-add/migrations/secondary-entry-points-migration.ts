import { DevkitContext, Migration, TargetVersion } from '@angular/cdk/schematics';
import * as ts from 'typescript';

import { classNames } from '../data';
import { sbbAngularModuleSpecifiers } from '../typescript/module-specifiers';

const ONLY_SUBPACKAGE_FAILURE_STR =
  `Importing from "@sbb-esta/angular-business", "@sbb-esta/angular-public", "@sbb-esta/angular-core" and "@sbb-esta/angular-maps" is deprecated. ` +
  `Instead import from the entry-point the symbol belongs to.`;

const NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR =
  `Imports from SBB Angular should import ` +
  `specific symbols rather than importing the entire library.`;

/**
 * Regex for testing file paths against to determine if the file is from the
 * SBB Angular library.
 */
const ANGULAR_FILEPATH_REGEX = new RegExp(`(${sbbAngularModuleSpecifiers.join('|')})/(.*?)/`);

/**
 * Mapping of SBB angular symbol names to their module names. Used as a fallback if
 * we didn't manage to resolve the module name of a symbol using the type checker.
 */
const ENTRY_POINT_MAPPINGS: { [name: string]: string } = require('./sbb-angular-symbols.json');

/**
 * Mapping of the class name rename migrations.
 */
const CLASS_NAME_RENAMES = classNames['merge' as TargetVersion]!.reduce(
  (renames, entry) =>
    entry.changes.reduce((current, next) => current.set(next.replace, next.replaceWith), renames),
  new Map<string, string>()
);

/**
 * Migration that updates imports which refer to the primary Angular SBB Angular
 * entry-point to use the appropriate secondary entry points (e.g. @sbb-esta/angular-business/button).
 */
export class SecondaryEntryPointsMigration extends Migration<null, DevkitContext> {
  printer = ts.createPrinter();

  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  visitNode(declaration: ts.Node): void {
    // Only look at import declarations.
    if (
      !ts.isImportDeclaration(declaration) ||
      !ts.isStringLiteralLike(declaration.moduleSpecifier)
    ) {
      return;
    }
    const importLocation = declaration.moduleSpecifier.text;
    // If the import module is not in an SBB angular module specifier, skip the check.
    if (
      sbbAngularModuleSpecifiers.every(
        (moduleSpecifier) => !importLocation.startsWith(moduleSpecifier)
      )
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

    // Map which consists of secondary entry-points and import specifiers which are used
    // within the current import declaration.
    const importMap = new Map<string, ts.ImportSpecifier[]>();

    const destinationPackageName = declaration.moduleSpecifier
      .getText()
      .slice(1) // remove quote for comparison
      .startsWith('@sbb-esta/angular-maps')
      ? 'angular-maps'
      : 'angular';

    // Determine the subpackage each symbol in the namedBinding comes from.
    for (const element of declaration.importClause.namedBindings.elements) {
      const elementName = element.propertyName ? element.propertyName : element.name;

      // Try to resolve the module name via the type checker, and if it fails, fall back to
      // resolving it from our list of symbol to entry point mappings. Using the type checker is
      // more accurate and doesn't require us to keep a list of symbols, but it won't work if
      // the symbols don't exist anymore (e.g. after we remove the top-level package).
      const moduleName =
        resolveModuleName(elementName, this.typeChecker) ||
        ENTRY_POINT_MAPPINGS[elementName.text] ||
        null;

      if (!moduleName) {
        this.createFailureAtNode(
          element,
          `"${element.getText()}" was not found in the @sbb-esta/angular library.`
        );
        return;
      }

      // The module name where the symbol is defined e.g. card, dialog. The
      // first capture group is contains the module name.
      if (importMap.has(moduleName)) {
        importMap.get(moduleName)!.push(element);
      } else {
        importMap.set(moduleName, [element]);
      }
    }

    // Transforms the import declaration into multiple import declarations that import
    // the given symbols from the individual secondary entry-points. For example:
    // import {SbbUsermenuModule, SbbUsermenu} from '@sbb-esta/angular-business/usermenu';
    // import {SbbLoadingModule} from '@sbb-esta/angular-business/loading';
    const newImportStatements = Array.from(importMap.entries())
      .sort()
      .map(([name, elements]) => {
        const newImport = ts.createImportDeclaration(
          undefined,
          undefined,
          ts.createImportClause(undefined, ts.createNamedImports(applyRenames(elements))),
          createStringLiteral(`@sbb-esta/${destinationPackageName}/${name}`, singleQuoteImport)
        );
        return this.printer.printNode(
          ts.EmitHint.Unspecified,
          newImport,
          declaration.getSourceFile()
        );
      })
      .join('\n');

    // Without any import statements that were generated, we can assume that this was an empty
    // import declaration. We still want to add a failure in order to make developers aware that
    // importing from top level package is deprecated.
    if (!newImportStatements) {
      this.createFailureAtNode(declaration.moduleSpecifier, ONLY_SUBPACKAGE_FAILURE_STR);
      return;
    }

    const filePath = this.fileSystem.resolve(declaration.moduleSpecifier.getSourceFile().fileName);
    const recorder = this.fileSystem.edit(filePath);

    // Perform the replacement that switches the primary entry-point import to
    // the individual secondary entry-point imports.
    recorder.remove(declaration.getStart(), declaration.getWidth());
    recorder.insertRight(declaration.getStart(), newImportStatements);
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
  return matches ? matches[1] : null;
}

/** Applies the renames from the class migration to the given elements. */
function applyRenames(elements: ts.ImportSpecifier[]) {
  return (
    elements
      .map((element) => {
        const elementName = element.propertyName ? element.propertyName : element.name;
        if (!CLASS_NAME_RENAMES.has(elementName.text)) {
          return element;
        }

        const nameIdentifier = ts.createIdentifier(CLASS_NAME_RENAMES.get(elementName.text)!);
        return element.propertyName
          ? ts.createImportSpecifier(nameIdentifier, element.name)
          : ts.createImportSpecifier(undefined, nameIdentifier);
      })
      // If the import name occurs multiple times, filter out the duplicates.
      // (e.g. both SbbLinksModule and SbbButtonModule will be SbbButtonModule,
      // so the second import should be removed)
      .filter(
        (e, i, a) =>
          e.propertyName || a.findIndex((v) => !v.propertyName && v.name.text === e.name.text) === i
      )
  );
}
