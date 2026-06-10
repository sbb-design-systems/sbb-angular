# How to create a new release

This document describes how to create a new release of SBB Angular.

## Preparation

### Major release preparation

- See the TODO in file `bazel-additional-stamp.mjs`
- Update Angular packages to align with new angular major version.
- Update ng-update schematics.
- Update stackblitz assets.
- Update version range in packages.bzl
- Update the "How to update" guide.
- Check TODOs, @breaking-change annotations and @deprecated annotations.
- Check angular components commits to be considered for next major release in the [sync issue](https://github.com/sbb-design-systems/sbb-angular/issues/1047).
- Create new route for previous release (e.g. angular-v13.app.sbb.ch) and deploy corresponding version.
- Update `src/angular/schematics/migration.json`. There must be a function in index.ts that matches the function referenced via "factory"
  (e.g. if `"factory": "./ng-update/index#updateToV18"`, there must be a function called `updateToV18` in `index.ts`)
- Github maintenance workflow
  - Create new maintenance branch (e.g. 14.x).
  - Edit TARGET_RELEASE in `.github/workflows/maintenance-tagging-workflow.yml`.
  - Edit `baseBranches` property in `renovate.json` to activate renovate on new branch.

## Release preparation

The following steps create a release tag and generate a changelog:

1. Check out the `main` or your desired release branch and ensure it's up-to-date.
2. Run `pnpm release` to create a tag and to generate the changelog.
3. Check if the automatically updated `CHANGELOG.md` file contains all the information relevant for
   the release. If everything worked well, continue with step 7.
4. If necessary, update the `CHANGELOG.md` file. Afterwards, delete the tag created in step 3, e.g.
   by running `git tag -d x.y.z`.
5. Amend the modified `CHANGELOG.md` to the release commit by running
   `git add CHANGELOG.md && git commit --amend`)
6. Recreate the release tag: `git tag x.y.z`.
7. Push the commit including the tags: `git push origin main --tags`.

## Creating the release

### GitHub

Open the [SBB Angular Github page](https://github.com/sbb-design-systems/sbb-angular) and click on
"Releases".

Click on "Draft a new release". Select the corresponding tag from the list. Add the title, e.g. `Release x.z.y` and use the
corresponding section from `CHANGELOG.md` as the release description.

Next, update the docs before publishing this page.

### Update the docs (SBB internal)

Checkout the `esta-apps-argocd` repository and enter the new version number.
For ArgoCD, update `clusters/maggie/applications/values.yaml`.
If this was a major release, also update the `LEGACY_VERSIONS` in our ArgoCD repository.

After having committed the changes, sync the app using the ArgoCD GUI. Check if the docs was
successfully published to https://angular.app.sbb.ch.

## Publishing the release

On the GitHub release page, click on "Publish release" to publish everything.

## Update the blueprint

Update the internal blueprint `esta-cloud-angular` repo with the new sbb-angular version.

## Blogpost

Consider creating an internal blog post, to inform about special changes. For major updates this is mandatory.
