const esbuild = require('esbuild');
const { readdirSync } = require('fs');
const { join } = require('path');

readdirSync(__dirname, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .forEach((d) =>
    esbuild
      .build({
        entryPoints: [join(__dirname, d.name, 'index.ts')],
        bundle: true,
        outfile: join(__dirname, d.name, 'index.js'),
        platform: 'node',
        plugins: [
          {
            name: 'make-all-packages-external',
            setup(build) {
              const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]|package\.json$/; // Must not start with "/" or "./" or "../"
              build.onResolve({ filter }, (args) => ({ path: args.path, external: true }));
            },
          },
        ],
      })
      .catch(() => process.exit(1))
  );
