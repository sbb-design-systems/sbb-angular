import { SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';
import * as ts from 'typescript';

/** Gets the version of the specified package by looking at the package.json in the given tree. */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  const dependency = getPackageJsonDependency(tree, name);

  if (!dependency) {
    return null;
  }

  return dependency.version;
}

/** Assert that file exists and parse json file to object */
export function readJsonFile(tree: Tree, path: string) {
  if (!tree.exists(path)) {
    throw new SchematicsException(path + ' not found');
  }
  return JSON.parse(tree.read(path)!.toString('utf-8'));
}

/** Assert that file exists and parse string file */
export function readStringFile(tree: Tree, path: string) {
  if (!tree.exists(path)) {
    throw new SchematicsException(path + ' not found');
  }
  return tree.read(path)!.toString('utf-8');
}

/** Adds a default dependency to package.json */
export function addDefaultDependency(
  name: string,
  version: string,
  host: Tree,
  context?: SchematicContext
): Tree {
  const nodeDependency: NodeDependency = {
    type: NodeDependencyType.Default,
    name: name,
    version: version,
    overwrite: false,
  };
  addPackageJsonDependency(host, nodeDependency);
  if (context) {
    context.logger.info(`✔️ Added ${name} dependency`);
  }
  return host;
}

/**
 * Whether the Angular module in the given path has the specified provider.
 */
export function hasNgModuleProvider(tree: Tree, modulePath: string, providerName: string): boolean {
  const moduleFileContent = tree.read(modulePath);

  if (!moduleFileContent) {
    throw new SchematicsException(`Could not read Angular module file: ${modulePath}`);
  }

  const parsedFile = ts.createSourceFile(
    modulePath,
    moduleFileContent.toString(),
    ts.ScriptTarget.Latest,
    true
  );
  const ngModuleMetadata = findNgModuleMetadata(parsedFile);

  if (!ngModuleMetadata) {
    throw new SchematicsException(`Could not find NgModule declaration inside: "${modulePath}"`);
  }

  for (const property of ngModuleMetadata!.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      property.name.getText() !== 'providers' ||
      !ts.isArrayLiteralExpression(property.initializer)
    ) {
      continue;
    }

    if (property.initializer.elements.some((element) => element.getText() === providerName)) {
      return true;
    }
  }

  return false;
}

/**
 * Finds a NgModule declaration within the specified TypeScript node and returns the
 * corresponding metadata for it. This function searches breadth first because
 * NgModule's are usually not nested within other expressions or declarations.
 */
function findNgModuleMetadata(rootNode: ts.Node): ts.ObjectLiteralExpression | null {
  // Add immediate child nodes of the root node to the queue.
  const nodeQueue: ts.Node[] = [...rootNode.getChildren()];

  while (nodeQueue.length) {
    const node = nodeQueue.shift()!;

    if (
      ts.isDecorator(node) &&
      ts.isCallExpression(node.expression) &&
      isNgModuleCallExpression(node.expression)
    ) {
      return node.expression.arguments[0] as ts.ObjectLiteralExpression;
    } else {
      nodeQueue.push(...node.getChildren());
    }
  }

  return null;
}

/** Whether the specified call expression is referring to a NgModule definition. */
function isNgModuleCallExpression(callExpression: ts.CallExpression): boolean {
  if (
    !callExpression.arguments.length ||
    !ts.isObjectLiteralExpression(callExpression.arguments[0])
  ) {
    return false;
  }

  // The `NgModule` call expression name is never referring to a `PrivateIdentifier`.
  const decoratorIdentifier = resolveIdentifierOfExpression(callExpression.expression);
  return decoratorIdentifier ? decoratorIdentifier.text === 'NgModule' : false;
}

/**
 * Resolves the last identifier that is part of the given expression. This helps resolving
 * identifiers of nested property access expressions (e.g. myNamespace.core.NgModule).
 */
function resolveIdentifierOfExpression(expression: ts.Expression): ts.Identifier | null {
  if (ts.isIdentifier(expression)) {
    return expression;
  } else if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)) {
    return expression.name;
  }
  return null;
}
