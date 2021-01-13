import { ComponentFactory, Injector, NgModuleFactory, Type } from '@angular/core';

// @ts-ignore example-module.ts is generated automatically by bazel
import { EXAMPLE_COMPONENTS } from './example-module';

/** Asynchronously loads the specified example and returns its component factory. */
export async function loadExampleFactory(
  name: string,
  injector: Injector
): Promise<ComponentFactory<any>> {
  const { componentName, module } = EXAMPLE_COMPONENTS[name];
  const importSpecifier = `@sbb-esta/components-examples/${module.importSpecifier}`;
  // TODO(devversion): remove the NgFactory import when the `--config=view-engine` switch is gone.
  const [moduleFactoryExports, moduleExports] = await Promise.all([
    import(importSpecifier + '/index.ngfactory'),
    import(importSpecifier),
  ]);
  const moduleFactory: NgModuleFactory<any> = moduleFactoryExports[`${module.name}NgFactory`];
  const componentType: Type<any> = moduleExports[componentName];
  return moduleFactory
    .create(injector)
    .componentFactoryResolver.resolveComponentFactory(componentType);
}
