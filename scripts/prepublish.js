const { readFileSync, writeFileSync } = require('fs');
const glob = require('glob');
const { get } = require('https');
const { join } = require('path');
const { prerelease } = require('semver');
const { parse } = require('url');

class Prepublish {
  constructor() {
    this.showcasePackageJson = join(
      __dirname,
      '../dist/angular-showcase/package.json'
    );
    this.isRelease = !!process.env.TRAVIS_TAG;
    this.branch = (
      process.env.NORMALIZED_BRANCH_NAME ||
      process.env.TRAVIS_BRANCH ||
      ''
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/-+/g, '-')
      .replace(/-+$/, '');
    const {
      name,
      version,
      repository,
      license,
      bugs,
      homepage,
      staging
    } = require('../package.json');
    this.package = {
      name,
      version,
      repository,
      license,
      bugs,
      homepage,
      staging
    };
  }

  async execute() {
    if (this.isRelease) {
      this._assignReleaseVersion();
      console.log(`Assigned release version ${this.package.version}`);
    } else {
      await this._assignStagingVersion();
      console.log(`Assigned staging version ${this.package.version}`);
    }
  }

  _assignReleaseVersion() {
    const { version } = this.package;
    const dist = join(__dirname, '../dist');
    glob
      .sync('**/package.json', { cwd: dist })
      .map(f => join(dist, f))
      .forEach(p => this._assignVersionInPackage(p, version));
    this._createShowcasePackageJson();
  }

  _assignVersionInPackage(path, version) {
    const content = readFileSync(path, 'utf8').replace(
      /0\.0\.0-PLACEHOLDER/g,
      version
    );
    const json = JSON.parse(content);
    if (prerelease(json.version)) {
      json.publishConfig.tag = 'next';
    }

    writeFileSync(path, JSON.stringify(json, null, 2), 'utf8');
  }

  async _assignStagingVersion() {
    const version = `0.0.0-${this.branch}.`;
    this.package.publishConfig.tag = this.branch;
    try {
      const counter = await this._resolveStagingVersionCounter(version);
      this.package.version = `${version}${counter}`;
    } catch (e) {
      this.package.version = `${version}0`;
    }

    this._createShowcasePackageJson();
  }

  _createShowcasePackageJson() {
    writeFileSync(
      this.showcasePackageJson,
      JSON.stringify(this.package, null, 2),
      'utf8'
    );
  }

  async _resolveStagingVersionCounter(version) {
    const { versions } = await this._getPackageInformation();
    const counter = Object.keys(versions)
      .map(v => v.split(version))
      .filter(p => p && p.length === 2)
      .map(p => parseInt(p[1]))
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => b - a)[0];
    return counter === undefined ? 0 : ++counter;
  }

  _getPackageInformation() {
    return new Promise((resolve, reject) =>
      get(parse(`https://registry.npmjs.org/${this.package.name}`), res => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', d => (data += d));
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', e => reject(e))
    );
  }
}

new Prepublish().execute();
