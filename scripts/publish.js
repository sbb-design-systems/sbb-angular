
const { inc, prerelease, valid } = require('semver');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

class Publisher {
  constructor(version, tag, dryRun) {
    if (!valid(version)) {
      throw new Error(`${version} is not a valid semver version!`);
    }

    this.version = version;
    this.tag = tag;
    this.dryRun = dryRun;
    const dist = join(__dirname, '..', 'dist');
    this.showcasePath = join(dist, 'sbb-angular-showcase');
    this.libraryPath = join(dist, 'sbb-angular');
  }

  static findVersions(packageName) {
    try {
      const stdout = execSync(`npm view ${packageName} versions --json`)
        .toString();
      return JSON.parse(stdout);
    } catch (e) {
      return [];
    }
  }

  static generateDevVersion(version, type) {
    const pattern = `${version}-${type}.`;
    const subVersions = Publisher.findVersions('sbb-angular-showcase')
      .filter(v => v.startsWith(pattern))
      .map(v => parseInt(v.split(pattern)[1]))
      .filter(v => Number.isInteger(v))
      .sort((a, b) => b - a);
    return `${pattern}${subVersions.length ? subVersions[0] + 1 : 0}`;
  }

  tryPublish() {
    try {
      console.log(`${this.dryRun ? 'Packing' : 'Publishing'} version ${this.version} with tag ${this.tag}`);
      this.publish();
    } catch (e) {
      console.log(`Publish failed\n--------------\n${e}`)
    }
  }

  publish() {
    throw new Error('Not implemented!');
  }

  createShowcasePackageJson(version = this.version) {
    this.savePackageJson(
      join(this.showcasePath, 'package.json'),
      { name: 'sbb-angular-showcase', version });
    console.log(`Created package.json for showcase with version ${version}`);
  }

  publishLibrary() {
    if (!this.dryRun) {
      execSync(
        `npm publish --tag ${this.tag} --registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/`,
        { cwd: this.libraryPath });
      console.log('Published library');
    } else {
      execSync('npm pack', { cwd: this.libraryPath });
      console.log('Packaged library');
    }
  }

  publishShowcase() {
    if (!this.dryRun) {
      execSync(
        `npm publish --tag ${this.tag} --registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/`,
        { cwd: this.showcasePath });
      console.log('Published showcase');
    } else {
      execSync('npm pack', { cwd: this.showcasePath });
      console.log('Packaged showcase');
    }
  }

  updateVersionInPackageJson(file, version) {
    const packageJson = require(file);
    packageJson.version = version;
    this.savePackageJson(file, packageJson);
  }

  savePackageJson(file, content) {
    writeFileSync(file, JSON.stringify(content, null, 2));
  }
}

class LibraryAndShowcasePublisher extends Publisher {
  constructor(version, dryRun) {
    super(version, prerelease(version) ? 'next' : 'latest', dryRun);
    this.isPrerealese = !!prerelease(this.version);
  }

  publish() {
    if (this.versionAvailable()) {
      console.log(`Publishing library and showcase with version ${this.version}`);
      this.createShowcasePackageJson();
      this.updateLibraryPackageJson();
      this.publishLibrary();
      this.publishShowcase();
      this.gitflowRelease();
    } else {
      console.log(`Version ${this.version} has already been published! Skipping publishing.`)
    }
  }

  versionAvailable() {
    const versions = Publisher.findVersions('sbb-angular');
    return !versions.includes(this.version);
  }

  updateLibraryPackageJson() {
    this.updateVersionInPackageJson(join(this.libraryPath, 'package.json'), this.version);
    console.log(`Updated package.json for library with version ${this.version}`);
  }

  gitflowRelease() {
    if (!this.dryRun) {
      execSync(`git remote set-url origin ssh://git@code-ext.sbb.ch:7999/kd_esta/sbb-angular`);
      execSync('git remote set-branches origin "*" && git fetch');
      execSync('git clean -f && git checkout master && git reset --hard origin/master');
      execSync(
        `git commit -a -m "[pipeline-helper] Releasing version ${this.version}" --allow-empty && git tag v${this.version}`);
      execSync('git clean -f && git checkout -B develop origin/develop && git merge master -Xtheirs');
      const newVersion = inc(this.version, this.isPrerealese ? 'prerelease' : 'minor');
      this.updateVersionInPackageJson(join(__dirname, '..', 'package.json'), newVersion);
      execSync(
        `git commit -a -m "[pipeline-helper] Set next dev version ${newVersion}" --allow-empty`);
      execSync('git push origin --all --force && git push origin --tags --force');
      execSync('git clean -f && git checkout master');
      console.log(`Tagged version ${this.version}`);
    } else {
      console.log('Skipping gitflow release in dry run');
    }
  }
}

class DevShowcasePublisher extends Publisher {
  constructor(version, type, dryRun) {
    super(Publisher.generateDevVersion(version, type), type, dryRun);
  }

  publish() {
    this.createShowcasePackageJson();
    this.publishShowcase();
  }
}

const version = process.env.npm_package_version;
const type = (process.argv[2] || '')
  .replace('/', '-')
  .toLowerCase();
const dryRun = !process.env.BUILD_NUMBER;
const publisher = type
  ? new DevShowcasePublisher(version, type, dryRun)
  : new LibraryAndShowcasePublisher(version, dryRun);
publisher.tryPublish();
