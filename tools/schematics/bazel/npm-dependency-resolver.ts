import { SchematicsException } from '@angular-devkit/schematics';

export class NpmDependencyResolver {
  private _dependencies: string[];
  private _typesDependencies: Map<string, string>;

  constructor(packageJson: string) {
    const pkg = JSON.parse(packageJson);
    const dependencies = 'dependencies' in pkg ? Object.keys(pkg.dependencies) : [];
    const devDependencies = 'devDependencies' in pkg ? Object.keys(pkg.devDependencies) : [];
    this._dependencies = dependencies.concat(devDependencies);
    this._typesDependencies = this._dependencies
      .filter((d) => d.startsWith('@types/'))
      .reduce((map, dep) => map.set(this._typesToPackageName(dep), dep), new Map<string, string>());
  }

  resolvePackageNames(importPath: string) {
    const name = this._toPackageName(importPath);
    if (this._typesDependencies.has(name) && this._dependencies.includes(name)) {
      return [name, this._typesDependencies.get(name)!];
    } else if (this._typesDependencies.has(name)) {
      return [this._typesDependencies.get(name)!];
    } else if (this._dependencies.includes(name)) {
      return [name];
    } else {
      throw new SchematicsException(`The dependency ${name} is not defined in the package.json`);
    }
  }

  toBazelNodeDependency(importPath: string) {
    return `@npm//${this._toPackageName(importPath)}`;
  }

  private _typesToPackageName(name: string) {
    return name.replace(/^@types\//, '').replace(/^(.+)__(.+)$/, (_m, m1, m2) => `@${m1}/${m2}`);
  }

  private _toPackageName(importPath: string) {
    const index = importPath.startsWith('@') ? 2 : 1;
    return importPath.split('/', index).join('/');
  }
}
