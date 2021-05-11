import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  output: {
    amd: {
      id: 'arcgisCore',
    },
    name: 'arcgisCore',
    inlineDynamicImports: true,
  },
  plugins: [
    nodeResolve(),
    {
      name: 'moment-reduction',
      transform(code, id) {
        // We remove the moment locale bundles in order to reduce the bundle for the devserver
        if (id.includes('@arcgis') && id.includes('moment')) {
          return code.replace(/new Map\(\[(\[[^\]]+\],?)+\]\)/, 'new Map()');
        }

        return code;
      },
    },
    commonjs(),
  ],
};
