import { join } from 'path';
import * as sass from 'sass';
import { pathToFileURL } from 'url';

/** Prefix indicating sbb-angular-owned Sass imports. */
const sbbAngularPrefix = '@sbb-esta/';

/**
 * Creates a Sass `FileImporter` that resolves `@sbb-esta/<..>` packages to the
 * specified local packages directory.
 */
export function createLocalSbbAngularPackageImporter(packageDirAbsPath: string): sass.FileImporter {
  return {
    findFileUrl: (url: string) => {
      if (url.startsWith(sbbAngularPrefix)) {
        return pathToFileURL(join(packageDirAbsPath, url.substring(sbbAngularPrefix.length)));
      }
      return null;
    },
  };
}
