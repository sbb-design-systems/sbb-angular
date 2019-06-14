# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [8.0.0-beta.0](https://github.com/SchweizerischeBundesbahnen/sbb-angular/compare/v1.1.0...v8.0.0-beta.0) (2019-06-14)


### refactor

* move and refactor sass files ([#28](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/28)) ([f2ac62d](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/f2ac62d))


### BREAKING CHANGES

* Removed component mixins from published stles.scss and renamed scss color variables to pattern sbbColor*Name* (names used from https://digital.sbb.ch/en/farben)



## 7.0.0 (2019-05-28)


### Bug Fixes

* **datepicker:** convert 2-digit years to 19xx or 20xx ([#14](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/14)) ([70b22ee](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/70b22ee)), closes [#13](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/13)
* **datepicker:** fix invalid input on empty input ([#10](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/10)) ([0368615](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/0368615)), closes [#9](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/9)
* **datepicker:** fixes arrow navigation with min and max dates ([#12](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/12)) ([a2d1d08](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/a2d1d08)), closes [#11](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/11)


### Features

* github preparation ([#1](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/1)) ([7b73b5e](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/7b73b5e))
* **angular-icons:** update icons ([#6](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/6)) ([a579e74](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/a579e74))
* **ci:** Set up ci/cd with Travis CI ([bcf4082](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/bcf4082))



## [7.0.0](https://github.com/SchweizerischeBundesbahnen/sbb-angular/compare/v1.1.0...v7.0.0) (2019-05-28)


### Bug Fixes

* **datepicker:** convert 2-digit years to 19xx or 20xx ([#14](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/14)) ([70b22ee](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/70b22ee)), closes [#13](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/13)
* **datepicker:** fix invalid input on empty input ([#10](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/10)) ([0368615](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/0368615)), closes [#9](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/9)
* **datepicker:** fixes arrow navigation with min and max dates ([#12](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/12)) ([a2d1d08](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/a2d1d08)), closes [#11](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/11)


### Features

* github preparation ([#1](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/1)) ([7b73b5e](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/7b73b5e))
* **angular-icons:** update icons ([#6](https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/6)) ([a579e74](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/a579e74))
* **ci:** Set up ci/cd with Travis CI ([bcf4082](https://github.com/SchweizerischeBundesbahnen/sbb-angular/commit/bcf4082))


### Deprecations

* Icons in @sbb-esta/angular-public have been deprecated and will be removed in v8. Use the icons from @sbb-esta/angular-icons instead. For a list of available icons, visit https://angular.app.sbb.ch/latest/icons-list.