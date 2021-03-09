import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import {
  apply,
  chain,
  FileEntry,
  forEach,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addSymbolToNgModuleMetadata,
  getProjectFromWorkspace,
  parseSourceFile,
} from '@angular/cdk/schematics';
import { InsertChange } from '@schematics/angular/utility/change';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { hasNgModuleProvider } from '../../utils';

import { Schema as IconCdnProviderOptions } from './schema';
export { Schema as IconCdnProviderOptions } from './schema';

interface CdnIndexResponse {
  version: string;
  icons: IconInfo[];
}

interface IconInfo {
  name: string;
  namespace: string;
}

interface ModuleIcons {
  module: string;
  icons: string[];
}

export function iconCdnProvider(options: IconCdnProviderOptions): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<Rule> => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const path = options.path || buildDefaultPath(project as any);
    const cdnIndex = await downloadIndex()
      .then((r) => {
        context.logger.info(
          `Retrieved ${r.icons.length} icons with version ${r.version} from ${options.cdnIndexUrl}`
        );
        return r;
      })
      .catch(() => {
        context.logger.warn(
          `Unable to resolve ${options.cdnIndexUrl}. Falling back to empty configuration.`
        );
        return { version: 'local', icons: [] } as CdnIndexResponse;
      });
    const moduleIcons: ModuleIcons[] = require('./used-icons.json');

    const rules = [
      createRegistry('./files/provider', {
        cdnIndex,
        cdnBaseUrl: options.cdnBaseUrl,
        namespacedIcons: toNamespacedIcons(cdnIndex.icons),
        moduleIcons,
        registryImportPath: options.generateWrapperRegistry
          ? './icon-registry'
          : '@sbb-esta/angular-core/icon',
      }),
    ];
    if (options.generateWrapperRegistry) {
      rules.push(
        createRegistry('./files/module-provider', {
          cdnIndex,
          cdnBaseUrl: options.cdnBaseUrl,
          namespacedIcons: convertUsedIconsToNamespacedIcons(),
        })
      );
      moduleIcons.forEach((i) => {
        const dir = tree.getDir(i.module.replace('@sbb-esta', 'src'));
        const file = dir.file(dir.subfiles.find((f) => f.endsWith('.module.ts'))!)!;
        addIconRegistryProviderToModule(file.path);
      });
    }

    rules.push(applyLintFix());
    return chain(rules);

    /**
     * Build a default project path for generating.
     * @param workspaceProject The project to build the path for.
     */
    function buildDefaultPath(workspaceProject: ProjectDefinition): string {
      const root = workspaceProject.sourceRoot
        ? `/${workspaceProject.sourceRoot}/`
        : `/${workspaceProject.root}/src/`;

      const projectDirName =
        workspaceProject.extensions.projectType === ProjectType.Application ? 'app' : 'lib';

      return `${root}${projectDirName}`;
    }

    function downloadIndex() {
      return new Promise<CdnIndexResponse>((resolve, reject) => {
        const { get } = options.cdnIndexUrl.startsWith('https')
          ? require('https')
          : require('http');
        get(options.cdnIndexUrl, (res: any) => {
          let body = '';
          res.on('data', (chunk: any) => (body += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(body) as CdnIndexResponse);
            } catch (error) {
              reject(error);
            }
          });
        }).on('error', (error: any) => {
          reject(error);
        });
      });
    }

    function createRegistry<T>(templateUrl: string, templateOptions: T) {
      return mergeWith(
        apply(url(templateUrl), [
          template(templateOptions),
          move(path),
          forEach((fileEntry: FileEntry) => {
            // Just by adding this is allows the file to be overwritten if it already exists
            if (tree.exists(fileEntry.path)) {
              tree.overwrite(fileEntry.path, fileEntry.content);
              return null;
            }
            return fileEntry;
          }),
        ])
      );
    }

    function convertUsedIconsToNamespacedIcons() {
      const icons = moduleIcons
        .map((i) => i.icons)
        .reduce((current, next) => current.concat(next))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort()
        .map((i) => i.split(':'))
        .map(([namespace, name]) => ({ namespace, name }));
      return toNamespacedIcons(icons);
    }

    function toNamespacedIcons(icons: IconInfo[]) {
      return Array.from(
        icons.reduce((map, icon) => {
          if (!map.has(icon.namespace)) {
            map.set(icon.namespace, [icon.name]);
          } else {
            map.get(icon.namespace)!.push(icon.name);
          }
          return map;
        }, new Map<string, string[]>())
      );
    }

    function addIconRegistryProviderToModule(appModulePath: string) {
      const providerName = 'ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER';
      if (hasNgModuleProvider(tree, appModulePath, providerName)) {
        context.logger.info(`${providerName} already imported. Skipping...`);
        return;
      }

      const moduleSource = parseSourceFile(tree, appModulePath);
      const changes = addSymbolToNgModuleMetadata(
        moduleSource,
        appModulePath,
        'providers',
        providerName,
        `@sbb-esta/angular-core/icon`
      );

      const recorder = tree.beginUpdate(appModulePath);
      changes
        .filter((c): c is InsertChange => c instanceof InsertChange)
        .forEach((change) => recorder.insertLeft(change.pos, change.toAdd));
      tree.commitUpdate(recorder);

      context.logger.info(`✔️ Added ${providerName} to ${appModulePath}`);
    }
  };
}
