import { join } from 'path';
import { pathToFileURL } from 'url';

// TODO: Add explicit type for `Sass.FileImporter` once
//  https://github.com/sass/dart-sass/issues/1714 is fixed.

/** Prefix indicating sbb-angular-owned Sass imports. */
const sbbAngularPrefix = '@sbb-esta/';

/**
 * Creates a Sass `FileImporter` that resolves `@sbb-esta/<..>` packages to the
 * specified local packages directory.
 */
export function createLocalSbbAngularPackageImporter(packageDirAbsPath: string) {
  return {
    findFileUrl: (url: string) => {
      if (url.startsWith(sbbAngularPrefix)) {
        return pathToFileURL(join(packageDirAbsPath, url.substring(sbbAngularPrefix.length)));
      }
      return null;
    },
  };
}
