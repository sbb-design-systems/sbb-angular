import { SchematicsException } from '@angular-devkit/schematics';

interface SvgNode {
  elem: string;
  prefix: string;
  local: string;
  attrs: { [name: string]: string };
  class: any;
  style: any;
  content: SvgNode[];
}

export function createSvgOptimizer() {
  const svgoType = tryLoadSvgo();
  const svgo = new svgoType({
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
      {
        ngNamespace: {
          type: 'perItem',
          active: true,
          description: 'Angular namespacing',
          fn: function(data: SvgNode) {
            if (data.elem !== 'svg') {
              data.elem = `svg:${data.elem}`;
            }

            return data;
          }
        }
      } as any
    ]
  });
  return async (svg: string) => await svgo.optimize(svg).then(r => r.data);
}

function tryLoadSvgo(): new (config: import('svgo').Options) => import('svgo') {
  try {
    return require('svgo');
  } catch (e) {
    throw new SchematicsException(
      `This schematic requires svgo!\nnpm install svgo --save-dev\n${e}`
    );
  }
}
