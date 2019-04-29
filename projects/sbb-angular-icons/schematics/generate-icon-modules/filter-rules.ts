import { SvgFile } from './svg-file';

export const filterRules: Array<(svgFile: SvgFile, svgFiles: SvgFile[]) => boolean> = [
  (file, files) => file.modules.includes('non-responsive')
    ? files
      .filter(f => f.modules.includes('responsive'))
      .every(f => !f.name.startsWith(file.name.replace(/_(small|medium|large)$/, '')))
    : true,
]