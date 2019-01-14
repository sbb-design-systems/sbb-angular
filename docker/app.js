const { exec } = require('child_process');
const express = require('express');
const { copy, readFile, writeFile, existsSync } = require('fs-extra');
const { join } = require('path');
const { DateTime, Duration } = require('luxon');
const execAsync = require('util').promisify(exec);

const MAX_AGE_IN_DAYS = (process.env.MAX_AGE_IN_DAYS || 14) * -1;

class ShowcasePackage {
  constructor(packageInfo, tag) {
    this.name = packageInfo.name;
    this.tag = tag;
    this.version = packageInfo['dist-tags'][this.tag];
    this.dateTime = DateTime.fromISO(
      packageInfo.time[this.version], { locale: 'de', zone: 'Europe/Zurich' });
    this.targetDir = join(__dirname, 'browser', this.tag);
    this.installName = `sbb-angular-showcase-${this.tag}@npm:sbb-angular-showcase@${this.tag}`;
    this.location = join(__dirname, 'node_modules', `sbb-angular-showcase-${this.tag}`);
  }

  async install() {
    await execAsync(`yarn add ${this.installName}`);
    await copy(this.location, this.targetDir);
    const indexFile = join(this.targetDir, 'index.html');
    const indexHtml = await readFile(indexFile, 'utf-8');
    await writeFile(
      indexFile,
      indexHtml.replace(
        /<base[^>]+>/g,
        `<base href="/${this.tag}/"><meta name="robots" content="noindex, nofollow">`),
      'utf-8');
  }

  isReleased() {
    return this.tag !== 'develop' && !this.tag.startsWith('feature-');
  }

  isObsolete() {
    return this.tag.startsWith('feature-')
      && this.dateTime.diffNow('days').toObject().days < MAX_AGE_IN_DAYS;
  }

  toString() {
    return this.isReleased() ? `${this.tag} (${this.version})` : this.tag;
  }

  toLocaleDatetime() {
    return this.dateTime.toFormat('dd.MM.yyyy HH:mm:ss');
  }
}

class Setup {
  constructor() {
    this.ready = false;
    this.showcasePackage = 'sbb-angular-showcase';
  }

  async run() {
    const showcaseVersions = await this.resolveShowcaseVersions();
    this.releasedVersions = showcaseVersions.filter(s => s.isReleased());
    this.devVersions = showcaseVersions.filter(s => !s.isReleased());
    for (const installable of showcaseVersions) {
      console.log(`Installing ${installable.name}@${installable.version}`);
      await installable.install();
    }
    console.log('Finished installation of showcases');
    this.ready = true;
    console.log('Ready');
  }

  async resolveShowcaseVersions() {
    const showcaseInfo = await this.info(this.showcasePackage);
    return Object.keys(showcaseInfo['dist-tags'])
      .map(t => new ShowcasePackage(showcaseInfo, t))
      .filter(s => !s.isObsolete())
      .sort((a, b) => b.dateTime - a.dateTime);
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
    res.render('index', setup);
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
