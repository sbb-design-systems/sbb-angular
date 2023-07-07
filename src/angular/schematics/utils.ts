import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import {
  Element,
  Migration,
  parse5,
  parseSourceFile,
  ResolvedResource,
} from '@angular/cdk/schematics';
import type { UpdateRecorder } from '@angular/cdk/schematics/update-tool/update-recorder';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';

import { Schema } from './ng-add/schema';

/** Whether the Angular module in the given path has the specified provider. */
export function hasNgModuleProvider(tree: Tree, modulePath: string, providerName: string): boolean {
  const moduleFileContent = tree.read(modulePath);

  if (!moduleFileContent) {
    throw new SchematicsException(`Could not read Angular module file: ${modulePath}`);
  }

  const parsedFile = ts.createSourceFile(
    modulePath,
    moduleFileContent.toString(),
    ts.ScriptTarget.Latest,
    true,
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

/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
export function addModuleImportToModule(
  host: Tree,
  modulePath: string,
  moduleName: string,
  src: string,
  recorder: UpdateRecorder,
) {
  const moduleSource = parseSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addImportToModule(moduleSource, modulePath, moduleName, src);

  changes.forEach((change) => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });
}

/**
 * Iterate over all nodes recursively and perform the given action.
 */
export function iterateNodes(
  contentOrRoot: string | Element,
  nodeAction: (node: Element) => void,
): void {
  const root =
    typeof contentOrRoot === 'string'
      ? parse5.parseFragment(contentOrRoot, {
          sourceCodeLocationInfo: true,
        })
      : contentOrRoot;

  const visitNodes = (nodes: any[]) => {
    nodes.forEach((node: Element) => {
      if (node.childNodes) {
        visitNodes(node.childNodes);
      }

      nodeAction(node);
    });
  };

  visitNodes(root.childNodes);
}

export interface NodeCheck {
  is(name: string): boolean;
  hasAttribute(...name: string[]): boolean;
}

export function nodeCheck(element: Element): NodeCheck {
  return {
    is(name: string) {
      return element.nodeName.toLowerCase() === name.toLowerCase();
    },
    hasAttribute(...name: string[]) {
      name = name.map((n) => n.toLowerCase());
      return (
        element.attrs && name.some((n) => element.attrs.some((a) => a.name.toLowerCase() === n))
      );
    },
  };
}

export function findReferenceAttribute(element: Element) {
  return element.attrs?.find((a) => a.name.toLowerCase().startsWith('#'));
}

export class MigrationRecorderRegistry {
  private _elements = new Map<ResolvedResource, Element[]>();

  get empty() {
    return this._elements.size === 0;
  }

  constructor(private _migration: Migration<any, any>) {}

  add(resource: ResolvedResource, element: Element) {
    if (!this._elements.has(resource)) {
      this._elements.set(resource, []);
    }

    this._elements.get(resource)!.push(element);
  }

  forEach(action: (changeSet: MigrationElement) => void) {
    this._elements.forEach((elements, resource) => {
      const recorder = this._migration.fileSystem.edit(resource.filePath);
      elements.forEach((e) => action(new MigrationElement(e, resource, recorder)));
    });
  }
}

export class MigrationElement {
  private _properties = new Map<string, MigrationElementProperty | undefined>();

  constructor(
    readonly element: Element,
    readonly resource: ResolvedResource,
    readonly recorder: UpdateRecorder,
    readonly location = element.sourceCodeLocation!,
  ) {}

  /** Checks whether this element matches the given tag name. */
  is(name: string) {
    return this.element.tagName.toUpperCase() === name.toUpperCase();
  }

  /** Remove this element. */
  remove() {
    this.recorder.remove(
      this.resource.start + this.location.startOffset,
      this.location.endOffset - this.location.startOffset,
    );
  }

  /** Remove all content of this element. */
  removeContent() {
    this.recorder.remove(
      this.resource.start + this.location.startTag!.endOffset,
      this.location.endTag!.startOffset - this.location.startTag!.endOffset,
    );
  }

  removeEndTag() {
    this.recorder.remove(
      this.resource.start + this.location.endTag!.startOffset,
      this.location.endTag!.endOffset - this.location.endTag!.startOffset,
    );
  }

  removeStartTag() {
    this.recorder.remove(
      this.resource.start + this.location.startTag!.startOffset,
      this.location.startTag!.endOffset - this.location.startTag!.startOffset,
    );
  }

  rename(tagName: string, attributeSelector?: string) {
    const startTagPosition = this.resource.start + this.location.startTag!.startOffset + 1;
    const tagLength = this.element.tagName.length;
    this.recorder.remove(startTagPosition, tagLength);
    this.recorder.insertRight(
      startTagPosition,
      attributeSelector ? `${tagName} ${attributeSelector}` : tagName,
    );

    const endTagPosition = this.resource.start + this.location.endTag!.startOffset + 2;
    this.recorder.remove(endTagPosition, tagLength);
    this.recorder.insertRight(endTagPosition, tagName);
  }

  /** Prepends the given content before this element. */
  prepend(content: string) {
    this.recorder.insertLeft(this.resource.start + this.location.startOffset, content);
  }

  /** Appends the given content behind this element. */
  append(content: string) {
    this.recorder.insertRight(this.resource.start + this.location.endOffset, content);
  }

  /** Insert the given content at the start of the element. */
  insertStart(content: string) {
    this.recorder.insertRight(this.resource.start + this.location.startTag!.endOffset, content);
  }

  /** Insert the given content at the end of the element. */
  insertBeforeEnd(content: string) {
    this.recorder.insertLeft(this.resource.start + this.location.endTag!.startOffset, content);
  }

  findElements(filter: (node: Element) => boolean) {
    const results: MigrationElement[] = [];
    iterateNodes(this.element, (node) => {
      if (filter(node)) {
        results.push(new MigrationElement(node, this.resource, this.recorder));
      }
    });
    return results;
  }

  properties() {
    return this.element.attrs.map(
      (a) => this._properties.get(a.name) ?? this._createMigrationElementProperty(a),
    );
  }

  /**
   * Looks for attribute (e.g. example="...") or property (e.g. [example]="...") assignments.
   */
  findProperty(name: string) {
    name = name.toLowerCase();
    const property = this._properties.get(name);
    if (property) {
      return property;
    }

    const attribute = this.element.attrs?.find((a) => {
      const lowerCaseName = a.name.toLowerCase();
      return (
        lowerCaseName === name ||
        lowerCaseName === `[${name}]` ||
        lowerCaseName === `(${name})` ||
        lowerCaseName === `[(${name})]`
      );
    });
    if (!attribute) {
      this._properties.set(name, undefined);
      return undefined;
    }
    return this._createMigrationElementProperty(attribute);
  }

  findPropertyByValue(value: string): MigrationElementProperty | undefined {
    const cachedProperty = Array.from(this._properties).find(
      ([_, propertyEntry]) => propertyEntry!.nativeValue === value,
    )?.[1];
    if (cachedProperty) {
      return cachedProperty;
    }

    const attribute = this.element.attrs.find((a) => a.value === value);
    if (!attribute) {
      return undefined;
    }
    return this._createMigrationElementProperty(attribute);
  }

  private _createMigrationElementProperty(attribute: parse5.Token.Attribute) {
    const location = this.location.attrs![attribute.name];
    let value: string | undefined;
    if (!attribute.name.startsWith('[')) {
      value = attribute.value;
    } else if (attribute.value.match(/^['"]([^'"]+)['"]$/)) {
      // e.g. [example]="'value'"
      value = attribute.value.substring(1, attribute.value.length - 1);
    }

    const property = new MigrationElementProperty(attribute, location, value, this);
    this._properties.set(property.attribute.name, property);
    return property;
  }

  appendProperty(name: string, value?: string) {
    const content = typeof value === 'string' ? ` ${name}="${value}"` : ` ${name}`;
    this.recorder.insertRight(this.resource.start + this.location.startTag!.endOffset - 1, content);
  }

  outerHtml() {
    return this.resource.content.slice(this.location.startOffset, this.location.endOffset);
  }

  innerHtml() {
    return this.resource.content.substring(
      this.location.startTag!.endOffset,
      this.location.endTag!.startOffset,
    );
  }

  toString() {
    return `<${this.element.tagName}>`;
  }
}

export class MigrationElementProperty {
  readonly name: string;

  get isProperty() {
    return this.name.startsWith('[');
  }

  get isAttribute() {
    return !this.isProperty;
  }

  get nativeValue() {
    return this.attribute.value;
  }

  constructor(
    readonly attribute: parse5.Token.Attribute,
    readonly location: parse5.Token.Location,
    readonly value: string | undefined,
    private _element: MigrationElement,
  ) {
    this.name = this._element.resource.content
      .substring(this.location.startOffset, this.location.endOffset)
      .split('=')[0];
  }

  /** Remove this attribute from the element. */
  remove() {
    this._element.recorder.remove(
      this._element.resource.start + this.location.startOffset - 1,
      this.location.endOffset - this.location.startOffset + 1,
    );
  }

  /** Replace this attribute with a new attribute. */
  replace(newAttribute: string) {
    this._element.recorder.remove(
      this._element.resource.start + this.location.startOffset,
      this.location.endOffset - this.location.startOffset,
    );
    this._element.recorder.insertRight(
      this._element.resource.start + this.location.startOffset,
      newAttribute,
    );
  }

  rename(newName: string) {
    newName = this.isProperty ? `[${newName}]` : newName;
    this._element.recorder.remove(
      this._element.resource.start + this.location.startOffset,
      this.name.length,
    );
    this._element.recorder.insertRight(
      this._element.resource.start + this.location.startOffset,
      newName,
    );
  }

  replaceValue(newValue: string) {
    this._element.recorder.remove(
      this._element.resource.start + this.location.startOffset + this.name.length,
      this.location.endOffset - this.location.startOffset - this.name.length,
    );

    this._element.recorder.insertRight(
      this._element.resource.start + this.location.startOffset + this.name.length,
      `="${newValue}"`,
    );
  }

  appendValue(value: string) {
    this._element.recorder.insertRight(
      this._element.resource.start + this.location.endOffset - 1,
      value,
    );
  }

  toTextNode() {
    return this.isProperty ? `{{ ${this.nativeValue} }}` : this.nativeValue;
  }

  toString() {
    return this._element.resource.content.slice(this.location.startOffset, this.location.endOffset);
  }
}

export function getProjectName(options: Schema, workspace: WorkspaceDefinition) {
  return (
    options.project ||
    (workspace.extensions.defaultProject as string) ||
    Array.from(workspace.projects.keys())[0]
  );
}
