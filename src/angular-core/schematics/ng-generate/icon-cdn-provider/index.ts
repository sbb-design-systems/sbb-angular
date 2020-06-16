import {
  apply,
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
import { join } from 'path';

import { Schema as IconCdnProviderOptions } from './schema';
export { Schema as IconCdnProviderOptions } from './schema';

interface CdnIndexResponse {
  version: string;
  icons: Array<{ name: string; namepsace: string }>;
}

export function iconCdnProvider(options: IconCdnProviderOptions): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<Rule> => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const targetDir = join(project.root, options.targetDir);
    const cdnIndex: CdnIndexResponse = await downloadIndex().catch(() => {
      context.logger.warn(
        `Unable to resolve ${options.cdnIndexUrl}. Falling back to empty configuration.`
      );
      return { version: 'local', icons: [] } as CdnIndexResponse;
    });

    return mergeWith(
      apply(url('./files/provider'), [
        template({ cdnIndex, cdnBaseUrl: options.cdnBaseUrl }),
        move(targetDir),
      ])
    );
  };

  function downloadIndex() {
    return new Promise<CdnIndexResponse>((resolve, reject) => {
      const { get } = options.cdnIndexUrl.startsWith('https') ? require('https') : require('http');
      get(options.cdnIndexUrl, (res: any) => {
        let body = '';

        res.on('data', (chunk: any) => {
          body += chunk;
        });

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
}
