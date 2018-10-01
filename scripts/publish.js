
const { inc, major, minor, patch, prerelease, valid } = require('semver');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const execAsync = require('util').promisify(exec);

class Publish {
  constructor(version, mode, dryRun) {
    if (!valid(version)) {
      throw new Error(`${this.version} is not a valid semver version!`);
    }

    this.version = version;
    this.mode = mode;
    this.isPrerealese = !!prerelease(this.version);
    this.tag = this.isPrerealese ? 'next' : 'latest';
    this.dryRun = dryRun;
    const dist = join(__dirname, '..', 'dist');
    this.showcasePath = join(dist, 'sbb-angular-showcase');
    this.libraryPath = join(dist, 'sbb-angular');
  }

  async run() {
    if (!this.dryRun) {
      console.log(`Publishing version ${this.version} with tag ${this.tag}`);
    } else {
      console.log(`Packing version ${this.version}`);
    }

    if (this.mode === 'develop-showcase') {
      const version = await this.nextDevelopShowcaseVersion();
      this.createShowcasePackageJson('sbb-angular-showcase-develop', version);
      await this.publishShowcase();
    } else if (await this.versionAvailable()) {
      this.createShowcasePackageJson();
      this.updateLibraryPackageJson();
      await this.publishLibrary();
      await this.publishShowcase();
      await this.gitflowRelease();
    } else {
      console.log(`Version ${this.version} has already been published! Skipping publishing.`)
    }
  }

  async nextDevelopShowcaseVersion() {
    const stableVersion = `${major(this.version)}.${minor(this.version)}.${patch(this.version)}`;
    const versions = await this.findVersions('sbb-angular-showcase-develop');
    const subVersions = versions
      .filter(v => v.startsWith(stableVersion))
      .map(v => prerelease(v))
      .filter(v => !!v)
      .map(v => v[0])
      .filter(v => Number.isInteger(v))
      .sort((a, b) => b - a);
    return `${stableVersion}-${subVersions.length ? subVersions[0] + 1 : 0}`;
  }

  async versionAvailable() {
    const versions = await this.findVersions('sbb-angular');
    return !versions.includes(this.version);
  }

  async findVersions(packageName) {
    try {
      const { stdout } = await execAsync(`npm view ${packageName} versions --json`);
      return JSON.parse(stdout);
    } catch (e) {
      return [];
    }
  }

  createShowcasePackageJson(name = 'sbb-angular-showcase', version = this.version) {
    this.savePackageJson(join(this.showcasePath, 'package.json'), { name, version });
    console.log(`Created package.json for showcase with version ${version} and name ${name}`);
  }

  updateLibraryPackageJson() {
    this.updateVersionInPackageJson(join(this.libraryPath, 'package.json'), this.version);
    console.log(`Updated package.json for library with version ${this.version}`);
  }

  async publishLibrary() {
    if (!this.dryRun) {
      await execAsync(
        `npm publish --tag ${this.tag} --registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/`,
        { cwd: this.libraryPath });
      console.log('Published library');
    } else {
      await execAsync('npm pack', { cwd: this.libraryPath });
      console.log('Packaged library');
    }
  }

  async publishShowcase() {
    if (!this.dryRun) {
      await execAsync(
        `npm publish --tag ${this.tag} --registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/`,
        { cwd: this.showcasePath });
      console.log('Published showcase');
    } else {
      await execAsync('npm pack', { cwd: this.showcasePath });
      console.log('Packaged showcase');
    }
  }

  async gitflowRelease() {
    if (!this.dryRun) {
      await execAsync(`git remote set-url origin ssh://git@code-ext.sbb.ch:7999/kd_esta/sbb-angular`);
      await execAsync('git remote set-branches origin "*" && git fetch');
      await execAsync('git clean -f && git checkout master && git reset --hard origin/master');
      await execAsync(
        `git commit -a -m "[pipeline-helper] Releasing version ${this.version}" --allow-empty && git tag v${this.version}`);
      await execAsync('git clean -f && git checkout -B develop origin/develop && git merge master -Xtheirs');
      const newVersion = inc(this.version, this.isPrerealese ? 'prerelease' : 'minor');
      this.updateVersionInPackageJson(join(__dirname, '..', 'package.json'), newVersion);
      await execAsync(
        `git commit -a -m "[pipeline-helper] Set next dev version ${newVersion}" --allow-empty`);
      await execAsync('git push origin --all --force && git push origin --tags --force');
      await execAsync('git clean -f && git checkout master');
      console.log(`Tagged version ${this.version}`);
    } else {
      console.log('Skipping gitflow release in dry run');
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

new Publish(process.env.npm_package_version, process.argv[2], !process.env.BUILD_NUMBER)
  .run()
  .catch(e => console.log(`Publish failed\n--------------\n${e}`));
