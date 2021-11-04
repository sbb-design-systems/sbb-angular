import { createNgModuleRef, Injector, Type } from '@angular/core';

// @ts-ignore example-module.ts is generated automatically by bazel
import { EXAMPLE_COMPONENTS, EXAMPLE_COMPONENTS_LOADER } from './example-module';

/**
 * Asynchronously loads the specified example and returns its component and
 * an injector instantiated from the containing example module.
 *
 * This is used in the `dev-app` and `e2e-app` and assumes ESBuild having created
 * entry-points for the example modules under the `<host>/bundles/` URL.
 */
export async function loadExample(
  name: string,
  injector: Injector
): Promise<{ component: Type<any>; injector: Injector }> {
  const { componentName, module } = EXAMPLE_COMPONENTS[name];
  const moduleExports = await EXAMPLE_COMPONENTS_LOADER.get(module.importSpecifier)!();
  const moduleType: Type<any> = moduleExports[module.name];
  const componentType: Type<any> = moduleExports[componentName];
  const moduleRef = createNgModuleRef(moduleType, injector);

  return {
    component: componentType,
    injector: moduleRef.injector,
  };
}
