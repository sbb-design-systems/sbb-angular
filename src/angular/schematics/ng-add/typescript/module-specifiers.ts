import { getImportDeclaration } from '@angular/cdk/schematics';
import * as ts from 'typescript';

/** Name of the sbb-angular module specifiers. */
export const sbbAngularModuleSpecifiers = [
  '@sbb-esta/angular-business',
  '@sbb-esta/angular-public',
  '@sbb-esta/angular-core',
  '@sbb-esta/angular-maps',
];

/** Whether the specified node is part of an SBB Angular or CDK import declaration. */
export function isSbbAngularImportDeclaration(node: ts.Node) {
  return isSbbAngularDeclaration(getSafeImportDeclaration(node));
}

/** Whether the specified node is part of an SBB Angular or CDK import declaration. */
export function isSbbAngularExportDeclaration(node: ts.Node) {
  return isSbbAngularDeclaration(getSafeImportDeclaration(node));
}

function getSafeImportDeclaration(node: ts.Node) {
  try {
    return getImportDeclaration(node);
  } catch {
    return {} as ts.ImportDeclaration;
  }
}

/** Whether the declaration is part of SBB Angular. */
function isSbbAngularDeclaration(declaration: ts.ImportDeclaration | ts.ExportDeclaration) {
  if (!declaration.moduleSpecifier) {
    return false;
  }

  const moduleSpecifier = declaration.moduleSpecifier.getText();
  return sbbAngularModuleSpecifiers.some((s) => moduleSpecifier.indexOf(s) !== -1);
}
