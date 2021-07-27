import { DevkitContext, Migration } from '@angular/cdk/schematics';
import * as ts from 'typescript';

/** Migration that removes duplicates from decorator declarations (e.g. NgModule). */
export class DuplicateMigration extends Migration<null, DevkitContext> {
  enabled: boolean = true;

  visitNode(node: ts.Node) {
    if (ts.isClassDeclaration(node) && node.decorators?.length) {
      for (const decorator of node.decorators) {
        if (
          ts.isCallExpression(decorator.expression) &&
          decorator.expression.expression.getText() === 'NgModule' &&
          decorator.expression.arguments.length === 1 &&
          ts.isObjectLiteralExpression(decorator.expression.arguments[0])
        ) {
          this._checkDecoratorContent(decorator.expression.arguments[0]);
        }
      }
    }
  }

  private _checkDecoratorContent(node: ts.ObjectLiteralExpression) {
    const filePath = this.fileSystem.resolve(node.getSourceFile().fileName);
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property) && ts.isArrayLiteralExpression(property.initializer)) {
        const duplicates = Array.from(property.initializer.elements).filter(
          (v, i, a) => a.findIndex((iv) => iv.getText() === v.getText()) !== i
        );
        if (!duplicates.length) {
          continue;
        }

        const recorder = this.fileSystem.edit(filePath);
        for (const duplicate of duplicates) {
          const index = property.initializer.elements.indexOf(duplicate);
          // index cannot be 0, because in order for a duplicate to exists, it must have a previous entry.
          const previous = property.initializer.elements[index - 1];
          const start = previous.getStart() + previous.getWidth();
          recorder.remove(start, duplicate.getStart() + duplicate.getWidth() - start);
        }
      }
    }
  }
}
