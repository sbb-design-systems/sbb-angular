# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [13.4.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.3.0...13.4.0) (2022-02-03)


### Features

* **angular/tabs:** add the ability to keep content inside the DOM while off-screen ([#1094](https://github.com/sbb-design-systems/sbb-angular/issues/1094)) ([aeaa607](https://github.com/sbb-design-systems/sbb-angular/commit/aeaa60721c2675657baf7b63a7e2e526ed430006))


### Bug Fixes

* **angular/chips:** don't stop propagation on all click events ([#1083](https://github.com/sbb-design-systems/sbb-angular/issues/1083)) ([aed6a50](https://github.com/sbb-design-systems/sbb-angular/commit/aed6a503f0c814441d183f0cda9f7838d0ffe5cd))
* **angular/datepicker:** make input full width ([#1104](https://github.com/sbb-design-systems/sbb-angular/issues/1104)) ([ee6ec4e](https://github.com/sbb-design-systems/sbb-angular/commit/ee6ec4ee30051e6da75a42d7fd3b8ad81ce66b21))
* **angular/menu:** adjust overlay size when amount of items changes ([#1103](https://github.com/sbb-design-systems/sbb-angular/issues/1103)) ([786c650](https://github.com/sbb-design-systems/sbb-angular/commit/786c650518c12bb6b4381ba12eab65a5413708cb))
* **angular/styles:** fix invalid user-select values ([#1086](https://github.com/sbb-design-systems/sbb-angular/issues/1086)) ([44901fe](https://github.com/sbb-design-systems/sbb-angular/commit/44901feb65b8716a41cf3ed228e3fcf9c9b7a522))
* **angular/styles:** fix selection-item styles ([#1088](https://github.com/sbb-design-systems/sbb-angular/issues/1088)) ([a52fffc](https://github.com/sbb-design-systems/sbb-angular/commit/a52fffc761b76bc68b4dbe18cbfc981a1c853e5e)), closes [#878](https://github.com/sbb-design-systems/sbb-angular/issues/878)
* **angular/tabs:** fix padding in lean design ([#1087](https://github.com/sbb-design-systems/sbb-angular/issues/1087)) ([9457789](https://github.com/sbb-design-systems/sbb-angular/commit/94577893aaa4116a5b49c8cd73560e9900bab12a))
* **angular/tabs:** fix showing pagination arrows on zoom levels other than 100% ([#1090](https://github.com/sbb-design-systems/sbb-angular/issues/1090)) ([63798ff](https://github.com/sbb-design-systems/sbb-angular/commit/63798ffebbbc3c0443c877f42992f34d1f34602a))
* **angular/tabs:** use buttons for paginator ([#1102](https://github.com/sbb-design-systems/sbb-angular/issues/1102)) ([d76454d](https://github.com/sbb-design-systems/sbb-angular/commit/d76454d053f1ab25c585d9814bea1f767ce407e1))
* **showcase:** resolve doc links correctly ([#1099](https://github.com/sbb-design-systems/sbb-angular/issues/1099)) ([39c31ba](https://github.com/sbb-design-systems/sbb-angular/commit/39c31baf669823378c3fe3d872c51b45dea3ca58))


### Documentation

* how to update with split update commands ([#1101](https://github.com/sbb-design-systems/sbb-angular/issues/1101)) ([4187482](https://github.com/sbb-design-systems/sbb-angular/commit/41874826a7b4a6535618980a8216743f57659cae))
* **angular/table:** correct closing tag ([#1091](https://github.com/sbb-design-systems/sbb-angular/issues/1091)) ([181a177](https://github.com/sbb-design-systems/sbb-angular/commit/181a1770195b0360eff4af5ba82b203f6387f7ec))
* **angular/tabs:** update accessibility section ([#1100](https://github.com/sbb-design-systems/sbb-angular/issues/1100)) ([6bfa9dc](https://github.com/sbb-design-systems/sbb-angular/commit/6bfa9dc1dc97300328d135be448620102c228aec))
* **showcase:** set version of @angular/cli in how to update guide ([#1097](https://github.com/sbb-design-systems/sbb-angular/issues/1097)) ([acdc190](https://github.com/sbb-design-systems/sbb-angular/commit/acdc190217b6f528fc15717eddf37b1916e10989))
* fix typo ([f0ad81b](https://github.com/sbb-design-systems/sbb-angular/commit/f0ad81bfd1eef2384d9a3d8d28553f2f89b07884))

## [13.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.2.0...13.3.0) (2022-01-26)


### Features

* **angular/form-field:** provide form group CSS classes ([#1075](https://github.com/sbb-design-systems/sbb-angular/issues/1075)) ([9a5008b](https://github.com/sbb-design-systems/sbb-angular/commit/9a5008b02806e605138336a438623196d10702c2))


### Bug Fixes

* **angular/autocomplete:** restore focus after emitting option selected event ([#1068](https://github.com/sbb-design-systems/sbb-angular/issues/1068)) ([5d4c388](https://github.com/sbb-design-systems/sbb-angular/commit/5d4c3884a1f002fb2c7043ec2a38b0f8d9f4b5ed))
* **angular/radio-button-panel:** only show error styles when parent group is invalid ([#1080](https://github.com/sbb-design-systems/sbb-angular/issues/1080)) ([f7435fa](https://github.com/sbb-design-systems/sbb-angular/commit/f7435fa73b5f4a2c93a54f4b5e39bf62c9fc63cf)), closes [#1078](https://github.com/sbb-design-systems/sbb-angular/issues/1078)
* **angular/search:** ensure icon position is correctly aligned ([#1081](https://github.com/sbb-design-systems/sbb-angular/issues/1081)) ([0089760](https://github.com/sbb-design-systems/sbb-angular/commit/00897605819ae65391757de14989e83181bcf750)), closes [#1079](https://github.com/sbb-design-systems/sbb-angular/issues/1079)
* **angular/search:** show the autocomplete shadow along the entire width ([#1082](https://github.com/sbb-design-systems/sbb-angular/issues/1082)) ([f3eeb6c](https://github.com/sbb-design-systems/sbb-angular/commit/f3eeb6c5b5949ccbdbfb81fa85f633e4efa3cfd1))
* **angular/styles:** remove `rem` unit from root line height ([#1072](https://github.com/sbb-design-systems/sbb-angular/issues/1072)) ([43d1de5](https://github.com/sbb-design-systems/sbb-angular/commit/43d1de5364d1185c0d7fd6af051ff243fa8e1a19))
* **angular/tooltip:** add dismissed output to tooltip wrapper ([#1062](https://github.com/sbb-design-systems/sbb-angular/issues/1062)) ([7b47fd2](https://github.com/sbb-design-systems/sbb-angular/commit/7b47fd2c8960d2edac030746a83ac6c01ed8a913)), closes [#1048](https://github.com/sbb-design-systems/sbb-angular/issues/1048) [#1055](https://github.com/sbb-design-systems/sbb-angular/issues/1055)
* **angular/tooltip:** emit opened event after open animation ([#1073](https://github.com/sbb-design-systems/sbb-angular/issues/1073)) ([0b54569](https://github.com/sbb-design-systems/sbb-angular/commit/0b5456964b65ef48df25b2dc1557ad599e111346))

## [13.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.1.0...13.2.0) (2022-01-20)


### Features

* **angular/tooltip:** add dismissed output ([#1055](https://github.com/sbb-design-systems/sbb-angular/issues/1055)) ([96e958e](https://github.com/sbb-design-systems/sbb-angular/commit/96e958e185756e8ba9cbbafda2fe9ffa7a54cce4)), closes [#1048](https://github.com/sbb-design-systems/sbb-angular/issues/1048)


### Bug Fixes

* **angular/autocomplete:** don't emit optionActivated event when option is reset ([#1043](https://github.com/sbb-design-systems/sbb-angular/issues/1043)) ([960c9b7](https://github.com/sbb-design-systems/sbb-angular/commit/960c9b7616667a04fbc85073b705c247641be53a))
* **angular/autocomplete:** don't handle enter events with modifier keys ([#1029](https://github.com/sbb-design-systems/sbb-angular/issues/1029)) ([657cdb3](https://github.com/sbb-design-systems/sbb-angular/commit/657cdb3ad3427562889e1a1d0378cd4546c8e79e))
* **angular/autocomplete:** optionSelections not emitting when the list of options changes ([#1033](https://github.com/sbb-design-systems/sbb-angular/issues/1033)) ([0421133](https://github.com/sbb-design-systems/sbb-angular/commit/042113351d88024449ae5896673555bf90a984f4))
* **angular/badge:** correctly apply badge description ([#1037](https://github.com/sbb-design-systems/sbb-angular/issues/1037)) ([3808f5b](https://github.com/sbb-design-systems/sbb-angular/commit/3808f5b29860c4aeefc6f5e55768cb650f6332a7))
* **angular/button:** align sbb-icon inside buttons ([#1024](https://github.com/sbb-design-systems/sbb-angular/issues/1024)) ([ee942d0](https://github.com/sbb-design-systems/sbb-angular/commit/ee942d097016187562dac6052ba8f78acc2ecbfe))
* **angular/chips:** declare that SbbChipInput.inputElement is always defined ([#1035](https://github.com/sbb-design-systems/sbb-angular/issues/1035)) ([1349319](https://github.com/sbb-design-systems/sbb-angular/commit/1349319cba3f16e5830c4020adfed3bdaa242b6a))
* **angular/core:** make SbbOption generic ([#1027](https://github.com/sbb-design-systems/sbb-angular/issues/1027)) ([f027f38](https://github.com/sbb-design-systems/sbb-angular/commit/f027f38981724ab2654845442d7a06ddb8ea28dc))
* **angular/datepicker:** allow activeElement to be found in Shadow DOM ([#1040](https://github.com/sbb-design-systems/sbb-angular/issues/1040)) ([e840c39](https://github.com/sbb-design-systems/sbb-angular/commit/e840c391dabba3794f7699db80701670374d88cd))
* **angular/icon:** make icon-registry compatible with Trusted Types ([#1044](https://github.com/sbb-design-systems/sbb-angular/issues/1044)) ([cd4487d](https://github.com/sbb-design-systems/sbb-angular/commit/cd4487da99a229532a1147bc7367bb6124e86736))
* **angular/menu:** not interrupting keyboard events to other overlays ([#1026](https://github.com/sbb-design-systems/sbb-angular/issues/1026)) ([f08d32b](https://github.com/sbb-design-systems/sbb-angular/commit/f08d32be50d9a3640b2d177361a57cc951384222))
* **angular/select:** component value not in sync with control value on init ([#1046](https://github.com/sbb-design-systems/sbb-angular/issues/1046)) ([cd5d233](https://github.com/sbb-design-systems/sbb-angular/commit/cd5d2333bcee07a79fd388dd575e8ef1f2f1ddba))
* **angular/sidebar:** implicit content element being registered twice with scroll dispatcher ([2620abc](https://github.com/sbb-design-systems/sbb-angular/commit/2620abcc063e3fc6310bbe0ffa96fe56bd5bf29a))
* **angular/sidebar:** restore focus with correct origin when closing via the backdrop ([#1042](https://github.com/sbb-design-systems/sbb-angular/issues/1042)) ([e591c57](https://github.com/sbb-design-systems/sbb-angular/commit/e591c5723f2a58cadaaa939ba93db04b5289b25d))
* **angular/table:** better handling of invalid data ([#1030](https://github.com/sbb-design-systems/sbb-angular/issues/1030)) ([5e978c6](https://github.com/sbb-design-systems/sbb-angular/commit/5e978c657ff8decc0f12ff69db39fc9c2db0ce84))
* **angular/tabs:** fix dynamicHeight animation in lean design ([#1051](https://github.com/sbb-design-systems/sbb-angular/issues/1051)) ([6d40699](https://github.com/sbb-design-systems/sbb-angular/commit/6d40699b95d2167fd5f1aecad2eed43ad5f7c8dd))
* **angular/tooltip:** fix displaying close icon if click trigger was used ([#1057](https://github.com/sbb-design-systems/sbb-angular/issues/1057)) ([60b05b2](https://github.com/sbb-design-systems/sbb-angular/commit/60b05b2daa3766daa4d78105245b8473fd315182))
* **angular/tooltip:** not closing if escape is pressed while trigger isn't focused ([#1034](https://github.com/sbb-design-systems/sbb-angular/issues/1034)) ([fae3eff](https://github.com/sbb-design-systems/sbb-angular/commit/fae3effdbea8ce6e2fc019f45624b3d958949988))


### Documentation

* **angular/tooltip:** fix tooltip example in tooltip.md ([#1049](https://github.com/sbb-design-systems/sbb-angular/issues/1049)) ([b600c22](https://github.com/sbb-design-systems/sbb-angular/commit/b600c22143be5b0a52601a0fc6e732d0c1845257))
* revise and expand a11y docs ([#1041](https://github.com/sbb-design-systems/sbb-angular/issues/1041)) ([fa7fd80](https://github.com/sbb-design-systems/sbb-angular/commit/fa7fd8096005f575605b0f0c71662bdf7c29ae33))
* **angular/button:** expand a11y section ([#1039](https://github.com/sbb-design-systems/sbb-angular/issues/1039)) ([31afe66](https://github.com/sbb-design-systems/sbb-angular/commit/31afe66bccb6a305453125142be1416b8b4ca00c))

## [13.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0...13.1.0) (2022-01-14)


### Features

* **angular/header:** add environment `local` with color `autumn` ([#1006](https://github.com/sbb-design-systems/sbb-angular/issues/1006)) ([55ac974](https://github.com/sbb-design-systems/sbb-angular/commit/55ac97478dfe0d5367cdab2775f502057a134204))


### Bug Fixes

* **angular:** fix styles and behavior of form inputs in readonly mode ([#1018](https://github.com/sbb-design-systems/sbb-angular/issues/1018)) ([c07b626](https://github.com/sbb-design-systems/sbb-angular/commit/c07b626a73bc7e7014e0ca0d0cecafda77fd9b4a)), closes [#916](https://github.com/sbb-design-systems/sbb-angular/issues/916) [#917](https://github.com/sbb-design-systems/sbb-angular/issues/917) [#918](https://github.com/sbb-design-systems/sbb-angular/issues/918)
* add aria-labels to nextDay and prevDay button ([#1015](https://github.com/sbb-design-systems/sbb-angular/issues/1015)) ([e540c8f](https://github.com/sbb-design-systems/sbb-angular/commit/e540c8fa85f2d83fdd920939d838c473cafe5fd5))
* **angular:** use css vars for transitions ([#1000](https://github.com/sbb-design-systems/sbb-angular/issues/1000)) ([0d24f42](https://github.com/sbb-design-systems/sbb-angular/commit/0d24f42537871dd89f05e0cabc105d9c3d54e6d3))
* **angular/autocomplete:** sync with components ([#1002](https://github.com/sbb-design-systems/sbb-angular/issues/1002)) ([af8b4eb](https://github.com/sbb-design-systems/sbb-angular/commit/af8b4eb72dcb1eed7a0c9f681d4c2d4774c0bb40))
* **angular/datepicker:** reset model of connected datepicker when datepicker value changes ([#1001](https://github.com/sbb-design-systems/sbb-angular/issues/1001)) ([df6db8f](https://github.com/sbb-design-systems/sbb-angular/commit/df6db8f55f84ad5ee684c88c60b5038e87c8d686)), closes [#993](https://github.com/sbb-design-systems/sbb-angular/issues/993)
* **angular/schematics:** remove file extensions in tilde migration ([#1008](https://github.com/sbb-design-systems/sbb-angular/issues/1008)) ([ba01867](https://github.com/sbb-design-systems/sbb-angular/commit/ba0186747b9e5e607fed8fb9706b51ed6722dbf1))
* **components-examples:** use takeUntil pattern for subscriptions ([#1005](https://github.com/sbb-design-systems/sbb-angular/issues/1005)) ([063145d](https://github.com/sbb-design-systems/sbb-angular/commit/063145d7df2bdfdb883f15b96649a0c9ebce3803))


### Documentation

* link old showcase and add how to update v13 ([#1017](https://github.com/sbb-design-systems/sbb-angular/issues/1017)) ([c2202a8](https://github.com/sbb-design-systems/sbb-angular/commit/c2202a8596722348ace1845eb7b1a5cbc1ca5a7a))
* **angular:** migrate leftover sbbButton usages to sbb-button ([#1016](https://github.com/sbb-design-systems/sbb-angular/issues/1016)) ([3f1c7b0](https://github.com/sbb-design-systems/sbb-angular/commit/3f1c7b0ac997daa43c745e3fe4956f8e9c7c7f65))
* add aria-label for chips drag and drop example ([#1014](https://github.com/sbb-design-systems/sbb-angular/issues/1014)) ([5f78494](https://github.com/sbb-design-systems/sbb-angular/commit/5f784944315ac1117c5cecc9881891125edac7e2))
* update license ([#1004](https://github.com/sbb-design-systems/sbb-angular/issues/1004)) ([9c5f47f](https://github.com/sbb-design-systems/sbb-angular/commit/9c5f47fb28a5b0ed8b9e6045b43fe47630db091d))

## [13.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0-rc.6...13.0.0) (2021-12-16)


### Bug Fixes

* fix takeUntil import in tooltip ([0ff7fbe](https://github.com/sbb-design-systems/sbb-angular/commit/0ff7fbe14fe34b90498d14e572ceaef5541b8bb1))

## [13.0.0-rc.6](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0-rc.5...13.0.0-rc.6) (2021-12-16)


### Bug Fixes

* fix import in i18n migration ([#997](https://github.com/sbb-design-systems/sbb-angular/issues/997)) ([67d1ee3](https://github.com/sbb-design-systems/sbb-angular/commit/67d1ee31997afe46d4c6abb58463c113380f4333))

## [13.0.0-rc.5](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0-rc.4...13.0.0-rc.5) (2021-12-16)


### Bug Fixes

* position of divider classes in typography ([#992](https://github.com/sbb-design-systems/sbb-angular/issues/992)) ([a213a4b](https://github.com/sbb-design-systems/sbb-angular/commit/a213a4b6249643ff98f9f9ae1206bf46d918465b))
* reduce space of buttons inside table cells ([#994](https://github.com/sbb-design-systems/sbb-angular/issues/994)) ([14d6885](https://github.com/sbb-design-systems/sbb-angular/commit/14d68857026e04e1f7f5efc3769eeace0600485f))


### Documentation

* **showcase:** show links to previous showcase versions ([#995](https://github.com/sbb-design-systems/sbb-angular/issues/995)) ([70a04eb](https://github.com/sbb-design-systems/sbb-angular/commit/70a04eb2e4faa1e23e9ea0615214de86ac4ff57b))

## [13.0.0-rc.4](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0-rc.3...13.0.0-rc.4) (2021-12-14)


### Features

* allow custom root in sbb-breadcrumbs ([#990](https://github.com/sbb-design-systems/sbb-angular/issues/990)) ([729f1de](https://github.com/sbb-design-systems/sbb-angular/commit/729f1de84023cea57212559bd76b7f682df15cba))
* provide dividers as css classes ([#984](https://github.com/sbb-design-systems/sbb-angular/issues/984)) ([ee48a22](https://github.com/sbb-design-systems/sbb-angular/commit/ee48a22a5f1199bd8dc4c4acc47846e16ac6e6c9))


### Bug Fixes

* create SbbCommonModule for initialization and sanity checks ([#986](https://github.com/sbb-design-systems/sbb-angular/issues/986)) ([70a7946](https://github.com/sbb-design-systems/sbb-angular/commit/70a79469aaf0f0504cc77072955de7713be26558))
* migrate i18n path in main.ts ([#983](https://github.com/sbb-design-systems/sbb-angular/issues/983)) ([e69e2e8](https://github.com/sbb-design-systems/sbb-angular/commit/e69e2e82d71a3e1815a39378f4443a0dad1c329c))


### Documentation

* explain icon usage in button ([#989](https://github.com/sbb-design-systems/sbb-angular/issues/989)) ([f77bdac](https://github.com/sbb-design-systems/sbb-angular/commit/f77bdac2b191cfe0b166457866b4f659f789489e))

## [13.0.0-rc.3](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0-rc.2...13.0.0-rc.3) (2021-12-09)


### Features

* add opened output to tooltip ([#979](https://github.com/sbb-design-systems/sbb-angular/issues/979)) ([c6797fb](https://github.com/sbb-design-systems/sbb-angular/commit/c6797fb6b6428bedca7109872a953b9c8b1ece7e))
* switch to css properties/:is/:where usage ([#890](https://github.com/sbb-design-systems/sbb-angular/issues/890)) ([df19c86](https://github.com/sbb-design-systems/sbb-angular/commit/df19c865d9c4f410b345c7d00b8ac8c09fdd8046)), closes [#926](https://github.com/sbb-design-systems/sbb-angular/issues/926) [#515](https://github.com/sbb-design-systems/sbb-angular/issues/515)


### Bug Fixes

* avoid closing tooltip on clipping parent container ([#972](https://github.com/sbb-design-systems/sbb-angular/issues/972)) ([38329bb](https://github.com/sbb-design-systems/sbb-angular/commit/38329bb061c470ac9c24442210666d2be52b23cb))
* remove height of autocomplete overlay if not visible ([#967](https://github.com/sbb-design-systems/sbb-angular/issues/967)) ([16834e7](https://github.com/sbb-design-systems/sbb-angular/commit/16834e7930ae2446cb3effa5803cfd80e4e77b78))
* **showcase:** fix stackblitz i18n and RouterModule ([#936](https://github.com/sbb-design-systems/sbb-angular/issues/936)) ([211f1bc](https://github.com/sbb-design-systems/sbb-angular/commit/211f1bc1893303b7820773bd40f625ba6e0e9ff1))


### Documentation

* add documentation for TemplateRef usage for tooltip ([#981](https://github.com/sbb-design-systems/sbb-angular/issues/981)) ([0f047e4](https://github.com/sbb-design-systems/sbb-angular/commit/0f047e4fe1c2de8b52950d22459905e28f85ab7d))
* recommend WSL2 for developer setup on Windows ([#944](https://github.com/sbb-design-systems/sbb-angular/issues/944)) ([8a558d7](https://github.com/sbb-design-systems/sbb-angular/commit/8a558d7b89658b2d8fc97a52638b977d6d08482b))

## [13.0.0-rc.2](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0-rc.1...13.0.0-rc.2) (2021-11-24)


### Bug Fixes

* fix undefined property access in checkbox panel merge migration ([#933](https://github.com/sbb-design-systems/sbb-angular/issues/933)) ([22acdbf](https://github.com/sbb-design-systems/sbb-angular/commit/22acdbf4a8c974165c60e63c85424f661f078c89))

## [13.0.0-rc.1](https://github.com/sbb-design-systems/sbb-angular/compare/13.0.0-rc.0...13.0.0-rc.1) (2021-11-23)


### Bug Fixes

* add description input for sort-header ([#927](https://github.com/sbb-design-systems/sbb-angular/issues/927)) ([7a9e48c](https://github.com/sbb-design-systems/sbb-angular/commit/7a9e48c44bcb40138a5ea497e2c2dba43e5f1544))
* ensure adding menu module does not break migration ([#932](https://github.com/sbb-design-systems/sbb-angular/issues/932)) ([b1fc408](https://github.com/sbb-design-systems/sbb-angular/commit/b1fc408aa5b3a97a419935c6d9b229e7c5332755))
* syntax error due to ES2020 being used for ng-add with NodeJS 12.x ([#924](https://github.com/sbb-design-systems/sbb-angular/issues/924)) ([4f7111a](https://github.com/sbb-design-systems/sbb-angular/commit/4f7111abe88c07e37f7e9c07fe22d47ff5544771))

## [13.0.0-rc.0](https://github.com/sbb-design-systems/sbb-angular/compare/12.4.0...13.0.0-rc.0) (2021-11-12)


### ⚠ BREAKING CHANGES

* Update to Angular 13 and switch to Ivy distribution format. The ViewEngine format is no longer supported.
* The packages `@sbb-esta/angular-business`, `@sbb-esta/angular-core` and `@sbb-esta/angular-public` have been replaced
  with the new package `@sbb-esta/angular`. See our new [showcase](https://angular-next.app.sbb.ch), our
  [update guide](https://angular-next.app.sbb.ch/howtoupdate) and our [migration guide](https://angular-next.app.sbb.ch/angular/guides/migration-guide)
  on how to use or upgrade to our new library.
* The deprecated packages `@sbb-esta/angular-icons` and `@sbb-esta/angular-keycloak` have been removed.

### Features

* update to rxjs 7 ([#909](https://github.com/sbb-design-systems/sbb-angular/issues/909)) ([96b8ab2](https://github.com/sbb-design-systems/sbb-angular/commit/96b8ab2a96729ffb7c8716b5aaeeb90105a51d2b))


### Bug Fixes

* **showcase:** avoid blue button color on iOS 15 ([#884](https://github.com/sbb-design-systems/sbb-angular/issues/884)) ([4ae263a](https://github.com/sbb-design-systems/sbb-angular/commit/4ae263a11583633f14ffe595f7a8f72b796ba7c4))


### build

* update to Angular v13 and Bazel nodejs rules v4.3 ([#901](https://github.com/sbb-design-systems/sbb-angular/issues/901)) ([c8f0f0b](https://github.com/sbb-design-systems/sbb-angular/commit/c8f0f0b1213dec8075079ba0e34a8893653e2ae9))


### Documentation

* **angular:** update general docs ([#923](https://github.com/sbb-design-systems/sbb-angular/issues/923)) ([e16640f](https://github.com/sbb-design-systems/sbb-angular/commit/e16640f5ffe3f87520a740761ffe3817e99cfd96))
* add link to security advisory for GitHub Actions ([#894](https://github.com/sbb-design-systems/sbb-angular/issues/894)) ([6b0fff1](https://github.com/sbb-design-systems/sbb-angular/commit/6b0fff15e2d37c28ad674579615d63f1c0f6dbbd))

## [12.4.0](https://github.com/sbb-design-systems/sbb-angular/compare/12.3.0...12.4.0) (2021-09-09)


### Features

* **maps:** updated to ESRI arcgis-core v4.20.2 ([#872](https://github.com/sbb-design-systems/sbb-angular/issues/872)) ([e1f08f9](https://github.com/sbb-design-systems/sbb-angular/commit/e1f08f98fd14c61118d90b7a0f2e76b29b9d2693))


### Bug Fixes

* don't reset height for sbb-textarea ([#867](https://github.com/sbb-design-systems/sbb-angular/issues/867)) ([185d9f9](https://github.com/sbb-design-systems/sbb-angular/commit/185d9f9a31cb9113ea333dee663633c439a4006b)), closes [#862](https://github.com/sbb-design-systems/sbb-angular/issues/862)
* ensure correct font-family ([#877](https://github.com/sbb-design-systems/sbb-angular/issues/877)) ([a60c155](https://github.com/sbb-design-systems/sbb-angular/commit/a60c1559aa545f5f165ab65b7dd9684bab8752ab))
* **business:** adapt readonly input business style ([#876](https://github.com/sbb-design-systems/sbb-angular/issues/876)) ([3e5841a](https://github.com/sbb-design-systems/sbb-angular/commit/3e5841a878bed90378bcd016c61eef3bbd213548))
* use correct sizing for input fields ([#875](https://github.com/sbb-design-systems/sbb-angular/issues/875)) ([1d65a09](https://github.com/sbb-design-systems/sbb-angular/commit/1d65a0927de94e9aebc015217ab56abbd9f81da6))
* **business:** apply placeholder color of select to ellipsis ([#871](https://github.com/sbb-design-systems/sbb-angular/issues/871)) ([b9a9eae](https://github.com/sbb-design-systems/sbb-angular/commit/b9a9eae49cd2514dc42da2d55fab9d77df7fb325))
* display header menu trigger in appropriate circumstances ([#870](https://github.com/sbb-design-systems/sbb-angular/issues/870)) ([2c25457](https://github.com/sbb-design-systems/sbb-angular/commit/2c25457b90fefcf618451de88c2e22650d44198e))
* **business:** fix placeholder color of select ([#864](https://github.com/sbb-design-systems/sbb-angular/issues/864)) ([c5af48a](https://github.com/sbb-design-systems/sbb-angular/commit/c5af48aa331ddb8f0626479b236642087f189fb5)), closes [#863](https://github.com/sbb-design-systems/sbb-angular/issues/863)
* resize textarea correctly on content pasting ([#856](https://github.com/sbb-design-systems/sbb-angular/issues/856)) ([84818da](https://github.com/sbb-design-systems/sbb-angular/commit/84818da808c98b8dadcae0472909acdd2cb563ae)), closes [#855](https://github.com/sbb-design-systems/sbb-angular/issues/855)

## [12.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/12.2.1...12.3.0) (2021-07-29)


### Features

* add css class for normal error flow inside sbb-form-field ([#853](https://github.com/sbb-design-systems/sbb-angular/issues/853)) ([9f8dd4a](https://github.com/sbb-design-systems/sbb-angular/commit/9f8dd4a751ea8e75e2bb2eea68007972cc098e8f))

### [12.2.1](https://github.com/sbb-design-systems/sbb-angular/compare/12.2.0...12.2.1) (2021-07-15)


### Bug Fixes

* allow custom tabindex on expansion panel header ([#839](https://github.com/sbb-design-systems/sbb-angular/issues/839)) ([f8700b8](https://github.com/sbb-design-systems/sbb-angular/commit/f8700b8242399738bc1f0e79c40c22a255806f46))
* display large numbers in pagination correctly ([#837](https://github.com/sbb-design-systems/sbb-angular/issues/837)) ([2cfb12a](https://github.com/sbb-design-systems/sbb-angular/commit/2cfb12a8a8d78bd153e5ec2507014b0f88e91f1f)), closes [#435](https://github.com/sbb-design-systems/sbb-angular/issues/435)

## [12.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/12.1.0...12.2.0) (2021-06-17)


### Features

* **core:** implement SBB i18n patch for locales ([#823](https://github.com/sbb-design-systems/sbb-angular/issues/823)) ([3492f69](https://github.com/sbb-design-systems/sbb-angular/commit/3492f69a90903c3a7a6dcc2c553b2371fca7a00d))


### Documentation

* add known issues section to autocomplete ([#826](https://github.com/sbb-design-systems/sbb-angular/issues/826)) ([a8e31ea](https://github.com/sbb-design-systems/sbb-angular/commit/a8e31ea29a92b27fd4ed92967b506b4d39b7b59e)), closes [#824](https://github.com/sbb-design-systems/sbb-angular/issues/824)
* **business:** remove inexistent sbbDialog directive from dialog docu ([#822](https://github.com/sbb-design-systems/sbb-angular/issues/822)) ([fdfc841](https://github.com/sbb-design-systems/sbb-angular/commit/fdfc841d8e9d798b06c2f168f2de8c99fe40fe2a))

## [12.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/12.0.1...12.1.0) (2021-06-03)


### ⚠ BREAKING CHANGES

* **maps:** esri-loader is replaced with @arcgis/core as a
peer dependency for @sbb-esta/angular-maps and usage has been
updated accordingly.

### Bug Fixes

* fix import errors if using primary imports ([#820](https://github.com/sbb-design-systems/sbb-angular/issues/820)) ([c847253](https://github.com/sbb-design-systems/sbb-angular/commit/c84725300afb95c2a88378bdc424c63f1a482edb))


* **maps:** replacing the esri-loader with @arcgis/core ES-module ([#819](https://github.com/sbb-design-systems/sbb-angular/issues/819)) ([126118d](https://github.com/sbb-design-systems/sbb-angular/commit/126118d8e8e63d780266313ef6e99142c869da8d))

### [12.0.1](https://github.com/sbb-design-systems/sbb-angular/compare/12.0.0...12.0.1) (2021-05-19)


### Bug Fixes

* **business:** avoid inlining SbbHeader reference ([#811](https://github.com/sbb-design-systems/sbb-angular/issues/811)) ([44568a5](https://github.com/sbb-design-systems/sbb-angular/commit/44568a58637600703b90cce19240771430182497))

## [12.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/12.0.0-next.2...12.0.0) (2021-05-19)

## [12.0.0-next.2](https://github.com/sbb-design-systems/sbb-angular/compare/12.0.0-next.1...12.0.0-next.2) (2021-05-19)


### Bug Fixes

* remove call to ng-add schematic of angular-core ([#809](https://github.com/sbb-design-systems/sbb-angular/issues/809)) ([2387f2d](https://github.com/sbb-design-systems/sbb-angular/commit/2387f2d8b48712d47c91962495e62783bf756bc0))

## [12.0.0-next.1](https://github.com/sbb-design-systems/sbb-angular/compare/12.0.0-next.0...12.0.0-next.1) (2021-05-19)


### Bug Fixes

* use correct version range for @angular/cdk ([#808](https://github.com/sbb-design-systems/sbb-angular/issues/808)) ([0625618](https://github.com/sbb-design-systems/sbb-angular/commit/062561882dc6d0002fa71d9db02196e88316332d))


## [12.0.0-next.0](https://github.com/sbb-design-systems/sbb-angular/compare/11.2.0...12.0.0-next.0) (2021-05-18)


### ⚠ BREAKING CHANGES

* **core:** We have removed the SBB_ICON_REGISTRY_PROVIDER provider
and the icon-cdn-provider schematics in favor of icon resolvers. See the icon documentation
for detail. This will be fixed in a migration via `ng update`.
* Update to Angular 12 and removed deprecated symbols/properties/methods

### Features

* **core:** add icon resolver ([#806](https://github.com/sbb-design-systems/sbb-angular/issues/806)) ([b431f82](https://github.com/sbb-design-systems/sbb-angular/commit/b431f8259ead6bac60ea13c7846d8e3c93c53f0f))


### Bug Fixes

* **business:** avoid metadata inlining for the header ([#803](https://github.com/sbb-design-systems/sbb-angular/issues/803)) ([e4f2572](https://github.com/sbb-design-systems/sbb-angular/commit/e4f2572a98207688e464f7903906cf503095cdc3)), closes [#798](https://github.com/sbb-design-systems/sbb-angular/issues/798)


### Refactor

* update packages ([#804](https://github.com/sbb-design-systems/sbb-angular/issues/804)) ([8e8a608](https://github.com/sbb-design-systems/sbb-angular/commit/8e8a6080270d978ff1a93b09ca3bc31312d2950f))

## [11.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/11.1.4...11.2.0) (2021-05-05)


### Features

* autocomplete panel can be set to visible if only hints exist ([#785](https://github.com/sbb-design-systems/sbb-angular/issues/785)) ([5e7db7f](https://github.com/sbb-design-systems/sbb-angular/commit/5e7db7fb6c2b98ead071cc50c711d8990097214a))


### Bug Fixes

* **business:** prevent submit event in chips when pressing enter with content ([#799](https://github.com/sbb-design-systems/sbb-angular/issues/799)) ([b79870e](https://github.com/sbb-design-systems/sbb-angular/commit/b79870e7a2dd5e4d81e1f2927e5abc6e99650968))
* ignore non letter characters in initial letters of usermenu ([#796](https://github.com/sbb-design-systems/sbb-angular/issues/796)) ([4111663](https://github.com/sbb-design-systems/sbb-angular/commit/4111663bd64e4e4d8dd8a98f8d0d339f25450dc6))
* **business:** hide sidebar scrollbar on iOS devices ([#794](https://github.com/sbb-design-systems/sbb-angular/issues/794)) ([481bdf8](https://github.com/sbb-design-systems/sbb-angular/commit/481bdf89d4428c1c444642b78dab65951f64b1a2))
* **business:** update SbbTableDataSource data on disconnected state ([#789](https://github.com/sbb-design-systems/sbb-angular/issues/789)) ([40d895a](https://github.com/sbb-design-systems/sbb-angular/commit/40d895a25ad1af22ecb2ed16319564f33caf7af8))
* apply error styles based on the error state of the form field ([#781](https://github.com/sbb-design-systems/sbb-angular/issues/781)) ([76fb4e8](https://github.com/sbb-design-systems/sbb-angular/commit/76fb4e8d9308932cb4431a4b8547557c71153093))
* optimize input element and select styles ([#787](https://github.com/sbb-design-systems/sbb-angular/issues/787)) ([0aa269c](https://github.com/sbb-design-systems/sbb-angular/commit/0aa269c385a17c72fec5e4e1f9a34b4668b675c7))
* use correct interpolation for it-CH XLIFF 2.0 ([#788](https://github.com/sbb-design-systems/sbb-angular/issues/788)) ([488b2ce](https://github.com/sbb-design-systems/sbb-angular/commit/488b2ced18c3b9693ba5c6add7d6dfcbe4758bea))

### [11.1.4](https://github.com/sbb-design-systems/sbb-angular/compare/11.1.3...11.1.4) (2021-03-31)


### Bug Fixes

* update xlf files to fix interpolated entries ([#772](https://github.com/sbb-design-systems/sbb-angular/issues/772)) ([68118c7](https://github.com/sbb-design-systems/sbb-angular/commit/68118c751660ff71e4173c4b6eb775aefabcf19f))
* **business:** sbb header environment label on top of hamburger menu ([#770](https://github.com/sbb-design-systems/sbb-angular/issues/770)) ([d6cbd9b](https://github.com/sbb-design-systems/sbb-angular/commit/d6cbd9be319d9983487d47d04d72a06a792faa27))


### Documentation

* display lists in showcase typography correctly ([#773](https://github.com/sbb-design-systems/sbb-angular/issues/773)) ([0b930d1](https://github.com/sbb-design-systems/sbb-angular/commit/0b930d101e29e2485419baccbe928d5ca11c8440))

### [11.1.3](https://github.com/sbb-design-systems/sbb-angular/compare/11.1.2...11.1.3) (2021-03-23)

### [11.1.2](https://github.com/sbb-design-systems/sbb-angular/compare/11.1.1...11.1.2) (2021-03-23)


### Bug Fixes

* add type button to buttons ([#763](https://github.com/sbb-design-systems/sbb-angular/issues/763)) ([fd14722](https://github.com/sbb-design-systems/sbb-angular/commit/fd1472271a3d9fc4f0eea3bcd97c9394fcf8b8e9))
* display placeholder attribute when using sbbInput directive ([#749](https://github.com/sbb-design-systems/sbb-angular/issues/749)) ([f3953a0](https://github.com/sbb-design-systems/sbb-angular/commit/f3953a01ceb9791312082d720307fb3d7b4e26c4))
* hide content of nested accordion in collapsed state ([#759](https://github.com/sbb-design-systems/sbb-angular/issues/759)) ([80799a5](https://github.com/sbb-design-systems/sbb-angular/commit/80799a578ebc6b288148ac4dc2fa792e1bd3be17)), closes [#758](https://github.com/sbb-design-systems/sbb-angular/issues/758)
* initially set form-field mode based on classes ([#764](https://github.com/sbb-design-systems/sbb-angular/issues/764)) ([5494c21](https://github.com/sbb-design-systems/sbb-angular/commit/5494c21342302fcb288ab33d9164aa29fb0f566c))
* keep accordion panel height if expand icon is hidden ([#760](https://github.com/sbb-design-systems/sbb-angular/issues/760)) ([7fef33d](https://github.com/sbb-design-systems/sbb-angular/commit/7fef33df3d55c75f768f5a37e9db558b68ab4f09)), closes [#666](https://github.com/sbb-design-systems/sbb-angular/issues/666)
* prevent re-creation of existing tab instances on (redundant) activation of active tab ([#746](https://github.com/sbb-design-systems/sbb-angular/issues/746)) ([1af37bf](https://github.com/sbb-design-systems/sbb-angular/commit/1af37bffb8fbc404dfa112befc8a3f0c12a227fb)), closes [#638](https://github.com/sbb-design-systems/sbb-angular/issues/638)


### Documentation

* correct typo 'see below' to 'seen below' ([#762](https://github.com/sbb-design-systems/sbb-angular/issues/762)) ([f09b115](https://github.com/sbb-design-systems/sbb-angular/commit/f09b115e2424cc30b00e9b3b3b723f0161fb2a5b))
* **maps:** specifiy esri-loader version to use ([#751](https://github.com/sbb-design-systems/sbb-angular/issues/751)) ([a84c907](https://github.com/sbb-design-systems/sbb-angular/commit/a84c907af06c97d2b81c837557d43e9c74a1ecc9))

### [11.1.1](https://github.com/sbb-design-systems/sbb-angular/compare/11.1.0...11.1.1) (2021-03-03)


### Bug Fixes

* **business:** avoid Expression has changed error for menus collapsed state ([#744](https://github.com/sbb-design-systems/sbb-angular/issues/744)) ([d168f96](https://github.com/sbb-design-systems/sbb-angular/commit/d168f96f2c3511246458b557f42e9bf2286d3437))

## [11.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/11.0.3...11.1.0) (2021-02-26)


### Features

* **business:** add flexible mode and environment element for header ([#733](https://github.com/sbb-design-systems/sbb-angular/issues/733)) ([15c2682](https://github.com/sbb-design-systems/sbb-angular/commit/15c2682082c4fbe774b2f3d7c949eb2c7629c483)), closes [#361](https://github.com/sbb-design-systems/sbb-angular/issues/361)


### Bug Fixes

* align icon in notifications on top ([#727](https://github.com/sbb-design-systems/sbb-angular/issues/727)) ([17491bc](https://github.com/sbb-design-systems/sbb-angular/commit/17491bcd2e63da386c1dea940e37ef4d9998ce54)), closes [#725](https://github.com/sbb-design-systems/sbb-angular/issues/725)
* allow sbb-processflow to be initialized asynchronous ([#740](https://github.com/sbb-design-systems/sbb-angular/issues/740)) ([dc0d643](https://github.com/sbb-design-systems/sbb-angular/commit/dc0d64375f596894ead18e9323779ab467c60049)), closes [#738](https://github.com/sbb-design-systems/sbb-angular/issues/738)
* breadcrumb check fails due lifecycle issue ([#708](https://github.com/sbb-design-systems/sbb-angular/issues/708)) ([6132b97](https://github.com/sbb-design-systems/sbb-angular/commit/6132b975e3ab45c49ffd28583b3b72433f4619f3)), closes [#705](https://github.com/sbb-design-systems/sbb-angular/issues/705)
* fix ribbon color of sbb-header ([#704](https://github.com/sbb-design-systems/sbb-angular/issues/704)) ([2b2f3dd](https://github.com/sbb-design-systems/sbb-angular/commit/2b2f3ddbd16668eaa04f90b5ebbf501161547653))
* remove positioning fix for tick ([#739](https://github.com/sbb-design-systems/sbb-angular/issues/739)) ([5b22c71](https://github.com/sbb-design-systems/sbb-angular/commit/5b22c71c08fb5ce8d2d5692e118758ecef5c0e2b))
* reserve space for environment in header ([#732](https://github.com/sbb-design-systems/sbb-angular/issues/732)) ([ac8b2d9](https://github.com/sbb-design-systems/sbb-angular/commit/ac8b2d9d3c89dd90f8e5bd60e85c9e388eb9109c)), closes [#707](https://github.com/sbb-design-systems/sbb-angular/issues/707) [#724](https://github.com/sbb-design-systems/sbb-angular/issues/724)
* scroll to active option in autocomplete and select ([#741](https://github.com/sbb-design-systems/sbb-angular/issues/741)) ([1d30dda](https://github.com/sbb-design-systems/sbb-angular/commit/1d30dda7096212d783e5864d7a3eb29f03a780d5)), closes [#723](https://github.com/sbb-design-systems/sbb-angular/issues/723)
* **business:** fix context menu focus color ([#730](https://github.com/sbb-design-systems/sbb-angular/issues/730)) ([4a6bf72](https://github.com/sbb-design-systems/sbb-angular/commit/4a6bf720ab615ba87892aec18c946018e2a1eb80))


### Documentation

* fix sbb-radio-button-panel non label examples ([#709](https://github.com/sbb-design-systems/sbb-angular/issues/709)) ([72685c5](https://github.com/sbb-design-systems/sbb-angular/commit/72685c52e053e1a3e8feed67fc762e59fe71fa67))

### [11.0.3](https://github.com/sbb-design-systems/sbb-angular/compare/11.0.2...11.0.3) (2021-01-06)


### Bug Fixes

* **public:** fix autocomplete accessibility and shadow DOM usage of sbb-search ([#692](https://github.com/sbb-design-systems/sbb-angular/issues/692)) ([6e86a98](https://github.com/sbb-design-systems/sbb-angular/commit/6e86a9811c7d66fe65d7a6c2fc17dbaa5f9576db))
* **showcase:** remove obsolete code in sbb-expansion-panel example ([#696](https://github.com/sbb-design-systems/sbb-angular/issues/696)) ([855b416](https://github.com/sbb-design-systems/sbb-angular/commit/855b416faeb916968ff4acfcc3a17d343181a543))
* allow shadow DOM usage of sbb-dropdown ([#690](https://github.com/sbb-design-systems/sbb-angular/issues/690)) ([9c5c93c](https://github.com/sbb-design-systems/sbb-angular/commit/9c5c93cb5a5c90323bd2104d9da578988c84a454))
* allow shadow DOM usage of sbb-tooltip ([#694](https://github.com/sbb-design-systems/sbb-angular/issues/694)) ([d5129f5](https://github.com/sbb-design-systems/sbb-angular/commit/d5129f5107d4f2b56194bb437e925a11b052bc44))

### [11.0.2](https://github.com/sbb-design-systems/sbb-angular/compare/11.0.1...11.0.2) (2020-12-10)


### Bug Fixes

* allow sticky elements in expansion panel content ([#682](https://github.com/sbb-design-systems/sbb-angular/issues/682)) ([5b007bd](https://github.com/sbb-design-systems/sbb-angular/commit/5b007bdd4b8bf39c7049c42f07510bec506b300b)), closes [#620](https://github.com/sbb-design-systems/sbb-angular/issues/620)
* prevent closing tooltip on outside mouseup ([#683](https://github.com/sbb-design-systems/sbb-angular/issues/683)) ([884b800](https://github.com/sbb-design-systems/sbb-angular/commit/884b8005c3daa08c329b2acb61c9c7b5ee58e19a)), closes [#579](https://github.com/sbb-design-systems/sbb-angular/issues/579)


### Documentation

* **showcase:** fix spelling and order of component categories ([#685](https://github.com/sbb-design-systems/sbb-angular/issues/685)) ([6316ec8](https://github.com/sbb-design-systems/sbb-angular/commit/6316ec8bd077e2d23f1ed9192f852940f2f149b0))

### [11.0.1](https://github.com/sbb-design-systems/sbb-angular/compare/11.0.0...11.0.1) (2020-12-04)


### Bug Fixes

* **showcase:** fix StackBlitz setup ([#680](https://github.com/sbb-design-systems/sbb-angular/issues/680)) ([efee77b](https://github.com/sbb-design-systems/sbb-angular/commit/efee77bf17791a370cb037f8c6cb9ee23bdf4f19))

## [11.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/11.0.0-next.2...11.0.0) (2020-12-03)


### Features

* **business:** business styles for processflow ([#676](https://github.com/sbb-design-systems/sbb-angular/issues/676)) ([061b7c2](https://github.com/sbb-design-systems/sbb-angular/commit/061b7c222c44a41b307e19d2238c43536f2edad4)), closes [#669](https://github.com/sbb-design-systems/sbb-angular/issues/669)


### Bug Fixes

* **showcase:** fix resolving of example files with uppercase letters ([#679](https://github.com/sbb-design-systems/sbb-angular/issues/679)) ([2e9727c](https://github.com/sbb-design-systems/sbb-angular/commit/2e9727c573961bfc5b765621f07c509515b03157))


### Documentation

* add guide to implement custom form field controls ([#678](https://github.com/sbb-design-systems/sbb-angular/issues/678)) ([92d1dcd](https://github.com/sbb-design-systems/sbb-angular/commit/92d1dcdad42706992359fa07193878ebebd1c02a))

## [11.0.0-next.2](https://github.com/sbb-design-systems/sbb-angular/compare/11.0.0-next.1...11.0.0-next.2) (2020-12-02)


### Bug Fixes

* add warning in migration for form-field control requirement ([#673](https://github.com/sbb-design-systems/sbb-angular/issues/673)) ([a82dbce](https://github.com/sbb-design-systems/sbb-angular/commit/a82dbcee0cfcb4c9062fcd51563ff879bc811c1e))
* correctly reference cdk mixin ([#675](https://github.com/sbb-design-systems/sbb-angular/issues/675)) ([be9c9c5](https://github.com/sbb-design-systems/sbb-angular/commit/be9c9c5f995bd964ed15901e064334344bbba983))
* correctly rename FormFieldControl to SbbFormFieldControl ([#672](https://github.com/sbb-design-systems/sbb-angular/issues/672)) ([6025af3](https://github.com/sbb-design-systems/sbb-angular/commit/6025af355bb3dc3a5402e674f928a210016f7fd5))
* sbb-textarea css bleeding and padding ([#674](https://github.com/sbb-design-systems/sbb-angular/issues/674)) ([3bb8b10](https://github.com/sbb-design-systems/sbb-angular/commit/3bb8b10086b2cb98984a42c9a7c6e1e557644bf9)), closes [#667](https://github.com/sbb-design-systems/sbb-angular/issues/667)

## [11.0.0-next.1](https://github.com/sbb-design-systems/sbb-angular/compare/11.0.0-next.0...11.0.0-next.1) (2020-12-02)


### ⚠ BREAKING CHANGES

* **business:** css classes of business link were renamed.
`.sbb-link-normal` was renamed to `.sbb-link-business-normal`.
`.sbb-link-stretch` was renamed to `.sbb-link-business-stretch`.

### Bug Fixes

* **business:** fix badge 4k styles ([#663](https://github.com/sbb-design-systems/sbb-angular/issues/663)) ([ed54b5b](https://github.com/sbb-design-systems/sbb-angular/commit/ed54b5b57e6f77ab9453695c3db64d6585929823))
* **business:** fix link stretch mode and adapt css classes ([#655](https://github.com/sbb-design-systems/sbb-angular/issues/655)) ([9f3cc79](https://github.com/sbb-design-systems/sbb-angular/commit/9f3cc7987ca499253d8ba42f5241d011a8ec5324))
* **core:** aggregate migration logs ([#653](https://github.com/sbb-design-systems/sbb-angular/issues/653)) ([59a19f2](https://github.com/sbb-design-systems/sbb-angular/commit/59a19f239b9ef5f4d03bc972c14e47cffb399107))
* **public:** close autocomplete panel when starting a search ([#664](https://github.com/sbb-design-systems/sbb-angular/issues/664)) ([70e04cd](https://github.com/sbb-design-systems/sbb-angular/commit/70e04cdc0ff4396b25ad7cb4999dc283a4fd003d)), closes [#645](https://github.com/sbb-design-systems/sbb-angular/issues/645)
* **public:** fix 4k and 5k styles of link ([#662](https://github.com/sbb-design-systems/sbb-angular/issues/662)) ([72d525b](https://github.com/sbb-design-systems/sbb-angular/commit/72d525b9fff3b755ee7dc7fe72f8a8d539f783bf))
* **public:** fix 4k styles of toggle ([#660](https://github.com/sbb-design-systems/sbb-angular/issues/660)) ([83d8242](https://github.com/sbb-design-systems/sbb-angular/commit/83d8242dd87dbefc54f017cd9db7648d103aa895))
* **showcase:** fix various minor showcases issues ([#654](https://github.com/sbb-design-systems/sbb-angular/issues/654)) ([a806e46](https://github.com/sbb-design-systems/sbb-angular/commit/a806e46714406e0915c036cb36799b4ae3fb831a))
* **showcase:** use specific version for StackBlitz dependencies ([#665](https://github.com/sbb-design-systems/sbb-angular/issues/665)) ([6106f58](https://github.com/sbb-design-systems/sbb-angular/commit/6106f5869817c7c642be81f0c8a49140197fe049))
* correct style offset of select tick in 4k and 5k resolution ([#657](https://github.com/sbb-design-systems/sbb-angular/issues/657)) ([e6187ce](https://github.com/sbb-design-systems/sbb-angular/commit/e6187ceb97984e9e3a4eed7f0810cb26ce26facb))
* fix style offset of panel divider line in 4k resolution (select, autocomplete) ([#658](https://github.com/sbb-design-systems/sbb-angular/issues/658)) ([cc091fa](https://github.com/sbb-design-systems/sbb-angular/commit/cc091fa9f9b1f9c11e98f288b0be3a591427a385))
* patch migration file resolver if necessary ([#659](https://github.com/sbb-design-systems/sbb-angular/issues/659)) ([0aa1c0a](https://github.com/sbb-design-systems/sbb-angular/commit/0aa1c0a697a5a15b75633e79a4b398aebb6f4ba5))
* set sbb-radio-button in inherited classes instead of base class ([#656](https://github.com/sbb-design-systems/sbb-angular/issues/656)) ([b249114](https://github.com/sbb-design-systems/sbb-angular/commit/b24911454ea272436552fa771c5759b37353e75e))

## [11.0.0-next.0](https://github.com/sbb-design-systems/sbb-angular/compare/10.3.1...11.0.0-next.0) (2020-11-26)


### ⚠ BREAKING CHANGES

* Upgrade to Angular v11
* We are removing internal properties and prefixing them
with _, if removing is not possible. These were never intended to be used by
consumers, however if you depended on these for some reason, reach out to us.
* The usermenu module has been refactored. The `<sbb-usermenu>` now
considers both `displayName` and `userName` to set logged in state (you have to set at minimum
one of both).
The `userName` is not shown anymore in collapsed state of menu (according to digital.sbb.ch). Use
`displayName` to show a name in collapsed state.
The usermenu doesn't depend on `<sbb-dropdown>` anymore, just use `<a sbb-usermenu-item>`,
`<button type="button" sbb-usermenu-item>` and `<hr />` tags.
Providing a custom icon or image now needs to set the structural `*sbbIcon` directive instead of
using only `sbbIcon`.
* The field module has been majorly refactored. The `sbb-field`
has been renamed to `sbb-form-field` and now requires a compatible form control
(`<input sbbInput ...>`, `<select sbbInput ...>`, `<textarea sbbInput>`, `<sbb-select>`).
The `sbb-form-field` [mode] input has been deprecated and replaced with appropriate
css classes (`.sbb-form-field-short`, `.sbb-form-field-medium` and `.sbb-form-field-long`).
The `sbb-form-error` has been renamed to `sbb-error`.
The `sbb-label` [for] input has been deprecated, as it is no longer in use, as that
functionality is handled internally inside `sbb-form-field`.
The `sbb-form-field` now has a default width, which is consistent for all supported
form controls.
* The tooltip changes the css display property of the tooltip trigger
from block to inline-block.
If you still like to use the block variant, use the following css definition:
`.sbb-tooltip-trigger { display: block; }`.
* The link component removes the margin around the public variant of sbbLink.
If you want to retain the margin, it is `margin: 1em 0 2em;`.
* We are removing the social link, since the icon CDN does not
contain the social icons and the social link had no usage.
* In order to fulfill new requirements of the `sbb-toggle`, the component internal DOM structure and css class usage has been changed. Please check your code if you have overwritten certain css styles.

### Features

* improve form-field functionality ([#635](https://github.com/sbb-design-systems/sbb-angular/issues/635)) ([da7a80b](https://github.com/sbb-design-systems/sbb-angular/commit/da7a80b9541b1fe88f0ca1ceb8db6a04a3df0e76)), closes [#160](https://github.com/sbb-design-systems/sbb-angular/issues/160) [#489](https://github.com/sbb-design-systems/sbb-angular/issues/489)
* provide translations for german, french and italian ([#649](https://github.com/sbb-design-systems/sbb-angular/issues/649)) ([855ca33](https://github.com/sbb-design-systems/sbb-angular/commit/855ca3332b197a6cc3d02ca40e21015c3444aebe)), closes [#114](https://github.com/sbb-design-systems/sbb-angular/issues/114)
* **showcase:** add StackBlitz button to examples ([#593](https://github.com/sbb-design-systems/sbb-angular/issues/593)) ([6dfc1cd](https://github.com/sbb-design-systems/sbb-angular/commit/6dfc1cd4319868173a35aa851f9d29559e9d0ec1)), closes [#362](https://github.com/sbb-design-systems/sbb-angular/issues/362) [#400](https://github.com/sbb-design-systems/sbb-angular/issues/400)


### Bug Fixes

* **public:** adjust toggle label height for different content sizes ([#651](https://github.com/sbb-design-systems/sbb-angular/issues/651)) ([313008a](https://github.com/sbb-design-systems/sbb-angular/commit/313008a046c87af58f713527a4c830a9a6f59154)), closes [#171](https://github.com/sbb-design-systems/sbb-angular/issues/171)
* allow tooltip usage inside sbb-label ([#632](https://github.com/sbb-design-systems/sbb-angular/issues/632)) ([0e24d2b](https://github.com/sbb-design-systems/sbb-angular/commit/0e24d2b5ce0c962c167165489d410843759447e7))
* change tooltip trigger css display from block to inline-block ([#630](https://github.com/sbb-design-systems/sbb-angular/issues/630)) ([7402291](https://github.com/sbb-design-systems/sbb-angular/commit/7402291313af70347d88e409a43d535781bb0d22))
* export select animations in public api ([#633](https://github.com/sbb-design-systems/sbb-angular/issues/633)) ([6757fa7](https://github.com/sbb-design-systems/sbb-angular/commit/6757fa7c696e56d85e6b84245b167db3ae4d565c))
* fix panel opened style and arrow rotation of select ([#644](https://github.com/sbb-design-systems/sbb-angular/issues/644)) ([6bbe15e](https://github.com/sbb-design-systems/sbb-angular/commit/6bbe15e55622fb234d20b515062c84347f23029a))
* refactor usermenu and introduce business styles ([#640](https://github.com/sbb-design-systems/sbb-angular/issues/640)) ([5ee34fb](https://github.com/sbb-design-systems/sbb-angular/commit/5ee34fb503359551af45c28a5118a4b9e2fe8b96)), closes [#479](https://github.com/sbb-design-systems/sbb-angular/issues/479)
* remove outline from tab content ([#627](https://github.com/sbb-design-systems/sbb-angular/issues/627)) ([a335bce](https://github.com/sbb-design-systems/sbb-angular/commit/a335bce71566a09c97e819cdeb2c83febfc501c3)), closes [#610](https://github.com/sbb-design-systems/sbb-angular/issues/610)
* update link styles to adhere to design specification ([#618](https://github.com/sbb-design-systems/sbb-angular/issues/618)) ([dc0c754](https://github.com/sbb-design-systems/sbb-angular/commit/dc0c754bd807900c132ebcf785bb165eedca7bef))
* use correct textarea padding ([#650](https://github.com/sbb-design-systems/sbb-angular/issues/650)) ([fce9414](https://github.com/sbb-design-systems/sbb-angular/commit/fce94143cd798ab8206120c919183a2ac97a5aa9))
* **business:** autocomplete borders of chip input ([#646](https://github.com/sbb-design-systems/sbb-angular/issues/646)) ([090ff94](https://github.com/sbb-design-systems/sbb-angular/commit/090ff9435a327fad1972284fbe260c3cdca84246))
* **business:** correct datepicker colors ([#625](https://github.com/sbb-design-systems/sbb-angular/issues/625)) ([1f414ce](https://github.com/sbb-design-systems/sbb-angular/commit/1f414ce021f28c096f42a27e312e8a59f40f4204))
* **business:** correct tooltip colors ([#626](https://github.com/sbb-design-systems/sbb-angular/issues/626)) ([f65629a](https://github.com/sbb-design-systems/sbb-angular/commit/f65629a10bfead8bb88ed1c61e2d5ba3cc5870e7)), closes [#604](https://github.com/sbb-design-systems/sbb-angular/issues/604)
* **business:** fix right padding of fieldset ([#622](https://github.com/sbb-design-systems/sbb-angular/issues/622)) ([e37689f](https://github.com/sbb-design-systems/sbb-angular/commit/e37689fa29ea511d5200445b5edde093e3d965cd))
* **showcase:** fix styling of icon-overview in firefox ([#637](https://github.com/sbb-design-systems/sbb-angular/issues/637)) ([2377f21](https://github.com/sbb-design-systems/sbb-angular/commit/2377f212ee5bcda286edda2e9760605480edea3d))
* remove obsolete aria-hidden from select ([#631](https://github.com/sbb-design-systems/sbb-angular/issues/631)) ([e228e88](https://github.com/sbb-design-systems/sbb-angular/commit/e228e882b7d9033324dd89f18f886c08e550a58e))
* set min-height on input to support text center aligning in IE ([#628](https://github.com/sbb-design-systems/sbb-angular/issues/628)) ([6c520e5](https://github.com/sbb-design-systems/sbb-angular/commit/6c520e52d2368215f7026efffa461d64e5231634))


* remove deprecations ([#629](https://github.com/sbb-design-systems/sbb-angular/issues/629)) ([04a60ab](https://github.com/sbb-design-systems/sbb-angular/commit/04a60abaf13032ec8aa741681e009f8834513758)), closes [#488](https://github.com/sbb-design-systems/sbb-angular/issues/488)
* remove social link ([#617](https://github.com/sbb-design-systems/sbb-angular/issues/617)) ([abb0331](https://github.com/sbb-design-systems/sbb-angular/commit/abb0331227f207a979e50a2405fd10148eec4e9e))


### build

* update to Angular v11 rc1 ([#634](https://github.com/sbb-design-systems/sbb-angular/issues/634)) ([512c799](https://github.com/sbb-design-systems/sbb-angular/commit/512c799d9a20510d4b2db8b541b7cbbfd46d5d27))

### [10.3.1](https://github.com/sbb-design-systems/sbb-angular/compare/10.3.0...10.3.1) (2020-09-30)


### Bug Fixes

* support contextmenu icons ([#607](https://github.com/sbb-design-systems/sbb-angular/issues/607)) ([dcb4af6](https://github.com/sbb-design-systems/sbb-angular/commit/dcb4af6a543ed5fda387181f87755e73d9f13d1e))
* **core:** use year pivot for business date adapter to determine century of 2-digit year ([#615](https://github.com/sbb-design-systems/sbb-angular/issues/615)) ([ed0351a](https://github.com/sbb-design-systems/sbb-angular/commit/ed0351af5eced6b7d3b9289d495181e15dc64735)), closes [#613](https://github.com/sbb-design-systems/sbb-angular/issues/613)

## [10.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/10.2.1...10.3.0) (2020-09-23)


### Features

* add typescript 4 support ([#608](https://github.com/sbb-design-systems/sbb-angular/issues/608)) ([e984bf5](https://github.com/sbb-design-systems/sbb-angular/commit/e984bf53b25990f2c95080c3e2d6af711e83655e))
* **business:** implement sidebar and icon sidebar ([#600](https://github.com/sbb-design-systems/sbb-angular/issues/600)) ([79aeb53](https://github.com/sbb-design-systems/sbb-angular/commit/79aeb53396d999b86f2b570827181f51fc65134f))


### Bug Fixes

* **core:** fix sbb-icon using more space than icon ([#606](https://github.com/sbb-design-systems/sbb-angular/issues/606)) ([90e0240](https://github.com/sbb-design-systems/sbb-angular/commit/90e024059fcccdc0b33723d34a9fbfaca033ec9d))
* **showcase:** fix autocomplete display with examples ([#603](https://github.com/sbb-design-systems/sbb-angular/issues/603)) ([9cc2029](https://github.com/sbb-design-systems/sbb-angular/commit/9cc20293665baf8bcbbdfa2589cf30ab5e2f0146))

### [10.2.1](https://github.com/sbb-design-systems/sbb-angular/compare/10.2.0...10.2.1) (2020-09-17)


### Bug Fixes

* **business:** adapt CDK changes for sbb-table ([#599](https://github.com/sbb-design-systems/sbb-angular/issues/599)) ([1f06eb1](https://github.com/sbb-design-systems/sbb-angular/commit/1f06eb18475e07d8a245cbdb279160b2a6d42d02)), closes [angular/components#20425](https://github.com/angular/components/issues/20425)
* **public:** backwards compatibility to deprecated angular-icons ([#598](https://github.com/sbb-design-systems/sbb-angular/issues/598)) ([6b3b6c0](https://github.com/sbb-design-systems/sbb-angular/commit/6b3b6c03789d8fd7d368802d7016fbe453b6b6ad))

## [10.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/10.2.0-next.0...10.2.0) (2020-09-10)


### Bug Fixes

* **core:** apply the icon registry migration only to application projects ([#595](https://github.com/sbb-design-systems/sbb-angular/issues/595)) ([e744ed1](https://github.com/sbb-design-systems/sbb-angular/commit/e744ed163d517b4a8c48f803585e286cf0a198c6))
* **core:** normalize attribute comparison in icon migration ([#596](https://github.com/sbb-design-systems/sbb-angular/issues/596)) ([a935eb6](https://github.com/sbb-design-systems/sbb-angular/commit/a935eb6569dfed0d9c73998b185d23bae3ad845a))

## [10.2.0-next.0](https://github.com/sbb-design-systems/sbb-angular/compare/10.1.3...10.2.0-next.0) (2020-09-09)


### Features

* **business:** toast notification ([#572](https://github.com/sbb-design-systems/sbb-angular/issues/572)) ([2740a19](https://github.com/sbb-design-systems/sbb-angular/commit/2740a19e48c0c7604221fe1a5822b98e59bb8081))
* **core:** define device orientation breakpoints ([#592](https://github.com/sbb-design-systems/sbb-angular/issues/592)) ([2309aed](https://github.com/sbb-design-systems/sbb-angular/commit/2309aed51a8b00870a8473226d735c48b829eee2))
* add inline mode to sbb-loading ([#557](https://github.com/sbb-design-systems/sbb-angular/issues/557)) ([49c20a3](https://github.com/sbb-design-systems/sbb-angular/commit/49c20a340540e2a6069640a293b5c69c29452a40))
* migrate all modules from legacy icons to sbb-icon ([#585](https://github.com/sbb-design-systems/sbb-angular/issues/585)) ([c3d7430](https://github.com/sbb-design-systems/sbb-angular/commit/c3d743091cb132c27f7deb920ef3543822874442))
* **core:** implement generic icon module ([#584](https://github.com/sbb-design-systems/sbb-angular/issues/584)) ([d117862](https://github.com/sbb-design-systems/sbb-angular/commit/d117862f2cfd6aaa702a0e9a6b3cb17f4fdc0e90))


### Bug Fixes

* **timeinput:** fix height for 4k and 5k screens/breakpoints ([#588](https://github.com/sbb-design-systems/sbb-angular/issues/588)) ([ac42b41](https://github.com/sbb-design-systems/sbb-angular/commit/ac42b413c7475fae19a2f9eeee536c4ed0ca0c8b)), closes [#587](https://github.com/sbb-design-systems/sbb-angular/issues/587)
* expansion-panel collapse should hide content ([#586](https://github.com/sbb-design-systems/sbb-angular/issues/586)) ([42cec9c](https://github.com/sbb-design-systems/sbb-angular/commit/42cec9ce73364cdea40b9bf941b42699b156d901))
* **business:** remove 4k/5k stylings for links ([#581](https://github.com/sbb-design-systems/sbb-angular/issues/581)) ([7f0c96c](https://github.com/sbb-design-systems/sbb-angular/commit/7f0c96c22724326a8c9b4c5a3ed02786ad879b71))

### [10.1.3](https://github.com/sbb-design-systems/sbb-angular/compare/10.1.2...10.1.3) (2020-08-26)


### Bug Fixes

* **public:** update all-tag state when values are set from outside ([#571](https://github.com/sbb-design-systems/sbb-angular/issues/571)) ([333ac08](https://github.com/sbb-design-systems/sbb-angular/commit/333ac085e2d276deae2bbfbd9bf5ad87066b59f3))

### [10.1.2](https://github.com/sbb-design-systems/sbb-angular/compare/10.1.1...10.1.2) (2020-08-05)


### Bug Fixes

* **business:** fix table to work with @angular/cdk@10.1.2 ([#569](https://github.com/sbb-design-systems/sbb-angular/issues/569)) ([b380da9](https://github.com/sbb-design-systems/sbb-angular/commit/b380da9a443595a8052d094ef06969dd8e140d23))

### [10.1.1](https://github.com/sbb-design-systems/sbb-angular/compare/10.1.0...10.1.1) (2020-08-04)


### Bug Fixes

* **business:** adapt sbb-table-align-center class to use it with sort headers ([#560](https://github.com/sbb-design-systems/sbb-angular/issues/560)) ([9825910](https://github.com/sbb-design-systems/sbb-angular/commit/982591084c3496a7f42ca5e200cdfb14db2781e6))
* **business:** update sort arrow if programmatically sorting table ([#566](https://github.com/sbb-design-systems/sbb-angular/issues/566)) ([65e8b60](https://github.com/sbb-design-systems/sbb-angular/commit/65e8b6016963cf61059c944a4f3bcc57255188d9)), closes [#564](https://github.com/sbb-design-systems/sbb-angular/issues/564)
* **public:** update tag state after all tag was clicked and provide total amount as input ([#565](https://github.com/sbb-design-systems/sbb-angular/issues/565)) ([6a6e6a7](https://github.com/sbb-design-systems/sbb-angular/commit/6a6e6a7eab7d5721a20405e57a621f820e43369c)), closes [#561](https://github.com/sbb-design-systems/sbb-angular/issues/561) [#562](https://github.com/sbb-design-systems/sbb-angular/issues/562)
* correct checkbox and radio styles ([#512](https://github.com/sbb-design-systems/sbb-angular/issues/512)) ([33412ad](https://github.com/sbb-design-systems/sbb-angular/commit/33412ad2f23ac980df48327826f944cef2f8ac3b))
* fix trigger size of breadcrumb in IE ([#535](https://github.com/sbb-design-systems/sbb-angular/issues/535)) ([4a287dc](https://github.com/sbb-design-systems/sbb-angular/commit/4a287dce471070a127195629996ac752b4b062e1))
* responsive processflow styles and paddings ([#523](https://github.com/sbb-design-systems/sbb-angular/issues/523)) ([cf6737c](https://github.com/sbb-design-systems/sbb-angular/commit/cf6737ca40a37b3d9d8679ac2f336915daf1ec69))

## [10.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/10.0.0...10.1.0) (2020-07-15)


### Features

* **business:** enable dialog backdrop click ([#497](https://github.com/sbb-design-systems/sbb-angular/issues/497)) ([4b8386c](https://github.com/sbb-design-systems/sbb-angular/commit/4b8386ca43a1263f049dcaa0f2449dcc12738e40)), closes [#464](https://github.com/sbb-design-systems/sbb-angular/issues/464)


### Bug Fixes

* add default placeholder to time input ([#509](https://github.com/sbb-design-systems/sbb-angular/issues/509)) ([d233f84](https://github.com/sbb-design-systems/sbb-angular/commit/d233f8461417b168ee8649b2b55c23d85ad1696d))
* breadcrumb styles ([#498](https://github.com/sbb-design-systems/sbb-angular/issues/498)) ([49bc6c6](https://github.com/sbb-design-systems/sbb-angular/commit/49bc6c6e2f691c54a4bd486a3c50e02b35e10d70)), closes [#469](https://github.com/sbb-design-systems/sbb-angular/issues/469)
* correct color for remaining chars in textarea ([#508](https://github.com/sbb-design-systems/sbb-angular/issues/508)) ([2c20f90](https://github.com/sbb-design-systems/sbb-angular/commit/2c20f90d7a3c0c1716c064148e6d1834e9d4fb66))
* correct datepicker styles ([#505](https://github.com/sbb-design-systems/sbb-angular/issues/505)) ([3eb7b84](https://github.com/sbb-design-systems/sbb-angular/commit/3eb7b84aa24cf551c3f303b1f617ad9c2dad5f12))
* correct hover styles of fileselector ([#507](https://github.com/sbb-design-systems/sbb-angular/issues/507)) ([2842da0](https://github.com/sbb-design-systems/sbb-angular/commit/2842da0cd1aef781fe9ad8cc7b8f5cc8b85f30a0))
* styling issues in select and dropdown ([#501](https://github.com/sbb-design-systems/sbb-angular/issues/501)) ([5e74d8f](https://github.com/sbb-design-systems/sbb-angular/commit/5e74d8fb880fba22ca761be1e40e7f16961f937d)), closes [#470](https://github.com/sbb-design-systems/sbb-angular/issues/470)
* use TypeRef to avoid meta data break ([#510](https://github.com/sbb-design-systems/sbb-angular/issues/510)) ([7c2e510](https://github.com/sbb-design-systems/sbb-angular/commit/7c2e51089efc74a7e951251d4d5217cd1a8cf3b5))
* **showcase:** adapt urls for staging ([#506](https://github.com/sbb-design-systems/sbb-angular/issues/506)) ([be47440](https://github.com/sbb-design-systems/sbb-angular/commit/be47440e2f48898a82b52eef7e48237b03072468))
* **showcase:** do not cache reverse proxy response ([#503](https://github.com/sbb-design-systems/sbb-angular/issues/503)) ([78d6861](https://github.com/sbb-design-systems/sbb-angular/commit/78d6861f9c7e1aebd0a9c353ea0af4f3244574fd))
* parse html with domsanitizer ([#502](https://github.com/sbb-design-systems/sbb-angular/issues/502)) ([16e64f5](https://github.com/sbb-design-systems/sbb-angular/commit/16e64f5f624e6889c635084bd7f0fdc7295f6e4a))
* vertically center text in ghost button ([#499](https://github.com/sbb-design-systems/sbb-angular/issues/499)) ([4e8a9b3](https://github.com/sbb-design-systems/sbb-angular/commit/4e8a9b3487a76d80c7b23ff3d286cd44fd106fba)), closes [#468](https://github.com/sbb-design-systems/sbb-angular/issues/468)

## [10.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/10.0.0-next.0...10.0.0) (2020-07-03)

## [10.0.0-next.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.8.0...10.0.0-next.0) (2020-07-02)


### ⚠ BREAKING CHANGES

* Removes inputId inputs on form components (does not affect id inputs). Also removes internal interfaces for accordion, header, radio-button and a few other deprecations.
* Removes scrolling module and drops support for ngx-perfect-scrollbar.
* Upgrading to version 10 of Angular.

### Bug Fixes

* **icons:** correct schematics path ([#484](https://github.com/sbb-design-systems/sbb-angular/issues/484)) ([f74ca39](https://github.com/sbb-design-systems/sbb-angular/commit/f74ca39753b34097f413dc35044199e0ac34f156))


* remove scrolling module ([#471](https://github.com/sbb-design-systems/sbb-angular/issues/471)) ([c783fd1](https://github.com/sbb-design-systems/sbb-angular/commit/c783fd140555d0a4eb65b9a342d0a91d77606323))
* remove various deprecations ([#481](https://github.com/sbb-design-systems/sbb-angular/issues/481)) ([ce0a284](https://github.com/sbb-design-systems/sbb-angular/commit/ce0a284fd444a8ba099b548e20c18366eee8b76a))
* update to angular 10 ([#467](https://github.com/sbb-design-systems/sbb-angular/issues/467)) ([427a70e](https://github.com/sbb-design-systems/sbb-angular/commit/427a70eb789d76ab2c684b313d0b74a99d5aedcf))

## [9.8.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.7.1...9.8.0) (2020-06-19)


### Features

* implement status module ([#448](https://github.com/sbb-design-systems/sbb-angular/issues/448)) ([37c3b46](https://github.com/sbb-design-systems/sbb-angular/commit/37c3b4689687b265f1086a5dc115343cbe0b17a8)), closes [#86](https://github.com/sbb-design-systems/sbb-angular/issues/86)
* **business:** extract table business styling ([#450](https://github.com/sbb-design-systems/sbb-angular/issues/450)) ([4fb1c07](https://github.com/sbb-design-systems/sbb-angular/commit/4fb1c07cf2619b68388f2925b49216170dd1b56e))
* **tabs:** allow tabs to be lazy rendered by sbbTabContent directive ([#457](https://github.com/sbb-design-systems/sbb-angular/issues/457)) ([8c3b284](https://github.com/sbb-design-systems/sbb-angular/commit/8c3b284c79cd8b22159ba8b16ed713d04d025912)), closes [#456](https://github.com/sbb-design-systems/sbb-angular/issues/456)


### Bug Fixes

* **business:** filter null/undefined in table data source ([#455](https://github.com/sbb-design-systems/sbb-angular/issues/455)) ([4262188](https://github.com/sbb-design-systems/sbb-angular/commit/42621881be63e1fe3d1ac5ed7a0be4a09a30cda8)), closes [#445](https://github.com/sbb-design-systems/sbb-angular/issues/445)
* **showcase:** display documentation of angular core ([#460](https://github.com/sbb-design-systems/sbb-angular/issues/460)) ([2714795](https://github.com/sbb-design-systems/sbb-angular/commit/2714795c43af9b13164819ac766e69cf640d24f7))

### [9.7.1](https://github.com/sbb-design-systems/sbb-angular/compare/9.7.0...9.7.1) (2020-06-02)


### Bug Fixes

* move processflow overflow style rules to nested element ([#442](https://github.com/sbb-design-systems/sbb-angular/issues/442)) ([ef2da56](https://github.com/sbb-design-systems/sbb-angular/commit/ef2da56682a453d3181ada26b1a48277b16d73b6)), closes [#399](https://github.com/sbb-design-systems/sbb-angular/issues/399)
* **public:** correct checkbox panel styling ([#441](https://github.com/sbb-design-systems/sbb-angular/issues/441)) ([742b150](https://github.com/sbb-design-systems/sbb-angular/commit/742b15031297c81a911fa4ea4c22eb6447731724)), closes [#433](https://github.com/sbb-design-systems/sbb-angular/issues/433)
* sbb-select dropdown should adapt to changing width ([#440](https://github.com/sbb-design-systems/sbb-angular/issues/440)) ([40657d0](https://github.com/sbb-design-systems/sbb-angular/commit/40657d0ca3555b46b5976d03de88682418fb2fe4)), closes [#423](https://github.com/sbb-design-systems/sbb-angular/issues/423)
* **business:** allow header menu to scroll ([#439](https://github.com/sbb-design-systems/sbb-angular/issues/439)) ([e9375d5](https://github.com/sbb-design-systems/sbb-angular/commit/e9375d57082df66874242fd8869ff6c386926797)), closes [#428](https://github.com/sbb-design-systems/sbb-angular/issues/428)

## [9.7.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.6.0...9.7.0) (2020-05-26)


### Features

* **business:** loading component ([#424](https://github.com/sbb-design-systems/sbb-angular/issues/424)) ([392d1ec](https://github.com/sbb-design-systems/sbb-angular/commit/392d1ec3d459cc54645995caaeb10eade8c89c48))


### Bug Fixes

* revert type imports ([#431](https://github.com/sbb-design-systems/sbb-angular/issues/431)) ([8469531](https://github.com/sbb-design-systems/sbb-angular/commit/8469531341f7255d7b918597744ce8c515702306)), closes [#432](https://github.com/sbb-design-systems/sbb-angular/issues/432)

## [9.6.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.5.0...9.6.0) (2020-05-18)


### Features

* locale normalizer in autocomplete ([#412](https://github.com/sbb-design-systems/sbb-angular/issues/412)) ([7d1879c](https://github.com/sbb-design-systems/sbb-angular/commit/7d1879c624ad0ae62d70e7d2afd266afc0b47157)), closes [#405](https://github.com/sbb-design-systems/sbb-angular/issues/405) [#386](https://github.com/sbb-design-systems/sbb-angular/issues/386)


### Bug Fixes

* respect sbb-form-field integration in autocomplete ([#417](https://github.com/sbb-design-systems/sbb-angular/issues/417)) ([d24272f](https://github.com/sbb-design-systems/sbb-angular/commit/d24272f6bd946fcdef15760bb0d5fbff6a53b099))
* send pageEvent on paginator also when pageSize changes ([#416](https://github.com/sbb-design-systems/sbb-angular/issues/416)) ([58212e4](https://github.com/sbb-design-systems/sbb-angular/commit/58212e4fde1d934bff5b53d997cc03aec3236ced))
* **business:** fix borders of contextmenu ([#403](https://github.com/sbb-design-systems/sbb-angular/issues/403)) ([b22780f](https://github.com/sbb-design-systems/sbb-angular/commit/b22780f9b9eaa89dcce2d1522f6663beb12b6c2f)), closes [#398](https://github.com/sbb-design-systems/sbb-angular/issues/398)
* **core:** re-add individual styles .scss files ([#414](https://github.com/sbb-design-systems/sbb-angular/issues/414)) ([fa50fe1](https://github.com/sbb-design-systems/sbb-angular/commit/fa50fe1171032b4befb74fa54c1109d272ed5ddc)), closes [#406](https://github.com/sbb-design-systems/sbb-angular/issues/406)
* **public:** fix expanding of width on frameless button when hovering ([#410](https://github.com/sbb-design-systems/sbb-angular/issues/410)) ([c6c9b7f](https://github.com/sbb-design-systems/sbb-angular/commit/c6c9b7fe1bf241b947a10c9f34a1e797a414914b)), closes [#369](https://github.com/sbb-design-systems/sbb-angular/issues/369)
* **public:** fix overflow on checkbox-panel and radio-button-panel ([#413](https://github.com/sbb-design-systems/sbb-angular/issues/413)) ([d489ff5](https://github.com/sbb-design-systems/sbb-angular/commit/d489ff58aef2c9906c5267e1ee78892945003369)), closes [#274](https://github.com/sbb-design-systems/sbb-angular/issues/274)
* **showcase:** add example docs ([#408](https://github.com/sbb-design-systems/sbb-angular/issues/408)) ([831ed45](https://github.com/sbb-design-systems/sbb-angular/commit/831ed45bc32f27fc7c3551589628375af6894786))
* fix tabbing to and from sbb-select ([#404](https://github.com/sbb-design-systems/sbb-angular/issues/404)) ([9d083b1](https://github.com/sbb-design-systems/sbb-angular/commit/9d083b19ae73bed22db488171a2d2ef7ef9870f7)), closes [#383](https://github.com/sbb-design-systems/sbb-angular/issues/383)

## [9.5.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1...9.5.0) (2020-05-08)


### Features

* **business:** apply file-selector business styling ([#352](https://github.com/sbb-design-systems/sbb-angular/issues/352)) ([d44f937](https://github.com/sbb-design-systems/sbb-angular/commit/d44f937e10de1639ca12f9d4ea4028829e81b3be)), closes [#81](https://github.com/sbb-design-systems/sbb-angular/issues/81)
* **business:** apply textexpand business styling ([#351](https://github.com/sbb-design-systems/sbb-angular/issues/351)) ([2db0ba9](https://github.com/sbb-design-systems/sbb-angular/commit/2db0ba94bcc0a94251825f440e7fcffe017cd082)), closes [#89](https://github.com/sbb-design-systems/sbb-angular/issues/89)
* **business:** implement business link module ([#350](https://github.com/sbb-design-systems/sbb-angular/issues/350)) ([c61a12f](https://github.com/sbb-design-systems/sbb-angular/commit/c61a12fb88569e5c95c9df220fc7191bfb247984)), closes [#82](https://github.com/sbb-design-systems/sbb-angular/issues/82)
* add pagination, sort and filtering functionality to table-data-source ([#379](https://github.com/sbb-design-systems/sbb-angular/issues/379)) ([a41b083](https://github.com/sbb-design-systems/sbb-angular/commit/a41b083912072df7daebd90281c30279f90e8513)), closes [#363](https://github.com/sbb-design-systems/sbb-angular/issues/363) [#339](https://github.com/sbb-design-systems/sbb-angular/issues/339)


### Bug Fixes

* **accordion:** toggle expansion-panel-header only if focused ([#394](https://github.com/sbb-design-systems/sbb-angular/issues/394)) ([420a983](https://github.com/sbb-design-systems/sbb-angular/commit/420a98368439208a03113e2e6567d95d4649306f)), closes [#377](https://github.com/sbb-design-systems/sbb-angular/issues/377)
* correct processflow steps spacing ([#397](https://github.com/sbb-design-systems/sbb-angular/issues/397)) ([25a5643](https://github.com/sbb-design-systems/sbb-angular/commit/25a564390222c5edca51c03533cb13b0d39c1ff4))
* **business:** fix styling of tooltip directive ([#392](https://github.com/sbb-design-systems/sbb-angular/issues/392)) ([ef1203f](https://github.com/sbb-design-systems/sbb-angular/commit/ef1203f593203915fb1af7ff93610b70393bbf9c)), closes [#390](https://github.com/sbb-design-systems/sbb-angular/issues/390)
* **showcase:** fix showcase for ie11 and edge ([#393](https://github.com/sbb-design-systems/sbb-angular/issues/393)) ([e45bbdc](https://github.com/sbb-design-systems/sbb-angular/commit/e45bbdc25a1011add639ae7337bef4d3c4066a7d))

### [9.4.1](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.10...9.4.1) (2020-05-01)


### Bug Fixes

* processflow steps should not shrink ([#385](https://github.com/sbb-design-systems/sbb-angular/issues/385)) ([9349704](https://github.com/sbb-design-systems/sbb-angular/commit/93497046c2a3baa415861d431e289c2a491a271e)), closes [#382](https://github.com/sbb-design-systems/sbb-angular/issues/382)

### [9.4.1-next.10](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.9...9.4.1-next.10) (2020-04-30)


### Bug Fixes

* scss bundle should not duplicate imports ([#387](https://github.com/sbb-design-systems/sbb-angular/issues/387)) ([1242f40](https://github.com/sbb-design-systems/sbb-angular/commit/1242f40ce84b9390e258cdb7ab8f52959236eb31))

### [9.4.1-next.9](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.8...9.4.1-next.9) (2020-04-30)


### Bug Fixes

* center align login button in usermenu (IE/Firefox) ([#378](https://github.com/sbb-design-systems/sbb-angular/issues/378)) ([48e354f](https://github.com/sbb-design-systems/sbb-angular/commit/48e354fd13cf4277cbce7a577d383f830b3a97e9)), closes [#370](https://github.com/sbb-design-systems/sbb-angular/issues/370)
* **business:** change label color for disabled radio-button and checkbox ([#375](https://github.com/sbb-design-systems/sbb-angular/issues/375)) ([ca685ed](https://github.com/sbb-design-systems/sbb-angular/commit/ca685ed8573f7564c2cdecf8675564829f395eed)), closes [#364](https://github.com/sbb-design-systems/sbb-angular/issues/364)
* **showcase:** display getting started of icons and keycloak lib ([#376](https://github.com/sbb-design-systems/sbb-angular/issues/376)) ([6b27268](https://github.com/sbb-design-systems/sbb-angular/commit/6b27268212a25aaa54313791bdb82a7b743b6c76))
* **showcase:** fix showcases to work with bazel ([#372](https://github.com/sbb-design-systems/sbb-angular/issues/372)) ([5fd8fcc](https://github.com/sbb-design-systems/sbb-angular/commit/5fd8fcce0b0faac70984cfbaa5a35c6b6ed798e3))

### [9.4.1-next.8](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.7...9.4.1-next.8) (2020-04-19)


### Bug Fixes

* package entry points should point to correct files ([2fb9c20](https://github.com/sbb-design-systems/sbb-angular/commit/2fb9c208a811ad29b62f1f96fde9fbc7b5c76086))

### [9.4.1-next.7](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.6...9.4.1-next.7) (2020-04-19)

### [9.4.1-next.6](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.5...9.4.1-next.6) (2020-04-19)

### [9.4.1-next.5](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.4...9.4.1-next.5) (2020-04-19)

### [9.4.1-next.4](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.3...9.4.1-next.4) (2020-04-19)

### [9.4.1-next.3](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.2...9.4.1-next.3) (2020-04-19)

### [9.4.1-next.2](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.1...9.4.1-next.2) (2020-04-19)

### [9.4.1-next.1](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.1-next.0...9.4.1-next.1) (2020-04-17)

### [9.4.1-next.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.4.0...9.4.1-next.0) (2020-04-17)

## [9.4.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.3.0...9.4.0) (2020-04-16)


### Features

* **business:** provide date parsing of e.g. 01012020 ([#360](https://github.com/sbb-design-systems/sbb-angular/issues/360)) ([c45ec9c](https://github.com/sbb-design-systems/sbb-angular/commit/c45ec9cb89c3ecf4e716fc8015f354338f781e38))

## [9.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.2.0...9.3.0) (2020-04-02)


### Features

* ng-add support ([#358](https://github.com/sbb-design-systems/sbb-angular/issues/358)) ([ca8e83f](https://github.com/sbb-design-systems/sbb-angular/commit/ca8e83f8fabf71e8a1ac2e9122dbc6beeec815df))

## [9.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.1.1...9.2.0) (2020-04-02)


### Features

* **business:** apply breadcrumb business styling ([#353](https://github.com/sbb-design-systems/sbb-angular/issues/353)) ([2aa839d](https://github.com/sbb-design-systems/sbb-angular/commit/2aa839dee122502f3b20ff4495146f6d36ca61bc)), closes [#78](https://github.com/sbb-design-systems/sbb-angular/issues/78)
* **business:** enable any element as a tooltip trigger and provide tooltip styling ([#356](https://github.com/sbb-design-systems/sbb-angular/issues/356)) ([b79eca8](https://github.com/sbb-design-systems/sbb-angular/commit/b79eca82a8374b03ad4865f96c34ab380a3ccde9)), closes [#200](https://github.com/sbb-design-systems/sbb-angular/issues/200) [#90](https://github.com/sbb-design-systems/sbb-angular/issues/90) [#225](https://github.com/sbb-design-systems/sbb-angular/issues/225)


### Bug Fixes

* enable click on arrow in usermenu panel ([#357](https://github.com/sbb-design-systems/sbb-angular/issues/357)) ([36c198c](https://github.com/sbb-design-systems/sbb-angular/commit/36c198cfac6aadcb1c5ccdad1474bf332954d6c7)), closes [#349](https://github.com/sbb-design-systems/sbb-angular/issues/349)
* **maps:** remove usage of includes() ([#355](https://github.com/sbb-design-systems/sbb-angular/issues/355)) ([057dcef](https://github.com/sbb-design-systems/sbb-angular/commit/057dcef6fe26fe2028e0cef8daec7ec4d619bc4e))

### [9.1.1](https://github.com/sbb-design-systems/sbb-angular/compare/9.1.0...9.1.1) (2020-03-19)


### Bug Fixes

* **business:** mark chip input as invalid only when touched ([#347](https://github.com/sbb-design-systems/sbb-angular/issues/347)) ([815f277](https://github.com/sbb-design-systems/sbb-angular/commit/815f277f80be77f6d1d1b688f82efd8a9f77e91b))
* connect select component to sbb-form-field ([#340](https://github.com/sbb-design-systems/sbb-angular/issues/340)) ([745598c](https://github.com/sbb-design-systems/sbb-angular/commit/745598c2c71535a3c39b9eb0aa046eb0d2b0b273))
* correct focus of textarea and resizing behaviour ([#344](https://github.com/sbb-design-systems/sbb-angular/issues/344)) ([cfcdd39](https://github.com/sbb-design-systems/sbb-angular/commit/cfcdd3921f9bf99a6264fa362d1ec7e497749564)), closes [#194](https://github.com/sbb-design-systems/sbb-angular/issues/194)
* enable label click for select and chip in sbb-form-field ([#346](https://github.com/sbb-design-systems/sbb-angular/issues/346)) ([92b4b2d](https://github.com/sbb-design-systems/sbb-angular/commit/92b4b2d14d31feb2a4b3842869704c03ffb4061a))
* fix too small width of usermenu in IE11 ([#345](https://github.com/sbb-design-systems/sbb-angular/issues/345)) ([ee3e4db](https://github.com/sbb-design-systems/sbb-angular/commit/ee3e4db9e2dded813ad9890038538463118fcfa4)), closes [#341](https://github.com/sbb-design-systems/sbb-angular/issues/341)
* **icons:** center sbb logo in app icon ([#338](https://github.com/sbb-design-systems/sbb-angular/issues/338)) ([4a3f5c2](https://github.com/sbb-design-systems/sbb-angular/commit/4a3f5c2576ea3073719a703a3666fd4652812211)), closes [#119](https://github.com/sbb-design-systems/sbb-angular/issues/119)
* **icons:** fix utilization medium fixed size ([#337](https://github.com/sbb-design-systems/sbb-angular/issues/337)) ([49efc7b](https://github.com/sbb-design-systems/sbb-angular/commit/49efc7ba48c35bef033b29645d04a2f02abf9789)), closes [#254](https://github.com/sbb-design-systems/sbb-angular/issues/254)

## [9.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/9.0.1...9.1.0) (2020-03-11)


### Features

* **business:** implement chip component ([#271](https://github.com/sbb-design-systems/sbb-angular/issues/271)) ([64251cc](https://github.com/sbb-design-systems/sbb-angular/commit/64251ccda4a1e8f6d045ec5fd3889a078c12f192)), closes [#79](https://github.com/sbb-design-systems/sbb-angular/issues/79)


### Bug Fixes

* allow dropdown overlays to be scrollable ([#332](https://github.com/sbb-design-systems/sbb-angular/issues/332)) ([cce4575](https://github.com/sbb-design-systems/sbb-angular/commit/cce4575e600510f245005ace25ff993b11135dc9)), closes [#116](https://github.com/sbb-design-systems/sbb-angular/issues/116)
* allow dropdown scrolling in safari ([#336](https://github.com/sbb-design-systems/sbb-angular/issues/336)) ([892a290](https://github.com/sbb-design-systems/sbb-angular/commit/892a2904a350b33d3687679893ceeea66adc3646))
* **business:** dont shrink menu-icon on mobile devices in sbb-header ([#326](https://github.com/sbb-design-systems/sbb-angular/issues/326)) ([48ddab5](https://github.com/sbb-design-systems/sbb-angular/commit/48ddab5a6c7a43e24e9a5edbe123c03986756a5f))
* **showcase:** enable side menu scrolling to bottom on mobile ([#328](https://github.com/sbb-design-systems/sbb-angular/issues/328)) ([f234444](https://github.com/sbb-design-systems/sbb-angular/commit/f234444ee7f50009a25b2d0f4caf5f319d18eabe))
* **showcase:** fix disabled button in field showcase ([#333](https://github.com/sbb-design-systems/sbb-angular/issues/333)) ([ffd38e1](https://github.com/sbb-design-systems/sbb-angular/commit/ffd38e1fa3007ef0719f7eade75f7a459dd997d2))
* **showcase:** replace corrupted avatar icon ([#331](https://github.com/sbb-design-systems/sbb-angular/issues/331)) ([ec2b581](https://github.com/sbb-design-systems/sbb-angular/commit/ec2b581e87a7b2734414aa951db58adbf5a1a39d)), closes [#280](https://github.com/sbb-design-systems/sbb-angular/issues/280)

### [9.0.1](https://github.com/sbb-design-systems/sbb-angular/compare/9.0.0...9.0.1) (2020-03-03)


### Bug Fixes

* **core:** remove ScrollingModule re-export from root ([#323](https://github.com/sbb-design-systems/sbb-angular/issues/323)) ([82b2797](https://github.com/sbb-design-systems/sbb-angular/commit/82b2797c998545a06c3237f68e41c1089aa9b591))
* **public:** show pointer cursor on usermenu ([#317](https://github.com/sbb-design-systems/sbb-angular/issues/317)) ([5b23c2c](https://github.com/sbb-design-systems/sbb-angular/commit/5b23c2c4dced049d992dc16ade9454508fa61ed0))
* **showcase:** fix accordion example ([#322](https://github.com/sbb-design-systems/sbb-angular/issues/322)) ([cb87837](https://github.com/sbb-design-systems/sbb-angular/commit/cb87837149cc416dfb8d7a523f300266831e947a))

## [9.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.10.0...9.0.0) (2020-02-27)


### ⚠ BREAKING CHANGES

* Upgrading to version 9 of Angular. As recommended by Angular, the libraries are compiled via ViewEngine, which will be converted to Ivy in an Angular project that is using Ivy (default in Angular 9).
* @sbb-esta/angular-core is now a peer dependency of @sbb-esta/angular-public and @sbb-esta/angular-business. Executing `ng update @sbb-esta/angular-public` or `ng update @sbb-esta/angular-business` will automatically install @sbb-esta/angular-core, otherwise you will need to install the package manually via `npm install --save @sbb-esta/angular-core`.
* Removing the deprecated support for form control on a radio button. sbb-radio-button and sbb-radio-button-panel should be wrapped in a sbb-radio-group. See an example in the `Use with @angular/forms` section in the [radio button documentation](https://angular.app.sbb.ch/latest/public/components/radio-button#use-with-angularforms)
* **business:** The header module no longer exports the DropdownModule. If you used sbb-dropdown with the header, you either should switch to using sbb-header-menu where applicable or you need to add DropdownModule to the NgModule imports.
* Removing the deprecated icons from `@sbb-esta/angular-public`. Please use the icons from '@sbb-esta/angular-icons. This also removes the different icon directives (`*sbbButtonIcon`, `*sbbGhettoboxIcon`, `*sbbNotificationIcon`, `*sbbSearchIcon`, `*sbbToggleOptionIcon`, `*sbbTooltipIcon`) and replaces them with `*sbbIcon`.
* Due to various small problems, we are removing internal usage of perfect-scrollbar. We are also deprecating the ScrollingModule. If you want to keep using the ScrollingModule, you will have to install ngx-perfect-scrollbar manually in your project (npm install --save ngx-perfect-scrollbar).
* Removing various deprecated code parts in checkbox, checkbox panel, dropdown, keycloak config, radio button, radio button panel, tag, textarea, toggle, toggle option. The deprecated highlight pipe has been removed.

### Features

* add migration for public and business packages ([#303](https://github.com/sbb-design-systems/sbb-angular/issues/303)) ([dd93e2e](https://github.com/sbb-design-systems/sbb-angular/commit/dd93e2e19f2b78249e380699e4a85db5b392b078))
* migrate to angular 9 ([#277](https://github.com/sbb-design-systems/sbb-angular/issues/277)) ([b7f6066](https://github.com/sbb-design-systems/sbb-angular/commit/b7f606693f8a687724b05c16e0ae7614ee6734a4))
* **business:** add .sbb-active as active link highlight ([#306](https://github.com/sbb-design-systems/sbb-angular/issues/306)) ([0222ea6](https://github.com/sbb-design-systems/sbb-angular/commit/0222ea68b2b9b01ee617178e6d1dbe6ca04bd59b)), closes [#253](https://github.com/sbb-design-systems/sbb-angular/issues/253)


### Bug Fixes

* **business:** add import to overlay module to header ([#292](https://github.com/sbb-design-systems/sbb-angular/issues/292)) ([a51c399](https://github.com/sbb-design-systems/sbb-angular/commit/a51c399dca51692be01f8096b2d1cd7c6117e4c0))
* **business:** fix overlapping header menus ([#290](https://github.com/sbb-design-systems/sbb-angular/issues/290)) ([19d5a0d](https://github.com/sbb-design-systems/sbb-angular/commit/19d5a0d36678f35117f9fdd05a9ceac7f63578bc)), closes [#286](https://github.com/sbb-design-systems/sbb-angular/issues/286)
* **business:** fix styling and scrolling in header menu ([#318](https://github.com/sbb-design-systems/sbb-angular/issues/318)) ([cedf4ab](https://github.com/sbb-design-systems/sbb-angular/commit/cedf4abbd318b718eea3e1922bf54b2de911c19d))
* **business:** remove dropdown module from header module ([#289](https://github.com/sbb-design-systems/sbb-angular/issues/289)) ([d31b6eb](https://github.com/sbb-design-systems/sbb-angular/commit/d31b6eb6359394bb360685cf44541eba0454cc7a)), closes [#269](https://github.com/sbb-design-systems/sbb-angular/issues/269)
* **maps:** assign public access to package config ([#282](https://github.com/sbb-design-systems/sbb-angular/issues/282)) ([17f9f41](https://github.com/sbb-design-systems/sbb-angular/commit/17f9f41be4373e21e1ea05330e7c8edb910c494f))
* **public:** fix sticky support detection in table component ([#283](https://github.com/sbb-design-systems/sbb-angular/issues/283)) ([bb0dc1a](https://github.com/sbb-design-systems/sbb-angular/commit/bb0dc1a4c9a2cd90834175bccd65874dbd324a73))
* **public:** show pointer cursor on tag ([#314](https://github.com/sbb-design-systems/sbb-angular/issues/314)) ([4abe188](https://github.com/sbb-design-systems/sbb-angular/commit/4abe18814ea613ee89eea835c57589681f3f4c4c))
* **public:** show searchbox in header mode ([#302](https://github.com/sbb-design-systems/sbb-angular/issues/302)) ([0d9353e](https://github.com/sbb-design-systems/sbb-angular/commit/0d9353e838827264f6445583274046d0c4c4d344))
* **showcase:** fix datepicker styling in showcase ([#312](https://github.com/sbb-design-systems/sbb-angular/issues/312)) ([360b24b](https://github.com/sbb-design-systems/sbb-angular/commit/360b24b34b9a8498aa4b9df0499dc3b5be812ed1))
* **showcase:** fix examples using form control on sbb-radio-button ([#308](https://github.com/sbb-design-systems/sbb-angular/issues/308)) ([c6f4980](https://github.com/sbb-design-systems/sbb-angular/commit/c6f49807c6268ab77fee03b18c89603fd16cc671))
* **showcase:** fix overlapping styles for tabs ([#310](https://github.com/sbb-design-systems/sbb-angular/issues/310)) ([5fe284c](https://github.com/sbb-design-systems/sbb-angular/commit/5fe284c7a971ea971a7072f3e122abe1065156ca))
* **showcase:** fix style of lightbox and dialog content ([#305](https://github.com/sbb-design-systems/sbb-angular/issues/305)) ([1607564](https://github.com/sbb-design-systems/sbb-angular/commit/16075644c96f70ff707cd288002de6dfb0f21a75))
* **showcase:** fix table aligning in showcase example ([#307](https://github.com/sbb-design-systems/sbb-angular/issues/307)) ([35816db](https://github.com/sbb-design-systems/sbb-angular/commit/35816db9cfd3588bd23a32490f6ced3e120ba4f9))
* **showcase:** hide scss button in example viewer for missing scss files ([#311](https://github.com/sbb-design-systems/sbb-angular/issues/311)) ([8ccc859](https://github.com/sbb-design-systems/sbb-angular/commit/8ccc859a227bc07f75a0e89b7303f05f769caa8c))
* make notification component jump marks fault tolerant ([#313](https://github.com/sbb-design-systems/sbb-angular/issues/313)) ([cecc75f](https://github.com/sbb-design-systems/sbb-angular/commit/cecc75faee520def04fb52995aa6e3abf189ba72))
* change @sbb-esta/angular-core to be a peer dependency ([#295](https://github.com/sbb-design-systems/sbb-angular/issues/295)) ([c41e078](https://github.com/sbb-design-systems/sbb-angular/commit/c41e07823008b0effeadeda23e9dec3aeabbbe46))
* drop support for form control on radio button ([#287](https://github.com/sbb-design-systems/sbb-angular/issues/287)) ([e724872](https://github.com/sbb-design-systems/sbb-angular/commit/e724872824939cdc6627e79ad000ea4180844cf3))
* remove deprecated code ([#284](https://github.com/sbb-design-systems/sbb-angular/issues/284)) ([463c6fe](https://github.com/sbb-design-systems/sbb-angular/commit/463c6fe216e290de9e9983e1ceaea16ccd6b825e))
* remove deprecated icon library from public ([#281](https://github.com/sbb-design-systems/sbb-angular/issues/281)) ([50b8202](https://github.com/sbb-design-systems/sbb-angular/commit/50b82028659a7ae7bc838b4a9e15ce7fc1f3087a))
* remove usage of perfect-scrollbar ([#285](https://github.com/sbb-design-systems/sbb-angular/issues/285)) ([b539cd0](https://github.com/sbb-design-systems/sbb-angular/commit/b539cd0c69cbf960efbf676c5707f412604312d9))

## [8.10.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.9.0...8.10.0) (2020-02-18)


### Bug Fixes

* **public:** correct dropdown width in breadcrumbs ([#278](https://github.com/sbb-design-systems/sbb-angular/issues/278)) ([f4019cf](https://github.com/sbb-design-systems/sbb-angular/commit/f4019cf)), closes [#268](https://github.com/sbb-design-systems/sbb-angular/issues/268)
* **showcase:** catch error if showcase component ha no examples ([#276](https://github.com/sbb-design-systems/sbb-angular/issues/276)) ([7379078](https://github.com/sbb-design-systems/sbb-angular/commit/7379078))


### Features

* add @sbb-esta/angular-maps ([#264](https://github.com/sbb-design-systems/sbb-angular/issues/264)) ([749d1e5](https://github.com/sbb-design-systems/sbb-angular/commit/749d1e5))


### Tests

* fix tests with no expectations error ([#279](https://github.com/sbb-design-systems/sbb-angular/issues/279)) ([d3ccb31](https://github.com/sbb-design-systems/sbb-angular/commit/d3ccb31))



## [8.9.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.8.0...8.9.0) (2020-02-07)


### Bug Fixes

* check property pinMode before accessing ([#273](https://github.com/sbb-design-systems/sbb-angular/issues/273)) ([04aa454](https://github.com/sbb-design-systems/sbb-angular/commit/04aa454)), closes [#272](https://github.com/sbb-design-systems/sbb-angular/issues/272)
* circular dependency in sbb-toggle-showcase ([#266](https://github.com/sbb-design-systems/sbb-angular/issues/266)) ([ea5d231](https://github.com/sbb-design-systems/sbb-angular/commit/ea5d231))


### Features

* **business:** style tabs according to style guide ([#251](https://github.com/sbb-design-systems/sbb-angular/issues/251)) ([c0491d5](https://github.com/sbb-design-systems/sbb-angular/commit/c0491d5))



## [8.8.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.12...8.8.0) (2020-01-28)


### Bug Fixes

* fix the disabled state of sbb-select ([#262](https://github.com/sbb-design-systems/sbb-angular/issues/262)) ([6f5c3e7](https://github.com/sbb-design-systems/sbb-angular/commit/6f5c3e7)), closes [#244](https://github.com/sbb-design-systems/sbb-angular/issues/244)
* use the correct SBB fonts ([#260](https://github.com/sbb-design-systems/sbb-angular/issues/260)) ([bb18668](https://github.com/sbb-design-systems/sbb-angular/commit/bb18668))
* **textarea:** trigger calculation of remaining characters correctly ([#252](https://github.com/sbb-design-systems/sbb-angular/issues/252)) ([e3916dd](https://github.com/sbb-design-systems/sbb-angular/commit/e3916dd)), closes [#217](https://github.com/sbb-design-systems/sbb-angular/issues/217)


### Build System

* shorten build script names by removing angular- ([2dcf6d4](https://github.com/sbb-design-systems/sbb-angular/commit/2dcf6d4))
* update dependencies ([#256](https://github.com/sbb-design-systems/sbb-angular/issues/256)) ([1e8ced2](https://github.com/sbb-design-systems/sbb-angular/commit/1e8ced2))


### Features

* provide schematics for generating icon modules ([#259](https://github.com/sbb-design-systems/sbb-angular/issues/259)) ([00bd71b](https://github.com/sbb-design-systems/sbb-angular/commit/00bd71b))
* **business:** implement pagination business styles ([#241](https://github.com/sbb-design-systems/sbb-angular/issues/241)) ([ce21a44](https://github.com/sbb-design-systems/sbb-angular/commit/ce21a44)), closes [#84](https://github.com/sbb-design-systems/sbb-angular/issues/84)
* **business:** implement table component ([#240](https://github.com/sbb-design-systems/sbb-angular/issues/240)) ([ea278c4](https://github.com/sbb-design-systems/sbb-angular/commit/ea278c4)), closes [#88](https://github.com/sbb-design-systems/sbb-angular/issues/88)
* **icons:** generate new icon modules ([#258](https://github.com/sbb-design-systems/sbb-angular/issues/258)) ([539a2d4](https://github.com/sbb-design-systems/sbb-angular/commit/539a2d4)), closes [#152](https://github.com/sbb-design-systems/sbb-angular/issues/152)



### [8.7.12](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.11...8.7.12) (2020-01-06)


### Bug Fixes

* **public:** fix the sticky detection for public table ([#250](https://github.com/sbb-design-systems/sbb-angular/issues/250)) ([84b5241](https://github.com/sbb-design-systems/sbb-angular/commit/84b5241)), closes [#247](https://github.com/sbb-design-systems/sbb-angular/issues/247)
* assure hidden native input elements are positioned close to label ([#248](https://github.com/sbb-design-systems/sbb-angular/issues/248)) ([d5e43e9](https://github.com/sbb-design-systems/sbb-angular/commit/d5e43e9)), closes [#243](https://github.com/sbb-design-systems/sbb-angular/issues/243)



### [8.7.11](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.10...8.7.11) (2019-12-06)


### Bug Fixes

* fix change detection for sbb-processflow-step title ([#238](https://github.com/sbb-design-systems/sbb-angular/issues/238)) ([4cfc9e0](https://github.com/sbb-design-systems/sbb-angular/commit/4cfc9e0))
* limit header icon height to header height ([#237](https://github.com/sbb-design-systems/sbb-angular/issues/237)) ([633f05a](https://github.com/sbb-design-systems/sbb-angular/commit/633f05a)), closes [#204](https://github.com/sbb-design-systems/sbb-angular/issues/204)
* limit sbb-select dropdown width to host ([#239](https://github.com/sbb-design-systems/sbb-angular/issues/239)) ([847fcc4](https://github.com/sbb-design-systems/sbb-angular/commit/847fcc4)), closes [#220](https://github.com/sbb-design-systems/sbb-angular/issues/220)



### [8.7.10](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.9...8.7.10) (2019-11-27)


### Bug Fixes

* **business:** fix stacking order and border issue ([#234](https://github.com/sbb-design-systems/sbb-angular/issues/234)) ([54a7a36](https://github.com/sbb-design-systems/sbb-angular/commit/54a7a36)), closes [#219](https://github.com/sbb-design-systems/sbb-angular/issues/219)
* fix the overflow styling of usermenu ([#232](https://github.com/sbb-design-systems/sbb-angular/issues/232)) ([bac0c11](https://github.com/sbb-design-systems/sbb-angular/commit/bac0c11)), closes [#164](https://github.com/sbb-design-systems/sbb-angular/issues/164) [#172](https://github.com/sbb-design-systems/sbb-angular/issues/172)
* fix the radio click with selected text ([#229](https://github.com/sbb-design-systems/sbb-angular/issues/229)) ([195a28d](https://github.com/sbb-design-systems/sbb-angular/commit/195a28d)), closes [#222](https://github.com/sbb-design-systems/sbb-angular/issues/222)
* on error display sbb-select with red color and border ([#233](https://github.com/sbb-design-systems/sbb-angular/issues/233)) ([7214487](https://github.com/sbb-design-systems/sbb-angular/commit/7214487))
* relax amount of tabs check ([#230](https://github.com/sbb-design-systems/sbb-angular/issues/230)) ([d5f367b](https://github.com/sbb-design-systems/sbb-angular/commit/d5f367b))
* set min size for radio button and checkbox icon ([#231](https://github.com/sbb-design-systems/sbb-angular/issues/231)) ([20037b4](https://github.com/sbb-design-systems/sbb-angular/commit/20037b4)), closes [#141](https://github.com/sbb-design-systems/sbb-angular/issues/141)
* **business:** show overflow for header menu ([#228](https://github.com/sbb-design-systems/sbb-angular/issues/228)) ([48e2847](https://github.com/sbb-design-systems/sbb-angular/commit/48e2847))
* **datepicker:** refactor usage of TitleCasePipe to DateAdapter ([#227](https://github.com/sbb-design-systems/sbb-angular/issues/227)) ([ca0f4fa](https://github.com/sbb-design-systems/sbb-angular/commit/ca0f4fa)), closes [#226](https://github.com/sbb-design-systems/sbb-angular/issues/226)



### [8.7.9](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.8...8.7.9) (2019-11-22)


### Bug Fixes

* **showcase:** fix position of header menu hint ([6347200](https://github.com/sbb-design-systems/sbb-angular/commit/6347200))



### [8.7.8](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.7...8.7.8) (2019-11-22)


### Build System

* fix npm publish config ([d846cdc](https://github.com/sbb-design-systems/sbb-angular/commit/d846cdc))



### [8.7.7](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.6...8.7.7) (2019-11-22)


### Build System

* fix npm publish config ([c443b14](https://github.com/sbb-design-systems/sbb-angular/commit/c443b14))



### [8.7.6](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.5...8.7.6) (2019-11-22)


### Bug Fixes

* **showcase:** remove duplicate introduction link ([fee613b](https://github.com/sbb-design-systems/sbb-angular/commit/fee613b))



### [8.7.5](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.4...8.7.5) (2019-11-22)


### Build System

* fix npm publish config ([04708a9](https://github.com/sbb-design-systems/sbb-angular/commit/04708a9))



### [8.7.4](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.3...8.7.4) (2019-11-22)


### Build System

* fix npm publish config ([a0e8bea](https://github.com/sbb-design-systems/sbb-angular/commit/a0e8bea))



### [8.7.3](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.2...8.7.3) (2019-11-22)


### Build System

* fix npm publish config ([c5acedc](https://github.com/sbb-design-systems/sbb-angular/commit/c5acedc))



### [8.7.2](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.1...8.7.2) (2019-11-22)


### Build System

* fix npm token configuration ([2347007](https://github.com/sbb-design-systems/sbb-angular/commit/2347007))



### [8.7.1](https://github.com/sbb-design-systems/sbb-angular/compare/8.7.0...8.7.1) (2019-11-22)


### Build System

* fix npm publish token ([d38ac0d](https://github.com/sbb-design-systems/sbb-angular/commit/d38ac0d))



## [8.7.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.6.0...8.7.0) (2019-11-22)


### Build System

* build the showcase on release ([d264228](https://github.com/sbb-design-systems/sbb-angular/commit/d264228))
* migrate public to business components for documentation ([f634391](https://github.com/sbb-design-systems/sbb-angular/commit/f634391))
* normalize build commands ([#215](https://github.com/sbb-design-systems/sbb-angular/issues/215)) ([8ed7485](https://github.com/sbb-design-systems/sbb-angular/commit/8ed7485))
* switch from travis-ci to github actions ([#214](https://github.com/sbb-design-systems/sbb-angular/issues/214)) ([8a83ff5](https://github.com/sbb-design-systems/sbb-angular/commit/8a83ff5))


### Features

* **business:** implement dialog component ([#202](https://github.com/sbb-design-systems/sbb-angular/issues/202)) ([e625c59](https://github.com/sbb-design-systems/sbb-angular/commit/e625c59)), closes [#92](https://github.com/sbb-design-systems/sbb-angular/issues/92)
* **business:** implement responsive menus for header ([#224](https://github.com/sbb-design-systems/sbb-angular/issues/224)) ([688bcf4](https://github.com/sbb-design-systems/sbb-angular/commit/688bcf4))
* **business:** implement tabs ([#210](https://github.com/sbb-design-systems/sbb-angular/issues/210)) ([dda0b43](https://github.com/sbb-design-systems/sbb-angular/commit/dda0b43))
* **core:** add sbb sso constants ([#205](https://github.com/sbb-design-systems/sbb-angular/issues/205)) ([ca67252](https://github.com/sbb-design-systems/sbb-angular/commit/ca67252))
* **public:** add optional callbacks to jump marks in notification ([#211](https://github.com/sbb-design-systems/sbb-angular/issues/211)) ([302dc24](https://github.com/sbb-design-systems/sbb-angular/commit/302dc24)), closes [#131](https://github.com/sbb-design-systems/sbb-angular/issues/131)



## [8.6.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.5.0...8.6.0) (2019-10-04)


### Bug Fixes

* **business:** add icon content child to button component and template ([#188](https://github.com/sbb-design-systems/sbb-angular/issues/188)) ([93307d0](https://github.com/sbb-design-systems/sbb-angular/commit/93307d0))
* autocomplete freezes on backspacing ([#182](https://github.com/sbb-design-systems/sbb-angular/issues/182)) ([2e881cb](https://github.com/sbb-design-systems/sbb-angular/commit/2e881cb)), closes [#144](https://github.com/sbb-design-systems/sbb-angular/issues/144)
* normalized radio button behavior ([#183](https://github.com/sbb-design-systems/sbb-angular/issues/183)) ([ec0a25e](https://github.com/sbb-design-systems/sbb-angular/commit/ec0a25e)), closes [#126](https://github.com/sbb-design-systems/sbb-angular/issues/126)
* tooltip positioning is now inside the viewport ([#181](https://github.com/sbb-design-systems/sbb-angular/issues/181)) ([dd5ba09](https://github.com/sbb-design-systems/sbb-angular/commit/dd5ba09)), closes [#176](https://github.com/sbb-design-systems/sbb-angular/issues/176)
* **icons:** set focusable to false for svg icons ([#174](https://github.com/sbb-design-systems/sbb-angular/issues/174)) ([f19ef24](https://github.com/sbb-design-systems/sbb-angular/commit/f19ef24)), closes [#155](https://github.com/sbb-design-systems/sbb-angular/issues/155)


### Features

* **business:** adapt usermenu styling ([#190](https://github.com/sbb-design-systems/sbb-angular/issues/190)) ([0b36f48](https://github.com/sbb-design-systems/sbb-angular/commit/0b36f48)), closes [#91](https://github.com/sbb-design-systems/sbb-angular/issues/91)
* **business:** implement app chooser and responsive mode for header ([#192](https://github.com/sbb-design-systems/sbb-angular/issues/192)) ([4d99161](https://github.com/sbb-design-systems/sbb-angular/commit/4d99161))
* provide sbb-radio-group for radio-button type components ([#186](https://github.com/sbb-design-systems/sbb-angular/issues/186)) ([bc7cad2](https://github.com/sbb-design-systems/sbb-angular/commit/bc7cad2)), closes [#184](https://github.com/sbb-design-systems/sbb-angular/issues/184)

### Deprecation Notice:
* Form controls on individual radion buttons and radio button panels are being deprecated. Form controls should be defined on sbb-radio-group. See the documentation on Radio Buttons and Radio Button Panels on how to use it.



## [8.5.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.4.1...8.5.0) (2019-09-20)


### Bug Fixes

* **showcase:** correct import from [@angular](https://github.com/angular) to [@sbb-esta](https://github.com/sbb-esta) ([#180](https://github.com/sbb-design-systems/sbb-angular/issues/180)) ([fac7916](https://github.com/sbb-design-systems/sbb-angular/commit/fac7916))
* **table:** show pin mode shadow with OnPush change detection ([#179](https://github.com/sbb-design-systems/sbb-angular/issues/179)) ([d97749a](https://github.com/sbb-design-systems/sbb-angular/commit/d97749a)), closes [#177](https://github.com/sbb-design-systems/sbb-angular/issues/177)


### Features

* **header:** allow custom components for user menu and as additional header elements ([a4cf3e6](https://github.com/sbb-design-systems/sbb-angular/commit/a4cf3e6))



### [8.4.1](https://github.com/sbb-design-systems/sbb-angular/compare/8.4.0...8.4.1) (2019-09-17)


### Bug Fixes

* **showcase:** fix code formatting ([dfdb037](https://github.com/sbb-design-systems/sbb-angular/commit/dfdb037))



## [8.4.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.3.3...8.4.0) (2019-09-17)


### Bug Fixes

* handle scrolling correctly ([#168](https://github.com/sbb-design-systems/sbb-angular/issues/168)) ([c9fa496](https://github.com/sbb-design-systems/sbb-angular/commit/c9fa496)), closes [#161](https://github.com/sbb-design-systems/sbb-angular/issues/161)
* **showcase:** fix example code loading ([#167](https://github.com/sbb-design-systems/sbb-angular/issues/167)) ([2e85d3d](https://github.com/sbb-design-systems/sbb-angular/commit/2e85d3d)), closes [#165](https://github.com/sbb-design-systems/sbb-angular/issues/165)


### Features

* **autocomplete:** implement autocomplete hint ([#158](https://github.com/sbb-design-systems/sbb-angular/issues/158)) ([df5f9d2](https://github.com/sbb-design-systems/sbb-angular/commit/df5f9d2)), closes [#154](https://github.com/sbb-design-systems/sbb-angular/issues/154)
* **business:** implement contextmenu ([#163](https://github.com/sbb-design-systems/sbb-angular/issues/163)) ([23fea1f](https://github.com/sbb-design-systems/sbb-angular/commit/23fea1f)), closes [#80](https://github.com/sbb-design-systems/sbb-angular/issues/80)
* **business:** implement hover mode for tooltip ([#170](https://github.com/sbb-design-systems/sbb-angular/issues/170)) ([f25430f](https://github.com/sbb-design-systems/sbb-angular/commit/f25430f)), closes [#110](https://github.com/sbb-design-systems/sbb-angular/issues/110)
* **public:** use perfect-scrollbar in sbb-table ([#173](https://github.com/sbb-design-systems/sbb-angular/issues/173)) ([b817f21](https://github.com/sbb-design-systems/sbb-angular/commit/b817f21)), closes [#35](https://github.com/sbb-design-systems/sbb-angular/issues/35)



### [8.3.3](https://github.com/sbb-design-systems/sbb-angular/compare/8.3.2...8.3.3) (2019-09-10)


### Bug Fixes

* **core:** add missing sass files ([#162](https://github.com/sbb-design-systems/sbb-angular/issues/162)) ([8733e70](https://github.com/sbb-design-systems/sbb-angular/commit/8733e70))



### [8.3.2](https://github.com/sbb-design-systems/sbb-angular/compare/8.3.1...8.3.2) (2019-09-10)


### Bug Fixes

* remove autogenerated from business components html ([6f7b00e](https://github.com/sbb-design-systems/sbb-angular/commit/6f7b00e))



### [8.3.1](https://github.com/sbb-design-systems/sbb-angular/compare/8.3.0...8.3.1) (2019-09-09)


### Build System

* adapt publish script ([0e69c9f](https://github.com/sbb-design-systems/sbb-angular/commit/0e69c9f))



## [8.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.2.2...8.3.0) (2019-09-09)


### Bug Fixes

* **business/accordion:** remove media query breakpoints ([#139](https://github.com/sbb-design-systems/sbb-angular/issues/139)) ([0e3d16a](https://github.com/sbb-design-systems/sbb-angular/commit/0e3d16a))
* **file-selector:** fix upload with two way binding update ([#135](https://github.com/sbb-design-systems/sbb-angular/issues/135)) ([53de7b1](https://github.com/sbb-design-systems/sbb-angular/commit/53de7b1)), closes [#115](https://github.com/sbb-design-systems/sbb-angular/issues/115)
* **public/ghettobox:** correct line-height for icons ([#117](https://github.com/sbb-design-systems/sbb-angular/issues/117)) ([038185a](https://github.com/sbb-design-systems/sbb-angular/commit/038185a))
* **table:** fix tableAlignment for table headers in IE11 ([#133](https://github.com/sbb-design-systems/sbb-angular/issues/133)) ([1e5b950](https://github.com/sbb-design-systems/sbb-angular/commit/1e5b950)), closes [#122](https://github.com/sbb-design-systems/sbb-angular/issues/122)
* **toggle:** accept initial value for state ([#130](https://github.com/sbb-design-systems/sbb-angular/issues/130)) ([1851c94](https://github.com/sbb-design-systems/sbb-angular/commit/1851c94)), closes [#120](https://github.com/sbb-design-systems/sbb-angular/issues/120)
* **toggle:** fire toggleChange only when status actually changes ([#137](https://github.com/sbb-design-systems/sbb-angular/issues/137)) ([5b4c8a5](https://github.com/sbb-design-systems/sbb-angular/commit/5b4c8a5)), closes [#136](https://github.com/sbb-design-systems/sbb-angular/issues/136)
* **toggle:** use for-loop in place of forEach on NodeList ([#134](https://github.com/sbb-design-systems/sbb-angular/issues/134)) ([494d46b](https://github.com/sbb-design-systems/sbb-angular/commit/494d46b)), closes [#125](https://github.com/sbb-design-systems/sbb-angular/issues/125)
* **usermenu:** fix arrow overlap ([#138](https://github.com/sbb-design-systems/sbb-angular/issues/138)) ([cd99723](https://github.com/sbb-design-systems/sbb-angular/commit/cd99723)), closes [#132](https://github.com/sbb-design-systems/sbb-angular/issues/132)
* **usermenu:** fix layout after click ([#128](https://github.com/sbb-design-systems/sbb-angular/issues/128)) ([21dd37c](https://github.com/sbb-design-systems/sbb-angular/commit/21dd37c)), closes [#124](https://github.com/sbb-design-systems/sbb-angular/issues/124)


### Features

* expose secondary endpoints for all modules ([#156](https://github.com/sbb-design-systems/sbb-angular/issues/156)) ([cb10b27](https://github.com/sbb-design-systems/sbb-angular/commit/cb10b27)), closes [#147](https://github.com/sbb-design-systems/sbb-angular/issues/147)
* **business/header:** implement header component ([#148](https://github.com/sbb-design-systems/sbb-angular/issues/148)) ([daf44cb](https://github.com/sbb-design-systems/sbb-angular/commit/daf44cb))
* **business/processflow:** implement processflow for business ([#153](https://github.com/sbb-design-systems/sbb-angular/issues/153)) ([0e00da6](https://github.com/sbb-design-systems/sbb-angular/commit/0e00da6)), closes [#140](https://github.com/sbb-design-systems/sbb-angular/issues/140)



### [8.2.2](https://github.com/sbb-design-systems/sbb-angular/compare/8.2.1...8.2.2) (2019-07-23)


### Bug Fixes

* **table:** fix align helper classes for .sbb-table ([#113](https://github.com/sbb-design-systems/sbb-angular/issues/113)) ([fad4627](https://github.com/sbb-design-systems/sbb-angular/commit/fad4627)), closes [#112](https://github.com/sbb-design-systems/sbb-angular/issues/112)



### [8.2.1](https://github.com/sbb-design-systems/sbb-angular/compare/8.2.0...8.2.1) (2019-07-16)


### Bug Fixes

* **business/checkbox:** add sbb-checkbox class to public and business ([#109](https://github.com/sbb-design-systems/sbb-angular/issues/109)) ([3c4a4e5](https://github.com/sbb-design-systems/sbb-angular/commit/3c4a4e5))



## [8.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.1.2...8.2.0) (2019-07-16)


### Bug Fixes

* **keycloak:** do not add authorization header on unauthenticated ([#101](https://github.com/sbb-design-systems/sbb-angular/issues/101)) ([040ab71](https://github.com/sbb-design-systems/sbb-angular/commit/040ab71)), closes [#95](https://github.com/sbb-design-systems/sbb-angular/issues/95)
* **select:** fix native select icon in ie ([#105](https://github.com/sbb-design-systems/sbb-angular/issues/105)) ([cdbcb75](https://github.com/sbb-design-systems/sbb-angular/commit/cdbcb75)), closes [#102](https://github.com/sbb-design-systems/sbb-angular/issues/102)
* **textarea:** fix textarea update issue ([#107](https://github.com/sbb-design-systems/sbb-angular/issues/107)) ([103923f](https://github.com/sbb-design-systems/sbb-angular/commit/103923f)), closes [#106](https://github.com/sbb-design-systems/sbb-angular/issues/106)


### Build System

* add browserstack test environments ([#100](https://github.com/sbb-design-systems/sbb-angular/issues/100)) ([16010ad](https://github.com/sbb-design-systems/sbb-angular/commit/16010ad))
* configure branch for sonar ([#108](https://github.com/sbb-design-systems/sbb-angular/issues/108)) ([916e83f](https://github.com/sbb-design-systems/sbb-angular/commit/916e83f))


### Features

* **business/accordion:** expose accordion for business ([#99](https://github.com/sbb-design-systems/sbb-angular/issues/99)) ([1c231fd](https://github.com/sbb-design-systems/sbb-angular/commit/1c231fd)), closes [#77](https://github.com/sbb-design-systems/sbb-angular/issues/77)



### [8.1.2](https://github.com/sbb-design-systems/sbb-angular/compare/8.1.1...8.1.2) (2019-07-08)


### Bug Fixes

* **table:** pinMode fails gracefully on ie ([#94](https://github.com/sbb-design-systems/sbb-angular/issues/94)) ([75420e9](https://github.com/sbb-design-systems/sbb-angular/commit/75420e9)), closes [#58](https://github.com/sbb-design-systems/sbb-angular/issues/58)
* **typography:** fix font-size for fieldset 4k and 5k ([#71](https://github.com/sbb-design-systems/sbb-angular/issues/71)) ([e1d6808](https://github.com/sbb-design-systems/sbb-angular/commit/e1d6808))



### [8.1.1](https://github.com/sbb-design-systems/sbb-angular/compare/8.1.0...8.1.1) (2019-07-03)


### Bug Fixes

* **field:** fix missing css class ([#68](https://github.com/sbb-design-systems/sbb-angular/issues/68)) ([7400c83](https://github.com/sbb-design-systems/sbb-angular/commit/7400c83))



## [8.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.0.0...8.1.0) (2019-07-01)


### Bug Fixes

* **business/option:** change color of active/hover to red125 ([#59](https://github.com/sbb-design-systems/sbb-angular/issues/59)) ([ddee023](https://github.com/sbb-design-systems/sbb-angular/commit/ddee023))
* **checkbox:** fix change behavior for checkboxes ([#67](https://github.com/sbb-design-systems/sbb-angular/issues/67)) ([6fac950](https://github.com/sbb-design-systems/sbb-angular/commit/6fac950)), closes [#20](https://github.com/sbb-design-systems/sbb-angular/issues/20)
* **datepicker:** adds missing button type attributes ([#65](https://github.com/sbb-design-systems/sbb-angular/issues/65)) ([7b21600](https://github.com/sbb-design-systems/sbb-angular/commit/7b21600)), closes [#61](https://github.com/sbb-design-systems/sbb-angular/issues/61)
* **keycloak:** fixes wrong package name in README ([#63](https://github.com/sbb-design-systems/sbb-angular/issues/63)) ([d2846ad](https://github.com/sbb-design-systems/sbb-angular/commit/d2846ad))
* **select:** change arrow trigger position to absolute ([#60](https://github.com/sbb-design-systems/sbb-angular/issues/60)) ([92512c2](https://github.com/sbb-design-systems/sbb-angular/commit/92512c2))
* **table:** documents ie11 limitation of pinMode ([#64](https://github.com/sbb-design-systems/sbb-angular/issues/64)) ([f232240](https://github.com/sbb-design-systems/sbb-angular/commit/f232240)), closes [#58](https://github.com/sbb-design-systems/sbb-angular/issues/58)
* **textarea:** fixes no-wrap issue in edge ([#62](https://github.com/sbb-design-systems/sbb-angular/issues/62)) ([87c4db6](https://github.com/sbb-design-systems/sbb-angular/commit/87c4db6)), closes [#16](https://github.com/sbb-design-systems/sbb-angular/issues/16)


### Features

* **business/checkbox:** expose checkbox component for business ([#51](https://github.com/sbb-design-systems/sbb-angular/issues/51)) ([d666901](https://github.com/sbb-design-systems/sbb-angular/commit/d666901))



## [8.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/8.0.0-beta.0...8.0.0) (2019-06-25)


### Bug Fixes

* **business/button:** change font opacity for disabled buttons ([#53](https://github.com/sbb-design-systems/sbb-angular/issues/53)) ([977fb78](https://github.com/sbb-design-systems/sbb-angular/commit/977fb78))
* **business/field:** change gray color to fit style guide ([#55](https://github.com/sbb-design-systems/sbb-angular/issues/55)) ([fd3b6b4](https://github.com/sbb-design-systems/sbb-angular/commit/fd3b6b4))
* **business/radio-button:** change gray color of radio-buttons ([#52](https://github.com/sbb-design-systems/sbb-angular/issues/52)) ([f373ba3](https://github.com/sbb-design-systems/sbb-angular/commit/f373ba3))
* **datepicker:** fixes arrows change detection on manual change ([#46](https://github.com/sbb-design-systems/sbb-angular/issues/46)) ([b9c1efe](https://github.com/sbb-design-systems/sbb-angular/commit/b9c1efe)), closes [#40](https://github.com/sbb-design-systems/sbb-angular/issues/40)
* **datepicker:** fixes connected datepicker to only trigger on calendar selected date ([#45](https://github.com/sbb-design-systems/sbb-angular/issues/45)) ([47b2da8](https://github.com/sbb-design-systems/sbb-angular/commit/47b2da8)), closes [#36](https://github.com/sbb-design-systems/sbb-angular/issues/36)
* **pagination:** fixes pagination focus issues ([#54](https://github.com/sbb-design-systems/sbb-angular/issues/54)) ([1e1ce4b](https://github.com/sbb-design-systems/sbb-angular/commit/1e1ce4b)), closes [#17](https://github.com/sbb-design-systems/sbb-angular/issues/17)
* **processflow:** fixes click behavior for future steps ([#57](https://github.com/sbb-design-systems/sbb-angular/issues/57)) ([2e37b4a](https://github.com/sbb-design-systems/sbb-angular/commit/2e37b4a))
* **table:** fixes even row styling ([#48](https://github.com/sbb-design-systems/sbb-angular/issues/48)) ([227da9b](https://github.com/sbb-design-systems/sbb-angular/commit/227da9b)), closes [#29](https://github.com/sbb-design-systems/sbb-angular/issues/29)
* **textarea:** fixes placeholder issue and sizing behavior ([#44](https://github.com/sbb-design-systems/sbb-angular/issues/44)) ([8a87e6e](https://github.com/sbb-design-systems/sbb-angular/commit/8a87e6e)), closes [#16](https://github.com/sbb-design-systems/sbb-angular/issues/16)


### Build System

* ci ([#49](https://github.com/sbb-design-systems/sbb-angular/issues/49)) ([85bc0db](https://github.com/sbb-design-systems/sbb-angular/commit/85bc0db))


### Features

* **angular-keycloak:** migrates the auth part of esta-webjs-extensions ([#50](https://github.com/sbb-design-systems/sbb-angular/issues/50)) ([f6761c5](https://github.com/sbb-design-systems/sbb-angular/commit/f6761c5))
* **business/autocomplete:** expose autocomplete component for business ([#42](https://github.com/sbb-design-systems/sbb-angular/issues/42)) ([b7ec7c0](https://github.com/sbb-design-systems/sbb-angular/commit/b7ec7c0))
* **business/button:** expose button component for business ([#39](https://github.com/sbb-design-systems/sbb-angular/issues/39)) ([ed990a2](https://github.com/sbb-design-systems/sbb-angular/commit/ed990a2))
* **business/datepicker:** expose datepicker component for business  ([#47](https://github.com/sbb-design-systems/sbb-angular/issues/47)) ([57a075d](https://github.com/sbb-design-systems/sbb-angular/commit/57a075d))
* **business/field:** expose field component for business applications ([#32](https://github.com/sbb-design-systems/sbb-angular/issues/32)) ([403a97d](https://github.com/sbb-design-systems/sbb-angular/commit/403a97d))
* **business/radio-button:** expose radio-button component for business  ([#43](https://github.com/sbb-design-systems/sbb-angular/issues/43)) ([7a81107](https://github.com/sbb-design-systems/sbb-angular/commit/7a81107))
* **business/select:** expose select component for business ([#41](https://github.com/sbb-design-systems/sbb-angular/issues/41)) ([0841237](https://github.com/sbb-design-systems/sbb-angular/commit/0841237))
* **business/textarea:** expose textarea component for business  ([#34](https://github.com/sbb-design-systems/sbb-angular/issues/34)) ([997be3c](https://github.com/sbb-design-systems/sbb-angular/commit/997be3c))
* **business/time-input:** expose time input component for business applications ([#33](https://github.com/sbb-design-systems/sbb-angular/issues/33)) ([b87a4a3](https://github.com/sbb-design-systems/sbb-angular/commit/b87a4a3))
* **i18n:** applies common pattern for i18n ids ([#56](https://github.com/sbb-design-systems/sbb-angular/issues/56)) ([d2c1838](https://github.com/sbb-design-systems/sbb-angular/commit/d2c1838))


### BREAKING CHANGES

* **i18n:** i18n ids have changed.
* **pagination:** Removes link variants of pagination and navigation
components. The link variants caused focus issues, which can not easily
be resolved. If you need the link variants, you can open a feature request
and we will have another look at it.
Several properties of sbb-pagination have been renamed or refactored.
Check the documentation for the new specification.



## [8.0.0-beta.0](https://github.com/sbb-design-systems/sbb-angular/compare/7.0.0...8.0.0-beta.0) (2019-06-14)


### refactor

* move and refactor sass files ([#28](https://github.com/sbb-design-systems/sbb-angular/issues/28)) ([f2ac62d](https://github.com/sbb-design-systems/sbb-angular/commit/f2ac62d))


### BREAKING CHANGES

* Removed component mixins from published stles.scss and renamed scss color variables to pattern sbbColor*Name* (names used from https://digital.sbb.ch/en/farben)



## [7.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/v1.1.0...7.0.0) (2019-05-28)


### Bug Fixes

* **datepicker:** convert 2-digit years to 19xx or 20xx ([#14](https://github.com/sbb-design-systems/sbb-angular/issues/14)) ([70b22ee](https://github.com/sbb-design-systems/sbb-angular/commit/70b22ee)), closes [#13](https://github.com/sbb-design-systems/sbb-angular/issues/13)
* **datepicker:** fix invalid input on empty input ([#10](https://github.com/sbb-design-systems/sbb-angular/issues/10)) ([0368615](https://github.com/sbb-design-systems/sbb-angular/commit/0368615)), closes [#9](https://github.com/sbb-design-systems/sbb-angular/issues/9)
* **datepicker:** fixes arrow navigation with min and max dates ([#12](https://github.com/sbb-design-systems/sbb-angular/issues/12)) ([a2d1d08](https://github.com/sbb-design-systems/sbb-angular/commit/a2d1d08)), closes [#11](https://github.com/sbb-design-systems/sbb-angular/issues/11)


### Features

* github preparation ([#1](https://github.com/sbb-design-systems/sbb-angular/issues/1)) ([7b73b5e](https://github.com/sbb-design-systems/sbb-angular/commit/7b73b5e))
* **angular-icons:** update icons ([#6](https://github.com/sbb-design-systems/sbb-angular/issues/6)) ([a579e74](https://github.com/sbb-design-systems/sbb-angular/commit/a579e74))
* **ci:** Set up ci/cd with Travis CI ([bcf4082](https://github.com/sbb-design-systems/sbb-angular/commit/bcf4082))


### Deprecations

* Icons in @sbb-esta/angular-public have been deprecated and will be removed in v8. Use the icons from '@sbb-esta/angular-icons instead. For a list of available icons, visit https://angular.app.sbb.ch/latest/icons-list.
