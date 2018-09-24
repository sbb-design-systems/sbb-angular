const { exec } = require('child_process');
const express = require('express');
const { copy, readFile, writeFile, existsSync } = require('fs-extra');
const { join } = require('path');
const { prerelease, major, gt } = require('semver');
const execAsync = require('util').promisify(exec);

class ShowcasePackage {
  constructor(packageInfo, version = 'latest', target = undefined) {
    this.name = packageInfo.name;
    this.version = version;
    this.actualVersion = this.version in packageInfo['dist-tags']
      ? packageInfo['dist-tags'][this.version] : this.version;
    this.publishDatetime = packageInfo.time[this.actualVersion];
    this.target = target || this.version;
    this.targetDir = join(__dirname, 'browser', this.target);
    this.installName = this.version === 'latest'
      ? this.name : `${this.name}-${this.version}@npm:${this.name}@${this.version}`;
    this.location = join(
      __dirname, 'node_modules', this.version === 'latest' ? this.name : `${this.name}-${this.version}`);
  }

  async install() {
    await execAsync(`yarn add ${this.installName}`);
    await copy(this.location, this.targetDir);
    const indexFile = join(this.targetDir, 'index.html');
    const indexHtml = await readFile(indexFile, 'utf-8');
    await writeFile(
      indexFile, indexHtml.replace(/<base[^>]+>/g, `<base href="/${this.target}/">`), 'utf-8');
  }

  toString() {
    return this.version !== this.actualVersion
      ? `${this.target} (${this.actualVersion})` : this.target;
  }

  toLocaleDatetime() {
    const date = new Date(this.publishDatetime);
    const paddedJoin = (parts, glue) => parts
      .map(n => n < 10 ? `0${n}` : n.toString())
      .join(glue);
    const dateString = paddedJoin([date.getDate(), date.getMonth() + 1, date.getFullYear()], '.');
    const timeString = paddedJoin([date.getHours(), date.getMinutes(), date.getSeconds()], ':');
    return `${dateString} ${timeString}`;
  }
}

class Setup {
  constructor() {
    this.ready = false;
    this.showcasePackage = 'sbb-angular-showcase';
    this.developShowcasePackage = `${this.showcasePackage}-develop`;
  }

  async run() {
    this.showcaseVersions = await this.resolveShowcaseVersions();
    for (const installable of this.showcaseVersions) {
      console.log(`Installing ${installable.name}@${installable.version}`);
      await installable.install();
    }
    console.log('Finished installation of showcases');
    this.ready = true;
    console.log('Ready');
  }

  async resolveShowcaseVersions() {
    const developShowcaseInfo = await this.info(this.developShowcasePackage);
    const showcaseInfo = await this.info(this.showcasePackage);
    return [
      new ShowcasePackage(developShowcaseInfo, 'latest', 'develop'),
      new ShowcasePackage(showcaseInfo),
      new ShowcasePackage(showcaseInfo, 'next'),
      ...await this.resolveLatestShowcaseMajorVersions(showcaseInfo),
    ];
  }

  async resolveLatestShowcaseMajorVersions(showcaseInfo) {
    const versions = showcaseInfo.versions
      .reduce((current, next) => {
        if (!prerelease(next) && (!current.has(major(next)) || gt(next, current.get(major(next))))) {
          current.set(major(next), next);
        }
        return current;
      }, new Map());
    return Array.from(versions)
      .map(([, version]) => new ShowcasePackage(showcaseInfo, version));
  }

  async info(packageName) {
    try {
      const { stdout } = await execAsync(`yarn info ${packageName} --json`);
      return JSON.parse(stdout).data;
    } catch (e) {
      return undefined;
    }
  }
}

const setup = new Setup();
setup.run();

const PORT = process.env.NODE_PORT || 4000;
const BROWSER_ROOT = join(__dirname, 'browser');
const app = express();

app.set('views', '.');
app.set('view engine', 'pug');
app.get('*.*', express.static(BROWSER_ROOT));
app.get('/ready', (req, res) => res.sendStatus(setup.ready ? 200 : 503));
app.get('/', (req, res) => {
  if (setup.ready) {
    res.render('index', { showcaseVersions: setup.showcaseVersions });
  } else {
    res.sendStatus(503);
  }
});
app.get('*', (req, res) => {
  const [, version] = req.path.split('/');
  const indexHtml = join(BROWSER_ROOT, version, 'index.html');
  if (existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.sendStatus(404);
  }
});
app.listen(PORT, () => console.log(`Node server listening on http://localhost:${PORT}`));
