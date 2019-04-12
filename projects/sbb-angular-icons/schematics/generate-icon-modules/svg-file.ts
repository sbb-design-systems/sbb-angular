import { FileEntry, SchematicsException } from '@angular-devkit/schematics';
import { Svgo } from './svgo';

export class SvgFile {
  size = '';

  constructor(
    public name: string,
    public modules: string[],
    readonly filepath: string,
    readonly template: string,
    readonly width: number,
    readonly height: number,
    readonly ratio: number,
  ) { }

  static async from(filepath: string, entry: Readonly<FileEntry>) {
    const lastSlashIndex = filepath.lastIndexOf('/');
    const name = filepath.substring(lastSlashIndex + 1, filepath.lastIndexOf('.'));
    const modules = filepath.substring(0, lastSlashIndex).split('/');
    const content = entry.content.toString('utf8');
    const template = (await Svgo.optimize(content))
      .replace('<svg ', `<svg [attr.class]="'sbb-svg-icon ' + svgClass" `);
    const width = SvgFile._determineDimension(
      /( width="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+(\d+)[ ,]+\d+")/g, content, filepath);
    const height = SvgFile._determineDimension(
      /( height="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+\d+[ ,]+(\d+))"/g, content, filepath);
    return new SvgFile(name, modules, filepath, template, width, height, width / height);
  }

  private static _determineDimension(regex: RegExp, content: string, filepath: string) {
    const match = regex.exec(content);
    if (!match) {
      throw new SchematicsException(`No width found in ${filepath}`);
    }

    return Number(match[2] || match[3]);
  }
}
