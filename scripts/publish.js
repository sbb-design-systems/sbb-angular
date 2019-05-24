const { exec } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const glob = require('glob');
const { get, request } = require('https');
const { dirname, join, resolve } = require('path');
const { prerelease } = require('semver');
const { parse } = require('url');
const { promisify } = require('util');
const execAsync = promisify(exec);

class Publisher {
  constructor(properties) {
    this.dryRun = properties.dryRun;
    this.isRelease = properties.isRelease;
    this.version = properties.version;
    this.name = properties.name;
    this.stagingAuthorization = properties.stagingAuthorization;
    this.showcasePackageJson = resolve(
      __dirname,
      `../dist/angular-showcase/package.json`
    );
    if (this.isRelease) {
      this.tag = prerelease(this.version) ? 'next' : 'latest';
    } else {
      this.tag = properties.normalizedBranch;
    }
  }

  async execute() {
    if (this.isRelease) {
      this._assignReleaseVersion();
      await this._publishRelease();
    } else {
      await this._assignStagingVersion();
      await this._publishStaging();
    }

    this._triggerStaging();
  }

  _assignReleaseVersion() {
    const dist = resolve(__dirname, '../dist');
    glob
      .sync('**/package.json', { cwd: dist })
      .map(f => join(dist, f))
      .forEach(p => this._assignVersionInPackage(p, this.version));
    console.log(`Assigned release version ${this.version}`);
  }

  async _assignStagingVersion() {
    const version = await this._resolveStagingVersion();
    this._assignVersionInPackage(this.showcasePackageJson, version);
    console.log(`Assigned staging version ${version}`);
  }

  _assignVersionInPackage(path, version) {
    const content = readFileSync(path, 'utf8').replace(
      /0\.0\.0-PLACEHOLDER/g,
      version
    );
    const json = JSON.parse(content);
    json.publishConfig.tag = this.tag;
    writeFileSync(path, JSON.stringify(json, null, 2), 'utf8');
  }

  async _resolveStagingVersion() {
    const version = `0.0.0-${this.tag}.`;
    try {
      const counter = await this._resolveStagingVersionCounter(version);
      return `${version}${counter}`;
    } catch (e) {
      return `${version}0`;
    }
  }

  async _resolveStagingVersionCounter(version) {
    const info = await this._getPackageInformation();
    const counter = Object.keys(info.versions)
      .map(v => v.split(version))
      .filter(p => p && p.length === 2)
      .map(p => parseInt(p[1]))
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => b - a)[0];
    return counter === undefined ? 0 : counter + 1;
  }

  _getPackageInformation() {
    return new Promise((resolve, reject) =>
      get(parse(`https://registry.npmjs.org/${this.name}`), res => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', d => (data += d));
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', e => reject(e))
    );
  }

  async _publishRelease() {
    const directories = glob
      .sync('**/package.json', { cwd: resolve(__dirname, '../dist') })
      .map(p => `../dist/${p}`)
      .sort((a, b) =>
        (require(b).peerDependencies || {})[require(a).name] ? 0 : 1
      )
      .map(p => dirname(resolve(__dirname, p)));
    for (const directory of directories) {
      await this._publishDirectory(directory);
    }
  }

  async _publishStaging() {
    await this._publishDirectory(dirname(this.showcasePackageJson));
  }

  async _publishDirectory(directory) {
    const content = JSON.parse(
      readFileSync(join(directory, 'package.json'), 'utf8')
    );
    if (this.dryRun) {
      await execAsync('npm pack', {
        cwd: directory,
        maxBuffer: 1024 ** 2 * 10
      });
      console.log(`Packed ${content.name} with version ${content.version}`);
    } else {
      await execAsync('npm publish', {
        cwd: directory,
        maxBuffer: 1024 ** 2 * 10
      });
      console.log(`Published ${content.name} with version ${content.version}`);
    }
  }

  _triggerStaging() {
    if (this.dryRun || !this.stagingAuthorization) {
      console.log('Skipped staging trigger');
      return;
    }

    request({
      ...parse(`https://angular.app.sbb.ch/${this.tag}`),
      method: 'POST',
      headers: { authorization: this.stagingAuthorization }
    })
      .on('error', e => {
        throw e;
      })
      .end();
    console.log(`Triggered staging with tag ${this.tag}`);
  }
}

new Publisher({
  ...require('../package.json'),
  name: '@sbb-esta/angular-showcase',
  dryRun: !process.env.TRAVIS,
  isRelease: process.argv[2] === 'release',
  stagingAuthorization: process.env.STAGING_AUTH,
  normalizedBranch: (process.env.TRAVIS_BRANCH || 'staging')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+$/, '')
}).execute();
