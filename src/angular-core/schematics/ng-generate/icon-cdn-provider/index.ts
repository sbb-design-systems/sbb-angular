import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import {
  apply,
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
import { getProjectFromWorkspace } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { Schema as IconCdnProviderOptions } from './schema';
export { Schema as IconCdnProviderOptions } from './schema';

interface CdnIndexResponse {
  version: string;
  icons: Array<{ name: string; namespace: string }>;
}

export function iconCdnProvider(options: IconCdnProviderOptions): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<Rule> => {
    const workspace = getWorkspace(tree);
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

    return mergeWith(
      apply(url('./files/provider'), [
        template({
          cdnIndex,
          namespacedIcons: toNamespacedIcons(cdnIndex),
          cdnBaseUrl: options.cdnBaseUrl,
          moduleIcons: require('./used-icons.json'),
        }),
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
  };

  /**
   * Build a default project path for generating.
   * @param project The project to build the path for.
   */
  function buildDefaultPath(project: WorkspaceProject): string {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;

    const projectDirName = project.projectType === ProjectType.Application ? 'app' : 'lib';

    return `${root}${projectDirName}`;
  }

  function downloadIndex() {
    return new Promise<CdnIndexResponse>((resolve, reject) => {
      const { get } = options.cdnIndexUrl.startsWith('https') ? require('https') : require('http');
      get(options.cdnIndexUrl, (res: any) => {
        let body = '';
        res.on('data', (chunk: any) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error: any) => {
        reject(error);
      });
    });
  }

  function toNamespacedIcons(cdnIndex: CdnIndexResponse) {
    return Array.from(
      cdnIndex.icons.reduce((map, icon) => {
        if (!map.has(icon.namespace)) {
          map.set(icon.namespace, [icon.name]);
        } else {
          map.get(icon.namespace)!.push(icon.name);
        }
        return map;
      }, new Map<string, string[]>())
    );
  }
}
