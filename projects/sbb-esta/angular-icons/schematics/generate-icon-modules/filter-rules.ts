import { SvgFile } from './svg-file';
import { SchematicsException } from '@angular-devkit/schematics';

export const filterRules: Array<
  (svgFile: SvgFile, svgFiles: SvgFile[]) => boolean
> = [
  (file, files) => {
    if (!file.modules.includes('non-responsive')) {
      return true;
    }

    const idNumberMatch = /\_\s*(\d+)\_/.exec(file.name);
    if (!idNumberMatch || !idNumberMatch[1]) {
      throw new SchematicsException(file.name);
    }

    return files
      .filter(f => f.modules.includes('responsive'))
      .every(f => !f.name.includes(idNumberMatch[1]));
  }
];
