import { Document } from 'dgeni';

import { ModuleInfo } from '../processors/entry-point-grouper';

/**
 * Computes an URL that refers to the given API document in the docs. Note that this logic
 * needs to be kept in sync with the routes from the sbb-angular project.
 */
export function computeApiDocumentUrl(apiDoc: Document, moduleInfo: ModuleInfo): string {
  const baseUrl = moduleInfo.packageName.split('-')[1];
  return baseUrl === 'core'
    ? `${baseUrl}/api/${moduleInfo.entryPointName}#${apiDoc.name}`
    : `${baseUrl}/components/${moduleInfo.entryPointName}/api#${apiDoc.name}`;
}
