import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function updateToV9(): Rule {
  return (host: Tree, _context: SchematicContext) => {
    return host;
  };
}
