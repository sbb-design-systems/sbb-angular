import { ComponentFactory, Injector, NgModuleFactory, Type } from '@angular/core';

// @ts-ignore example-module.ts is generated automatically by bazel
import { EXAMPLE_COMPONENTS } from './example-module';

/** Asynchronously loads the specified example and returns its component factory. */
export function loadExampleFactory(
  name: string,
  injector: Injector
): Promise<ComponentFactory<any>> {
  const { componentName, module } = EXAMPLE_COMPONENTS[name];
  const importParts = module.importSpecifier.split('/');
  if (importParts.length !== 2) {
    throw new Error(
      `Expected importSpecifier to contain two parts, but received ${importParts}. ` +
        'Adapt load-example.ts, if that is no longer the case.'
    );
  }
  const [packageName, moduleName] = importParts;
  // TODO(devversion): remove the NgFactory import when the `--config=view-engine` switch is gone.
  return loadModules(packageName, moduleName).then(([moduleFactoryExports, moduleExports]) => {
    const moduleFactory: NgModuleFactory<any> = moduleFactoryExports[`${module.name}NgFactory`];
    const componentType: Type<any> = moduleExports[componentName];
    return moduleFactory
      .create(injector)
      .componentFactoryResolver.resolveComponentFactory(componentType);
  });
}

declare let require: Function;

function loadModules(packageName: string, moduleName: string): Promise<[any, any]> {
  if (typeof require === 'function') {
    return new Promise((resolve) => {
      require([
        `@sbb-esta/components-examples/${packageName}/${moduleName}/index.ngfactory`,
        `@sbb-esta/components-examples/${packageName}/${moduleName}`,
      ], (...dependencies: [any, any]) => {
        resolve(dependencies);
      });
    });
  } else {
    return Promise.all([
      import(`./${packageName}/${moduleName}/index.ngfactory.mjs`),
      import(`./${packageName}/${moduleName}/index.mjs`),
    ]);
  }
}
