
const semver = require('semver');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const execAsync = require('util').promisify(exec);

class Publish {
  constructor(version, mode, dryRun) {
    if (!semver.valid(version)) {
      throw new Error(`${this.version} is not a valid semver version!`);
    }

    this.version = version;
    this.mode = mode;
    this.tag = semver.prerelease(this.version) ? 'next' : 'latest';
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
      this.publishShowcase();
    } else if (await this.versionAvailable()) {
      this.createShowcasePackageJson();
      this.updateLibraryPackageJson();
      this.publishLibrary();
      this.publishShowcase();
      this.tagReleaseInGit();
    } else {
      throw new Error(`Version ${this.version} has already been published!`);
    }
  }

  async nextDevelopShowcaseVersion() {
    const versions = await this.findVersions('sbb-angular-showcase-develop');
    if (versions.length === 0) {
      return `${this.version}-0`;
    }

    const subVersions = versions.filter(v => v.startsWith(this.version))
      .map(v => parseInt(v.split('-')[1]) + 1);
    return `${this.version}-${subVersions.length ? Math.max(...subVersions) : 0}`;
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
    const packageJson = { name, version };
    writeFileSync(
      join(this.showcasePath, 'package.json'),
      JSON.stringify(packageJson, null, 2));
    console.log(`Created package.json for showcase with version ${version} and name ${name}`);
  }

  updateLibraryPackageJson() {
    const libraryPackageJsonPath = join(this.libraryPath, 'package.json');
    const packageJson = require(libraryPackageJsonPath);
    packageJson.version = this.version;
    writeFileSync(
      libraryPackageJsonPath,
      JSON.stringify(packageJson, null, 2));
    console.log(`Updated package.json for library with version ${this.version}`);
  }

  async publishLibrary() {
    if (!this.dryRun) {
      await execAsync(
        'npm publish --registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/',
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
        'npm publish --registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/',
        { cwd: this.showcasePath });
      console.log('Published showcase');
    } else {
      await execAsync('npm pack', { cwd: this.showcasePath });
      console.log('Packaged showcase');
    }
  }

  async tagReleaseInGit() {
    if (!this.dryRun) {
      const { stdout } = await execAsync(`git remote -v | head -n1 | awk '{print \$2}'`);
      const [repo, project] = stdout.split('/').reverse();
      await execAsync(`git remote set-url origin ssh://git@code-ext.sbb.ch:7999/${project}/${repo}`);
      await execAsync('git remote set-branches origin "*" && git fetch');
      await execAsync('git clean -f && git checkout master && git reset --hard origin/master');
      await execAsync(
        `git commit -a -m "Releasing stable version ${params.releaseVersion}\" && git tag ${params.releaseVersion}`);
    } else {
      console.log('Skipping git tag in dry run');
    }
  }
}

new Publish(process.env.npm_package_version, process.argv[2], !process.env.BUILD_NUMBER)
  .run();
