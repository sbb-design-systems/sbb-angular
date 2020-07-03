const { HostSink, HostTree } = require('@angular-devkit/schematics');
const { NodeJsSyncHost } = require('@angular-devkit/core/node');
const { normalize, virtualFs } = require('@angular-devkit/core');
const { MODULES, public2business } = require('../schematics/public2business/index');
const { resolve, join } = require('path');
const chokidar = require('chokidar');

class DebounceUpdater {
  constructor(modules) {
    this._timers = new Map();
    this._modules = modules;
    const root = resolve(__dirname, '..');
    this._sourcePath = join(root, 'src', 'angular-public');
    this._host = new virtualFs.ScopedHost(new NodeJsSyncHost(), normalize(root));
    this._sink = new HostSink(this._host, true);
  }

  watch() {
    this._modules.forEach((moduleName) => {
      this._update(moduleName);
      chokidar
        .watch(join(this._sourcePath, moduleName), { ignoreInitial: true })
        .on('all', () => this._scheduleUpdate(moduleName));
    });
  }

  _scheduleUpdate(moduleName) {
    if (this._timers.has(moduleName)) {
      clearTimeout(this._timers.get(moduleName));
    }

    const timer = setTimeout(() => {
      console.log(`Updating ${moduleName}`);
      this._update(moduleName);
    }, 300);
    this._timers.set(moduleName, timer);
  }

  _update(moduleName) {
    const tree = new HostTree(this._host);
    public2business({ filter: moduleName })(tree);
    this._sink.commit(tree).subscribe(
      () => {},
      (e) => console.log(`Failed to update ${moduleName}\n${e}`)
    );
  }
}

if (module === require.main) {
  const updater = new DebounceUpdater(MODULES);
  updater.watch();
}
