import * as Lint from 'tslint';
import ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
  }
}

class Walker extends Lint.RuleWalker {
  private _arrowMappings = new Map<string, string>().set('() => {}', '() => void');

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
  }

  visitClassDeclaration(node: ts.ClassDeclaration) {
    const fileName = node.getSourceFile().fileName;
    if (
      fileName.includes('/src/') &&
      !fileName.includes('/components-examples/') &&
      !fileName.includes('/migrations/') &&
      !fileName.endsWith('spec.ts')
    ) {
      node.members.forEach((member) => {
        // Members without a modifier are considered public.
        if (
          ts.isPropertyDeclaration(member) &&
          (!member.modifiers ||
            this._hasModifier(member, ts.SyntaxKind.PublicKeyword) ||
            this._hasModifier(member, ts.SyntaxKind.ProtectedKeyword))
        ) {
          this._validateProperty(member);
        }
      });
    }

    super.visitClassDeclaration(node);
  }

  /**
   * Validates that a node matches the pattern for the corresponding modifier.
   * @param node Node to be validated.
   */
  private _validateProperty(node: ts.PropertyDeclaration) {
    if (!node.type && !this._isArrowMethod(node)) {
      const end = node.questionToken ? node.questionToken.end : node.name.end;
      const type = this._detectType(node);
      const fix = type ? Lint.Replacement.appendText(end, `: ${type}`) : undefined;

      this.addFailureAtNode(
        node.name,
        'Explicit Typedef (e.g. disabled: boolean = false) is required!',
        fix,
      );
    }
  }

  private _isArrowMethod(node: ts.PropertyDeclaration) {
    return (
      node.initializer &&
      ts.isArrowFunction(node.initializer) &&
      !this._arrowMappings.has(node.initializer.getText())
    );
  }

  private _detectType(node: ts.PropertyDeclaration) {
    if (!node.initializer) {
      return undefined;
    } else if (
      [ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.TrueKeyword].includes(node.initializer.kind)
    ) {
      return 'boolean';
    } else if (
      [
        ts.SyntaxKind.StringLiteral,
        ts.SyntaxKind.NoSubstitutionTemplateLiteral,
        ts.SyntaxKind.TemplateExpression,
      ].includes(node.initializer.kind)
    ) {
      return 'string';
    } else if (ts.isNumericLiteral(node.initializer)) {
      return 'number';
    } else if (ts.isNewExpression(node.initializer)) {
      const className = node.initializer.expression.getText();
      return node.initializer.typeArguments
        ? `${className}<${node.initializer.typeArguments.map((a) => a.getText()).join(', ')}>`
        : className;
    } else if (
      ts.isArrowFunction(node.initializer) &&
      this._arrowMappings.has(node.initializer.getText())
    ) {
      return this._arrowMappings.get(node.initializer.getText())!;
    }

    return undefined;
  }

  /** Checks if a node has a specific modifier. */
  private _hasModifier(
    node: ts.ClassElement | ts.ParameterDeclaration,
    targetKind: ts.SyntaxKind,
  ): boolean {
    return ts.canHaveModifiers(node) && !!node.modifiers?.some(({ kind }) => kind === targetKind);
  }
}
