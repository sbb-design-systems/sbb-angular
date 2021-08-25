import { ComponentFactory, Injector, NgModuleFactory, Type, ɵNgModuleFactory } from '@angular/core';

// @ts-ignore example-module.ts is generated automatically by bazel
import { EXAMPLE_COMPONENTS, EXAMPLE_COMPONENTS_LOADER } from './example-module';

/** Asynchronously loads the specified example and returns its component factory. */
export function loadExampleFactory(
  name: string,
  injector: Injector
): Promise<ComponentFactory<any>> {
  const { componentName, module } = EXAMPLE_COMPONENTS[name];
  return loadModules(module.importSpecifier).then((moduleExports) => {
    const moduleFactory: NgModuleFactory<any> = new ɵNgModuleFactory(moduleExports[module.name]);
    const componentType: Type<any> = moduleExports[componentName];
    return moduleFactory
      .create(injector)
      .componentFactoryResolver.resolveComponentFactory(componentType);
  });
}

declare let require: Function;

function loadModules(importSpecifier: string): Promise<any> {
  // require and require.version are available in dev mode, which use require.js.
  // However, esbuild will bundle a wrapper for require, which will always throw.
  // In order to detect prod mode, we need to check whether require exists but does
  // not have the version property.
  if (typeof require === 'function' && (require as any).version) {
    return new Promise((resolve) =>
      require([`@sbb-esta/components-examples/${importSpecifier}`], resolve)
    );
  }

  return EXAMPLE_COMPONENTS_LOADER.get(importSpecifier)!();
}
