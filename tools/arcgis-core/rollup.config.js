import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  external: (id)=> {
    return id.includes('moment');
  },
  plugins: [
    nodeResolve({}),
  ],
};
