import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  addSymbolToNgModuleMetadata,
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
  parseSourceFile,
} from '@angular/cdk/schematics';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/config';

import { hasNgModuleProvider } from '../utils';

import { Schema } from './schema';

/** Name of the icon cdn registry that enables the sbb-icon. */
export const ICON_CDN_REGISTRY_NAME = 'SBB_ICON_REGISTRY_PROVIDER';

export function ngAdd(options: Schema): Rule {
  return (_host: Tree, _context: SchematicContext) => {
    return addIconCdnProvider(options);
  };
}

/** Adds the icon cdn registry to the AppModule providers. */
export function addIconCdnProvider(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.name);
    const appModulePath = getAppModulePath(host, getProjectMainFile(project));
    if (hasNgModuleProvider(host, appModulePath, ICON_CDN_REGISTRY_NAME)) {
      context.logger.info(`${ICON_CDN_REGISTRY_NAME} already imported. Skipping...`);
      return;
    }

    const moduleSource = parseSourceFile(host, appModulePath);
    const changes = addSymbolToNgModuleMetadata(
      moduleSource,
      appModulePath,
      'providers',
      ICON_CDN_REGISTRY_NAME,
      '@sbb-esta/angular-core/icon'
    );

    const recorder = host.beginUpdate(appModulePath);
    changes
      .filter((c): c is InsertChange => c instanceof InsertChange)
      .forEach((change) => recorder.insertLeft(change.pos, change.toAdd));
    host.commitUpdate(recorder);

    context.logger.info(`✔️ Added ${ICON_CDN_REGISTRY_NAME} to ${appModulePath}`);

    return host;
  };
}
