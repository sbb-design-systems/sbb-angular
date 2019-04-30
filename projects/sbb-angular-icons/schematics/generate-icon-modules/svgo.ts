import { SchematicsException } from '@angular-devkit/schematics';

export class Svgo {
  private static _instance = new Svgo();
  private _svgo: any;

  constructor() {
    try {
      const svgo = require('svgo');
      this._svgo = new svgo({
        plugins: [
          { cleanupAttrs: true },
          { removeDoctype: true },
          { removeXMLProcInst: true },
          { removeComments: true },
          { removeMetadata: true },
          { removeTitle: true },
          { removeDesc: true },
          { removeUselessDefs: true },
          { removeEditorsNSData: true },
          { removeEmptyAttrs: true },
          { removeHiddenElems: true },
          { removeEmptyText: true },
          { removeEmptyContainers: true },
          { removeViewBox: false },
          { cleanupEnableBackground: true },
          { convertStyleToAttrs: true },
          { convertColors: true },
          { convertPathData: true },
          { convertTransform: true },
          { removeUnknownsAndDefaults: true },
          { removeNonInheritableGroupAttrs: true },
          { removeUselessStrokeAndFill: true },
          { removeUnusedNS: true },
          { cleanupIDs: true },
          { cleanupNumericValues: true },
          { moveElemsAttrsToGroup: true },
          { moveGroupAttrsToElems: true },
          { collapseGroups: true },
          { removeRasterImages: false },
          { mergePaths: true },
          { convertShapeToPath: true },
          { sortAttrs: true },
          { removeDimensions: true },
          { removeAttrs: { attrs: '(font-family)' } },
        ]
      });
    } catch {
      throw new SchematicsException('This schematics requires the svgo package!');
    }
  }

  /**
   * Normalizes SVG mark-up, optimizing the content for cross-browser compatibility.
   * [svgo](https://github.com/svg/svgo) library is used for the scope with configured options findable in svgo-configuration.ts
   * @param svg Source SVG mark-up
   * @return normalized SVG mark-up
   */
  static async optimize(svg: string): Promise<string> {
    const { data } = await Svgo._instance._svgo.optimize(svg);
    return data.trim();
  }
}
