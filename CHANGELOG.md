# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [17.1.1](https://github.com/sbb-design-systems/sbb-angular/compare/17.1.0...17.1.1) (2023-11-27)

## [17.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/17.0.0...17.1.0) (2023-11-23)


### Features

* **journey-maps:** migrate to maplibre 3.6.1 ([#2095](https://github.com/sbb-design-systems/sbb-angular/issues/2095)) ([c4e5d58](https://github.com/sbb-design-systems/sbb-angular/commit/c4e5d58851e675161027ad924eb815bb98d96b00))


### Bug Fixes

* **angular/input:** change border color to smoke ([#2099](https://github.com/sbb-design-systems/sbb-angular/issues/2099)) ([7549ef9](https://github.com/sbb-design-systems/sbb-angular/commit/7549ef977fef6b5971ab8ee42a829188c53fcf99))
* **angular/sidebar:** change dark mode background to charcoal ([#2097](https://github.com/sbb-design-systems/sbb-angular/issues/2097)) ([b138fd5](https://github.com/sbb-design-systems/sbb-angular/commit/b138fd528554a0bdb3bad34adbe18debadc5fa27))
* **angular/sidebar:** darker hover color for sidebar items in dark mode ([#2103](https://github.com/sbb-design-systems/sbb-angular/issues/2103)) ([f2fd00b](https://github.com/sbb-design-systems/sbb-angular/commit/f2fd00b431202086053e2d6430e4f997aedec364))
* **angular/table:** change dark mode hover and active colors ([#2098](https://github.com/sbb-design-systems/sbb-angular/issues/2098)) ([accbcd0](https://github.com/sbb-design-systems/sbb-angular/commit/accbcd061a787b7a0a2a963b102268c16fd5d218))
* **deps:** update dependency @angular/cdk to v17.0.1 ([65b99d8](https://github.com/sbb-design-systems/sbb-angular/commit/65b99d817fcddd7c88449200d8b2c937eb9dcc3b))
* **deps:** update dependency maplibre-gl to v3.6.2 ([#2086](https://github.com/sbb-design-systems/sbb-angular/issues/2086)) ([67cfd76](https://github.com/sbb-design-systems/sbb-angular/commit/67cfd7626c386ce136853d20cb3e3c20894c0250))
* **journey-maps:** prevent console errors ([#2093](https://github.com/sbb-design-systems/sbb-angular/issues/2093)) ([60c35ae](https://github.com/sbb-design-systems/sbb-angular/commit/60c35aee93cfc871e2a23e5105d37e88d47441a9))
* **showcase:** make expandable table example working on all browsers ([#2101](https://github.com/sbb-design-systems/sbb-angular/issues/2101)) ([19c6f67](https://github.com/sbb-design-systems/sbb-angular/commit/19c6f6774cbb293c635f27e46f7faf5d6cf38392)), closes [#2100](https://github.com/sbb-design-systems/sbb-angular/issues/2100)

## [17.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/17.0.0-rc.0...17.0.0) (2023-11-13)


### Bug Fixes

* **deps:** update angular to v17.0.2 ([9ee3d86](https://github.com/sbb-design-systems/sbb-angular/commit/9ee3d86aecf1d629d5bba05f2d62070afefa1bc7))
* **multiple:** change dark mode background to midnight and fix some styles ([#2081](https://github.com/sbb-design-systems/sbb-angular/issues/2081)) ([21b5a31](https://github.com/sbb-design-systems/sbb-angular/commit/21b5a31308c4a4e4c2a6079d302e3e6786219f21))

## [17.0.0-rc.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.0.0...17.0.0-rc.0) (2023-11-08)


### ⚠ BREAKING CHANGES

* Upgrade to Angular 17.
* **multiple:** add dark mode for the lean design variant. The mode chosen is based on the system settings. To enforce a specific mode, you can add the `sbb-light` or `sbb-dark` class to the `<html>` element.


### Features

* **angular/autocomplete:** add input to require selection from the panel ([#1952](https://github.com/sbb-design-systems/sbb-angular/issues/1952)) ([4c7667e](https://github.com/sbb-design-systems/sbb-angular/commit/4c7667ef8acaacd331f81dd26de13adc58989dc8))
* **angular/autocomplete:** don't assign to model value while typing … ([#1965](https://github.com/sbb-design-systems/sbb-angular/issues/1965)) ([a6cb36d](https://github.com/sbb-design-systems/sbb-angular/commit/a6cb36d03d41cf50be43f2744ed14a84a2a1ebdd)), closes [#1952](https://github.com/sbb-design-systems/sbb-angular/issues/1952)
* **angular/datepicker:** add option to prevent entering overflowing dates ([#1787](https://github.com/sbb-design-systems/sbb-angular/issues/1787)) ([ceb69ce](https://github.com/sbb-design-systems/sbb-angular/commit/ceb69cee524c122265319030b55566336ca2262b)), closes [#1761](https://github.com/sbb-design-systems/sbb-angular/issues/1761)
* **angular/datepicker:** expose calendar and make configurable ([#1762](https://github.com/sbb-design-systems/sbb-angular/issues/1762)) ([5494134](https://github.com/sbb-design-systems/sbb-angular/commit/5494134f39349a00cb08ef6aa3131a7388060541)), closes [#1671](https://github.com/sbb-design-systems/sbb-angular/issues/1671)
* **angular/dialog:** expose rendered ComponentRef ([#1964](https://github.com/sbb-design-systems/sbb-angular/issues/1964)) ([4ad3a56](https://github.com/sbb-design-systems/sbb-angular/commit/4ad3a567129c4bb37a40e67a93aae16c0d9ee177))
* **angular/header-lean:** add directive to display icon buttons in header ([#1953](https://github.com/sbb-design-systems/sbb-angular/issues/1953)) ([994f2aa](https://github.com/sbb-design-systems/sbb-angular/commit/994f2aa5396e7aca89e6065411ec379916fcb3c0)), closes [#902](https://github.com/sbb-design-systems/sbb-angular/issues/902)
* **angular/icon:** add schematic for migrating deprecated icons ([#2032](https://github.com/sbb-design-systems/sbb-angular/issues/2032)) ([efd3a14](https://github.com/sbb-design-systems/sbb-angular/commit/efd3a14a9223efe3eac9c75ba5735847431caa78))
* **angular/icon:** update to new icons and pictograms ([#1889](https://github.com/sbb-design-systems/sbb-angular/issues/1889)) ([26c5933](https://github.com/sbb-design-systems/sbb-angular/commit/26c5933add7a3d3affa0d1b5f97b3effc9189765)), closes [#1871](https://github.com/sbb-design-systems/sbb-angular/issues/1871)
* **journey-maps:** 2d toggle ([#2051](https://github.com/sbb-design-systems/sbb-angular/issues/2051)) ([bb2daad](https://github.com/sbb-design-systems/sbb-angular/commit/bb2daad4414384e26b74bdb230e3a0c9358e27fd))
* **journey-maps:** add dropdown for POI category selection ([#1835](https://github.com/sbb-design-systems/sbb-angular/issues/1835)) ([9b2ec99](https://github.com/sbb-design-systems/sbb-angular/commit/9b2ec99b1e4323c21c0519b90ee20092c9e04e89))
* **journey-maps:** add new POIs subcategories ([#1765](https://github.com/sbb-design-systems/sbb-angular/issues/1765)) ([7bb0594](https://github.com/sbb-design-systems/sbb-angular/commit/7bb05948eeaa7fbf83b5365e5b899a63f43f92d1))
* **journey-maps:** add new POIs subcategories for angular showcase as well ([#1766](https://github.com/sbb-design-systems/sbb-angular/issues/1766)) ([4bf6383](https://github.com/sbb-design-systems/sbb-angular/commit/4bf6383a4ad40b226dfbd6a129b3e9a699e59d80))
* **journey-maps:** add on_demand pois ([#1945](https://github.com/sbb-design-systems/sbb-angular/issues/1945)) ([ec25d47](https://github.com/sbb-design-systems/sbb-angular/commit/ec25d47a1d5c0f67888da357695964791c99e49e))
* **journey-maps:** add SbbRailNetworkOptions ([#1837](https://github.com/sbb-design-systems/sbb-angular/issues/1837)) ([5cfa7fe](https://github.com/sbb-design-systems/sbb-angular/commit/5cfa7fe8c7568c832c81b2268d4fe3ae97923714))
* **journey-maps:** add web-component examples page ([#1948](https://github.com/sbb-design-systems/sbb-angular/issues/1948)) ([53484f1](https://github.com/sbb-design-systems/sbb-angular/commit/53484f16a5c8c4a66eecaed9e088f278049cadc8))
* **journey-maps:** allow programmatically selecting and deselecting a POI ([#1943](https://github.com/sbb-design-systems/sbb-angular/issues/1943)) ([812e470](https://github.com/sbb-design-systems/sbb-angular/commit/812e470e78f92615bbed617302700725f0593074))
* **journey-maps:** custom map attribution component ([#1845](https://github.com/sbb-design-systems/sbb-angular/issues/1845)) ([fc666f5](https://github.com/sbb-design-systems/sbb-angular/commit/fc666f520ff60b507d6a994a10f2073d934e2613))
* **journey-maps:** deselect pois ([#1910](https://github.com/sbb-design-systems/sbb-angular/issues/1910)) ([b6f10f3](https://github.com/sbb-design-systems/sbb-angular/commit/b6f10f3c4f5108d80e99251fd7673ce435c79d55))
* **journey-maps:** display bounding box info ([#1813](https://github.com/sbb-design-systems/sbb-angular/issues/1813)) ([f89ff21](https://github.com/sbb-design-systems/sbb-angular/commit/f89ff21fc321794cc05689663b7ec734bed7cb01))
* **journey-maps:** extend poi-url-generation with preview flag ([#1899](https://github.com/sbb-design-systems/sbb-angular/issues/1899)) ([366ead8](https://github.com/sbb-design-systems/sbb-angular/commit/366ead8fac8ecf217ae5f4b3d0b0dc356e00531e))
* **journey-maps:** hide geolocate button by default ([#2019](https://github.com/sbb-design-systems/sbb-angular/issues/2019)) ([2a5a4b4](https://github.com/sbb-design-systems/sbb-angular/commit/2a5a4b4a7e5fdff9c63e46617e00cd3130c39288))
* **journey-maps:** improved route hover ([#1828](https://github.com/sbb-design-systems/sbb-angular/issues/1828)) ([08e77ea](https://github.com/sbb-design-systems/sbb-angular/commit/08e77eaa500fff26101c3444e2f0d0429ac28a23))
* **journey-maps:** journey start- and end-station clickable ([#1865](https://github.com/sbb-design-systems/sbb-angular/issues/1865)) ([69f307d](https://github.com/sbb-design-systems/sbb-angular/commit/69f307d0199aae7a800c7da638d358e003b1dc11))
* **journey-maps:** prohibit simultaneous selection of sbb marker and poi ([#1959](https://github.com/sbb-design-systems/sbb-angular/issues/1959)) ([878be32](https://github.com/sbb-design-systems/sbb-angular/commit/878be32c1f2602a1460b9cbc44e9073f80ddc241))
* **journey-maps:** provide mock data with indoor transfer ([#1951](https://github.com/sbb-design-systems/sbb-angular/issues/1951)) ([d88b50b](https://github.com/sbb-design-systems/sbb-angular/commit/d88b50bf518100ef0a4faf8e295f7d602655eec0))
* **journey-maps:** removed indoor pois in examples ([#1960](https://github.com/sbb-design-systems/sbb-angular/issues/1960)) ([941fc86](https://github.com/sbb-design-systems/sbb-angular/commit/941fc861bd4ec50a31c2891074d2b5ea59efc179))
* **journey-maps:** show geolocation with custom control ([#2011](https://github.com/sbb-design-systems/sbb-angular/issues/2011)) ([cdc9444](https://github.com/sbb-design-systems/sbb-angular/commit/cdc944495d7db1090c54df12dc960d34a1166c7f))
* **journey-maps:** show stack-blitz example link ([#1927](https://github.com/sbb-design-systems/sbb-angular/issues/1927)) ([c5797fe](https://github.com/sbb-design-systems/sbb-angular/commit/c5797fee2c1e8882dca2c9fe1ca0bc54a53ca0a3))
* **journey-maps:** switch between 2D and 3D layers ([#1814](https://github.com/sbb-design-systems/sbb-angular/issues/1814)) ([b5c215b](https://github.com/sbb-design-systems/sbb-angular/commit/b5c215b7083c085fd3390dd3c16da2f6d78e3265))
* **journey-maps:** switch to map style 'ki_v2' ([#1769](https://github.com/sbb-design-systems/sbb-angular/issues/1769)) ([0360a1c](https://github.com/sbb-design-systems/sbb-angular/commit/0360a1c37afb4106095c4eaa862a870cc7653d65))
* **journey-maps:** use the new aerial style 'aerial_sbb_ki_v2' ([#1811](https://github.com/sbb-design-systems/sbb-angular/issues/1811)) ([0cbc546](https://github.com/sbb-design-systems/sbb-angular/commit/0cbc5461746ef7d31cd0f10b506910d7f06d2dae))
* **journey-maps:** v1 route hover ([#1829](https://github.com/sbb-design-systems/sbb-angular/issues/1829)) ([001f4ed](https://github.com/sbb-design-systems/sbb-angular/commit/001f4edbfb95db8e3790c8edc33fa5f999a18066))
* **journey-pois:** added on-demand pois to interface ([#1938](https://github.com/sbb-design-systems/sbb-angular/issues/1938)) ([4955c20](https://github.com/sbb-design-systems/sbb-angular/commit/4955c20039836d533fd70333f2a8f1a58da73dc2))
* **journey-maps:** bind method for web component ([#1928](https://github.com/sbb-design-systems/sbb-angular/issues/1928)) ([e58b6cb](https://github.com/sbb-design-systems/sbb-angular/commit/e58b6cb07d6ddaa1a5a4f67ba80423ba0ee288c6))
* **journey-maps:** implement bbox event emitter ([#1807](https://github.com/sbb-design-systems/sbb-angular/issues/1807)) ([00ae372](https://github.com/sbb-design-systems/sbb-angular/commit/00ae3722d592e2e5619d9b34296b0e9b5c15121c))* **multiple:** add `sbb-off-brand-colors` style ([#1863](https://github.com/sbb-design-systems/sbb-angular/issues/1863)) ([5e0be1e](https://github.com/sbb-design-systems/sbb-angular/commit/5e0be1e8ce4e7f71b29d32f7198f16a9e5a9ea36))
* **journey-maps:** remove zone.js for web components ([#2045](https://github.com/sbb-design-systems/sbb-angular/issues/2045)) ([069dc79](https://github.com/sbb-design-systems/sbb-angular/commit/069dc7907e17dff299d81a7fa9dc9d7a6d6ce7e2))
* **multiple:** add `sbb-off-brand-colors` style ([#1863](https://github.com/sbb-design-systems/sbb-angular/issues/1863)) ([5e0be1e](https://github.com/sbb-design-systems/sbb-angular/commit/5e0be1e8ce4e7f71b29d32f7198f16a9e5a9ea36))
* **multiple:** implement dark mode ([#1983](https://github.com/sbb-design-systems/sbb-angular/issues/1983)) ([516b832](https://github.com/sbb-design-systems/sbb-angular/commit/516b832924615c659d15eacee6f76149d3dc4b79))
* **multiple:** update components to use new icons ([#1905](https://github.com/sbb-design-systems/sbb-angular/issues/1905)) ([ed1a5d9](https://github.com/sbb-design-systems/sbb-angular/commit/ed1a5d92d6afae79ee5089404086bd269cefbf44))
* **sbb-header-environment:** add 'inte' as a recognized environment ([#1912](https://github.com/sbb-design-systems/sbb-angular/issues/1912)) ([0d402d5](https://github.com/sbb-design-systems/sbb-angular/commit/0d402d5234516078be5a007a6c00810912cb023d))


### Bug Fixes

* **angular/accordion:** content visible when placed inside a hidden parent ([#1949](https://github.com/sbb-design-systems/sbb-angular/issues/1949)) ([1dfdc0b](https://github.com/sbb-design-systems/sbb-angular/commit/1dfdc0b1a09e78b38cb2d48f2d3a3fbcf504565f))
* **angular/autocomplete:**  requireSelection incorrectly resetting value when there are no options ([#2010](https://github.com/sbb-design-systems/sbb-angular/issues/2010)) ([69967f3](https://github.com/sbb-design-systems/sbb-angular/commit/69967f367f5cda0f4a4197b1a6ea71684b95a88c))
* **angular/autocomplete:** blocking events to other overlays when there are no results ([#1947](https://github.com/sbb-design-systems/sbb-angular/issues/1947)) ([296987a](https://github.com/sbb-design-systems/sbb-angular/commit/296987ac723162a560412ee0904f6296a3ef0e4b))
* **angular/autocomplete:** clear selected option if input is cleared ([#1946](https://github.com/sbb-design-systems/sbb-angular/issues/1946)) ([08c4931](https://github.com/sbb-design-systems/sbb-angular/commit/08c493160bb89868a6fd7559fa7edc5d0968ffdf))
* **angular/checkbox:** fix ARIA semantics and use native DOM properties ([#1850](https://github.com/sbb-design-systems/sbb-angular/issues/1850)) ([ac29d15](https://github.com/sbb-design-systems/sbb-angular/commit/ac29d15aa1a66ca058bc7b5f9da4a6e748827be2))
* **angular/core:** sbb-option sets aria-selected="false" ([#1847](https://github.com/sbb-design-systems/sbb-angular/issues/1847)) ([170db04](https://github.com/sbb-design-systems/sbb-angular/commit/170db04a7405a15ef0cced0ce8d790545d0fcb2d))
* **angular/datepicker:** avoid calendar being cut off on small screens ([#1869](https://github.com/sbb-design-systems/sbb-angular/issues/1869)) ([0414d11](https://github.com/sbb-design-systems/sbb-angular/commit/0414d112d210eb2e75741c19a317ae9a0d848a4b)), closes [#1819](https://github.com/sbb-design-systems/sbb-angular/issues/1819)
* **angular/datepicker:** remove div as a child of button ([#1866](https://github.com/sbb-design-systems/sbb-angular/issues/1866)) ([559a544](https://github.com/sbb-design-systems/sbb-angular/commit/559a544ac236db019d9af9b83a17e1ea2c06dcb5))
* **angular/datepicker:** update arrow keys of connected datepicker  ([#1858](https://github.com/sbb-design-systems/sbb-angular/issues/1858)) ([1336584](https://github.com/sbb-design-systems/sbb-angular/commit/1336584df894f44fdf565407ab7db424d79a9887)), closes [#1852](https://github.com/sbb-design-systems/sbb-angular/issues/1852)
* **angular/dialog:** scrollable content if no dialog height is defined ([#1804](https://github.com/sbb-design-systems/sbb-angular/issues/1804)) ([f4b16b1](https://github.com/sbb-design-systems/sbb-angular/commit/f4b16b1afd01aa1cfc3826bd90ab31e40bd85734)), closes [#1803](https://github.com/sbb-design-systems/sbb-angular/issues/1803)
* **angular/dialog:** update aria-labelledby if title is swapped ([#1973](https://github.com/sbb-design-systems/sbb-angular/issues/1973)) ([8f642ce](https://github.com/sbb-design-systems/sbb-angular/commit/8f642ced39ecb1509b10eae7c8ea568e36a14efa))
* **angular/menu:** explicitly set aria-expanded to true/false ([#1752](https://github.com/sbb-design-systems/sbb-angular/issues/1752)) ([e8a400a](https://github.com/sbb-design-systems/sbb-angular/commit/e8a400a437c6e691f992e155c43223b529b17622))
* **angular/radio:** clear selected radio button from group ([#1950](https://github.com/sbb-design-systems/sbb-angular/issues/1950)) ([49c89b8](https://github.com/sbb-design-systems/sbb-angular/commit/49c89b8ac34124025aad0fe4c240cc695d9b011c))
* **angular/select:** changed after checked error if option label changes ([#1753](https://github.com/sbb-design-systems/sbb-angular/issues/1753)) ([1b53276](https://github.com/sbb-design-systems/sbb-angular/commit/1b5327606d6c3759ca47765f9dd5419244d5e1a9))
* **angular/table:** resolve local compilation issues ([#1972](https://github.com/sbb-design-systems/sbb-angular/issues/1972)) ([d302398](https://github.com/sbb-design-systems/sbb-angular/commit/d30239811bb7e49d0e71ca0014b79d08ce086b1d))
* **angular/tabs:**  add aria-hidden to inactive tabs ([#2009](https://github.com/sbb-design-systems/sbb-angular/issues/2009)) ([beb166a](https://github.com/sbb-design-systems/sbb-angular/commit/beb166a559ed54788a6563fb69abd1459cc0b09b))
* **angular/tabs:** nav bar not navigating on enter presses ([#2033](https://github.com/sbb-design-systems/sbb-angular/issues/2033)) ([16831e2](https://github.com/sbb-design-systems/sbb-angular/commit/16831e2ff3421ee4fcb4552668cd6fd8bfcde659))
* ensure correct bundling of showcase ([#1823](https://github.com/sbb-design-systems/sbb-angular/issues/1823)) ([9fee0b7](https://github.com/sbb-design-systems/sbb-angular/commit/9fee0b7bb37bf3b0759ac671b798a2ca283a6197))
* **journey-maps:** allow deselecting pois even without popups ([e7ebb62](https://github.com/sbb-design-systems/sbb-angular/commit/e7ebb62f7f986b9f8b7b8ab27020050ad737d0cd))
* **journey-maps:** allow updating viewport dimensions multiple times ([#2039](https://github.com/sbb-design-systems/sbb-angular/issues/2039)) ([bf911e4](https://github.com/sbb-design-systems/sbb-angular/commit/bf911e4d24de18d92f488e00c484ec0149383115))
* **journey-maps:** automatically set the correct floor level for journey transfers ([#2047](https://github.com/sbb-design-systems/sbb-angular/issues/2047)) ([624efe0](https://github.com/sbb-design-systems/sbb-angular/commit/624efe0ef168a615760a2aebc4c9836e8474f587))
* **journey-maps:** display focused controls ([#1839](https://github.com/sbb-design-systems/sbb-angular/issues/1839)) ([9ec4e6f](https://github.com/sbb-design-systems/sbb-angular/commit/9ec4e6f5cd4330446610b4771f3256e64eff47a2))
* **journey-maps:** export web component CSS in package.json ([#1767](https://github.com/sbb-design-systems/sbb-angular/issues/1767)) ([e2696ec](https://github.com/sbb-design-systems/sbb-angular/commit/e2696ec5156e350d495175eaed9d0281c5d2b7ea))
* **journey-maps:** fix multiline attribution style ([#1873](https://github.com/sbb-design-systems/sbb-angular/issues/1873)) ([977be10](https://github.com/sbb-design-systems/sbb-angular/commit/977be10346c2797b8af7d47d80c14cff1470c523))
* **journey-maps:** keep button icon visible against black background ([#1840](https://github.com/sbb-design-systems/sbb-angular/issues/1840)) ([0556f05](https://github.com/sbb-design-systems/sbb-angular/commit/0556f055ae6296c5ccc5df2097e1657eee3be5e5))
* **journey-maps:** prevent error when unselecting POIs without previously selecting any ([#1963](https://github.com/sbb-design-systems/sbb-angular/issues/1963)) ([95a94aa](https://github.com/sbb-design-systems/sbb-angular/commit/95a94aac9073e8cbfc18c4b9ce36d5cfd2280ba4))
* **journey-maps:** let finger tip on mobile be dismissible ([#2056](https://github.com/sbb-design-systems/sbb-angular/issues/2056)) ([5ce3fe6](https://github.com/sbb-design-systems/sbb-angular/commit/5ce3fe6d05f1be36d589246942c9aa5295aef1b3))
* make rxjs imports forward compatible ([#1874](https://github.com/sbb-design-systems/sbb-angular/issues/1874)) ([e75c172](https://github.com/sbb-design-systems/sbb-angular/commit/e75c172ad56a5352543d05cbbbd4a515cd63a697)), closes [#1872](https://github.com/sbb-design-systems/sbb-angular/issues/1872)
* **multiple:** remove obsolete base classes ([#2004](https://github.com/sbb-design-systems/sbb-angular/issues/2004)) ([c82b316](https://github.com/sbb-design-systems/sbb-angular/commit/c82b3166450dbfb059d6911973a0ac889528fa34))
* **oauth:** parse token correctly to be able to parse unicode characters ([#1848](https://github.com/sbb-design-systems/sbb-angular/issues/1848)) ([7966ac6](https://github.com/sbb-design-systems/sbb-angular/commit/7966ac6753cf9f8ff5096ea1b1d8e87afbbd026a))
* remove engine entries in package.json ([#1795](https://github.com/sbb-design-systems/sbb-angular/issues/1795)) ([784b4d3](https://github.com/sbb-design-systems/sbb-angular/commit/784b4d34831240b2ebb902f4311d3b38a2d2d038))
* **stackblitz:** fix dependencies and registry ([#1916](https://github.com/sbb-design-systems/sbb-angular/issues/1916)) ([f2863b8](https://github.com/sbb-design-systems/sbb-angular/commit/f2863b8bc8f0ff383f0cf6f0a2fbc230f2bc5fe3))
* **stackblitz:** update stackblitz assets to v15 ([#1751](https://github.com/sbb-design-systems/sbb-angular/issues/1751)) ([8cf9a81](https://github.com/sbb-design-systems/sbb-angular/commit/8cf9a810dc0f49ecdc643ecfc9b52fd739ba3a4b))


### Documentation

* add deprecation note to `angular-maps` ([#1824](https://github.com/sbb-design-systems/sbb-angular/issues/1824)) ([ada24c1](https://github.com/sbb-design-systems/sbb-angular/commit/ada24c133abcdcd6d92641d21ea21090647efadd))
* added new GitHub issue templates ([#1833](https://github.com/sbb-design-systems/sbb-angular/issues/1833)) ([2bcb69a](https://github.com/sbb-design-systems/sbb-angular/commit/2bcb69ad8c33f53fbb46459914c3d59c7d5c9c3f))
* **angular/tabs:** add note when using together with `routerLink` ([#1942](https://github.com/sbb-design-systems/sbb-angular/issues/1942)) ([8840714](https://github.com/sbb-design-systems/sbb-angular/commit/8840714de2add589c941269a5fdb9c96e684f09f)), closes [#1941](https://github.com/sbb-design-systems/sbb-angular/issues/1941)
* **angular/tabs:** explain where to set 'selectedIndex' ([#1846](https://github.com/sbb-design-systems/sbb-angular/issues/1846)) ([eec721c](https://github.com/sbb-design-systems/sbb-angular/commit/eec721c1c03e7eebe81076e9555654b9f9d822c4))
* **angular/toggle:** clarify that first option will be selected by default ([#2042](https://github.com/sbb-design-systems/sbb-angular/issues/2042)) ([b6fa141](https://github.com/sbb-design-systems/sbb-angular/commit/b6fa1418393e88217a6f61c63b433f5ed11fc6da)), closes [#2041](https://github.com/sbb-design-systems/sbb-angular/issues/2041)
* convert examples to standalone ([#1919](https://github.com/sbb-design-systems/sbb-angular/issues/1919)) ([5cc3748](https://github.com/sbb-design-systems/sbb-angular/commit/5cc3748c637f77594b929b6f4e53648a9d955a43))
* explain how to start the app with the api key for journey-maps ([#1853](https://github.com/sbb-design-systems/sbb-angular/issues/1853)) ([5e5af7a](https://github.com/sbb-design-systems/sbb-angular/commit/5e5af7a4ff565120bb7ea72a554292dbbf6c9eee))
* **journey-maps:** add more information for the web-component ([#1913](https://github.com/sbb-design-systems/sbb-angular/issues/1913)) ([c285d1a](https://github.com/sbb-design-systems/sbb-angular/commit/c285d1a315d0d80576d9aeca04161744b8b820a6))
* **journey-maps:** document how to configure listenerOptions ([#1883](https://github.com/sbb-design-systems/sbb-angular/issues/1883)) ([e2b2297](https://github.com/sbb-design-systems/sbb-angular/commit/e2b2297ca95fed66204d8189102ed6d70c06d2f6))
* **journey-maps:** fix api docs ([#2008](https://github.com/sbb-design-systems/sbb-angular/issues/2008)) ([2fd4c48](https://github.com/sbb-design-systems/sbb-angular/commit/2fd4c488bef1d808a14416ed3739bc8c2d15ece3))
* **journey-maps:** help the user find the example source code ([#1911](https://github.com/sbb-design-systems/sbb-angular/issues/1911)) ([cb406ea](https://github.com/sbb-design-systems/sbb-angular/commit/cb406eaf20c78f84a3f648f1217c6dc32ffa3184))
* **journey-maps:** updated `journey-maps` maplibre css version to 2.4.0 ([#1836](https://github.com/sbb-design-systems/sbb-angular/issues/1836)) ([3a287e5](https://github.com/sbb-design-systems/sbb-angular/commit/3a287e5c9e1f09b856bdd84e1e971b5421af699e))
* **loading-indicator:** add note about fullbox mode ([#1792](https://github.com/sbb-design-systems/sbb-angular/issues/1792)) ([d065ded](https://github.com/sbb-design-systems/sbb-angular/commit/d065ded4a477d3440cbeb19dda35ea6225f411ae)), closes [#1791](https://github.com/sbb-design-systems/sbb-angular/issues/1791)
* make environment banner text configurable ([#1825](https://github.com/sbb-design-systems/sbb-angular/issues/1825)) ([08911c6](https://github.com/sbb-design-systems/sbb-angular/commit/08911c6ac3c9eb590d396a7904046533f35cbefc))
* update changelog ([20632c5](https://github.com/sbb-design-systems/sbb-angular/commit/20632c506724f1d57ebdd872b0798dc91551ba10))
* update changelog ([#1800](https://github.com/sbb-design-systems/sbb-angular/issues/1800)) ([b110b11](https://github.com/sbb-design-systems/sbb-angular/commit/b110b1120de913fa63384ce0e7024610c2dff6c2))
* update CODEOWNERS for journey-maps ([fb01fd0](https://github.com/sbb-design-systems/sbb-angular/commit/fb01fd03d67a2f95b57e121370f5e793bae38a25))

## [16.8.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.7.1...16.8.0) (2023-10-30)


### Features

* **journey-maps:** 2d toggle ([#2051](https://github.com/sbb-design-systems/sbb-angular/issues/2051)) ([6c621b1](https://github.com/sbb-design-systems/sbb-angular/commit/6c621b113c645c835ba340b7ce20db4eb4eb4498))


### Bug Fixes

* **deps:** update angular ([396ba6b](https://github.com/sbb-design-systems/sbb-angular/commit/396ba6b841db4e2c30b5abc59fccfdd7e0551868))
* **journey-maps:** let finger tip on mobile be dismissible ([#2056](https://github.com/sbb-design-systems/sbb-angular/issues/2056)) ([e00e21f](https://github.com/sbb-design-systems/sbb-angular/commit/e00e21f45b0c988874d697c3ef7a81a29568dfa9))

### [16.7.1](https://github.com/sbb-design-systems/sbb-angular/compare/16.7.0...16.7.1) (2023-10-16)


### Bug Fixes

* **angular/tabs:** nav bar not navigating on enter presses ([#2033](https://github.com/sbb-design-systems/sbb-angular/issues/2033)) ([47fa565](https://github.com/sbb-design-systems/sbb-angular/commit/47fa56527cf38942d38f94262addb048ce944af3))
* **journey-maps:** automatically set the correct floor level for journey transfers ([#2047](https://github.com/sbb-design-systems/sbb-angular/issues/2047)) ([486639d](https://github.com/sbb-design-systems/sbb-angular/commit/486639d6c6249d1be5d6317bbbf73f62c2c80daf))

## [16.7.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.6.1...16.7.0) (2023-10-12)


### Features

* **sbb-journey-maps:** remove zone.js for web components ([#2045](https://github.com/sbb-design-systems/sbb-angular/issues/2045)) ([98cd710](https://github.com/sbb-design-systems/sbb-angular/commit/98cd710cf102d522156d92ca43a81f104fea3663))


### Bug Fixes

* **journey-maps:** allow updating viewport dimensions multiple times ([#2039](https://github.com/sbb-design-systems/sbb-angular/issues/2039)) ([87321d2](https://github.com/sbb-design-systems/sbb-angular/commit/87321d2588a627d62209a58b83dfb879cd6089c9))


### Documentation

* **angular/toggle:** clarify that first option will be selected by default ([#2042](https://github.com/sbb-design-systems/sbb-angular/issues/2042)) ([9753822](https://github.com/sbb-design-systems/sbb-angular/commit/9753822aba6132000edc775e1d70726ef1b7184e)), closes [#2041](https://github.com/sbb-design-systems/sbb-angular/issues/2041)

### [16.6.1](https://github.com/sbb-design-systems/sbb-angular/compare/16.6.0...16.6.1) (2023-10-02)


### Bug Fixes

* **angular/table:** resolve local compilation issues ([#1972](https://github.com/sbb-design-systems/sbb-angular/issues/1972)) ([ff76206](https://github.com/sbb-design-systems/sbb-angular/commit/ff762062dafa97398384124a67c880713ff06cac))
* **journey-maps:** hide geolocate button by default ([#2019](https://github.com/sbb-design-systems/sbb-angular/issues/2019)) ([2b251c1](https://github.com/sbb-design-systems/sbb-angular/commit/2b251c18ba91d5a57cfe374f94ccb30917eb531f))

## [16.6.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.5.0...16.6.0) (2023-09-25)


### Features

* **journey-maps:** show geolocation with custom control ([#2011](https://github.com/sbb-design-systems/sbb-angular/issues/2011)) ([c5745c7](https://github.com/sbb-design-systems/sbb-angular/commit/c5745c7ac489bc61b6421a7d77664699d5e77026))


### Bug Fixes

* **angular/autocomplete:**  requireSelection incorrectly resetting value when there are no options ([#2010](https://github.com/sbb-design-systems/sbb-angular/issues/2010)) ([ad87bd7](https://github.com/sbb-design-systems/sbb-angular/commit/ad87bd73f018b7929737c3b6a3b71a5363162ae9))
* **angular/dialog:** update aria-labelledby if title is swapped ([#1973](https://github.com/sbb-design-systems/sbb-angular/issues/1973)) ([91069e6](https://github.com/sbb-design-systems/sbb-angular/commit/91069e617727789b18070a3a65ed2d0f02a335bd))
* **angular/tabs:**  add aria-hidden to inactive tabs ([#2009](https://github.com/sbb-design-systems/sbb-angular/issues/2009)) ([2fba36f](https://github.com/sbb-design-systems/sbb-angular/commit/2fba36f5a66d814fc1f7095c23a06f3327f36a71))
* **deps:** update angular to v16.2.1 ([#1971](https://github.com/sbb-design-systems/sbb-angular/issues/1971)) ([e36f343](https://github.com/sbb-design-systems/sbb-angular/commit/e36f3437cec8ca2121da228bcfccc4546827bc98))
* **deps:** update angular to v16.2.2 ([9cf27f0](https://github.com/sbb-design-systems/sbb-angular/commit/9cf27f054f993474f06b64be8ff9e550b518f383))
* **deps:** update angular to v16.2.4 ([f1c3b4c](https://github.com/sbb-design-systems/sbb-angular/commit/f1c3b4cb23e038ac6fbc26537c292ac8692d328c))
* **deps:** update dependency @angular/cdk to v16.2.3 ([645d108](https://github.com/sbb-design-systems/sbb-angular/commit/645d1082b27eecc19e74047792b5c991d0135c55))
* **deps:** update dependency tslib to v2.6.2 ([290d117](https://github.com/sbb-design-systems/sbb-angular/commit/290d11769fbe17f2d5438563fea48a700aac492e))


### Documentation

* **journey-maps:** fix api docs ([#2008](https://github.com/sbb-design-systems/sbb-angular/issues/2008)) ([2e9cf56](https://github.com/sbb-design-systems/sbb-angular/commit/2e9cf56f7921d91553d483d2be7618745668e241))

## [16.5.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.4.0...16.5.0) (2023-08-10)


### Features

* **angular/autocomplete:** add input to require selection from the panel ([#1952](https://github.com/sbb-design-systems/sbb-angular/issues/1952)) ([a324b31](https://github.com/sbb-design-systems/sbb-angular/commit/a324b31cf74b6c363c19ba93d8445ff1a3a9a005))
* **angular/autocomplete:** don't assign to model value while typing … ([#1965](https://github.com/sbb-design-systems/sbb-angular/issues/1965)) ([20d369c](https://github.com/sbb-design-systems/sbb-angular/commit/20d369cb794015ce743f5483b69ed205bcb76502)), closes [#1952](https://github.com/sbb-design-systems/sbb-angular/issues/1952)
* **angular/dialog:** expose rendered ComponentRef ([#1964](https://github.com/sbb-design-systems/sbb-angular/issues/1964)) ([0f4b55f](https://github.com/sbb-design-systems/sbb-angular/commit/0f4b55f218086331284d31ffde5d4674ab3d5896))
* **angular/header-lean:** add directive to display icon buttons in header ([#1953](https://github.com/sbb-design-systems/sbb-angular/issues/1953)) ([df858e3](https://github.com/sbb-design-systems/sbb-angular/commit/df858e3e39948ed0ca78cf59709e9fb6b8c10365)), closes [#902](https://github.com/sbb-design-systems/sbb-angular/issues/902)
* **journey-maps:** add web-component examples page ([#1948](https://github.com/sbb-design-systems/sbb-angular/issues/1948)) ([8f9fc9e](https://github.com/sbb-design-systems/sbb-angular/commit/8f9fc9eec16025fa6ca78217f12f9a1dc9251861))
* **journey-maps:** prohibit simultaneous selection of sbb marker and poi ([#1959](https://github.com/sbb-design-systems/sbb-angular/issues/1959)) ([f966427](https://github.com/sbb-design-systems/sbb-angular/commit/f9664270e876dc3ffbaad740613194ea6968c096))
* **journey-maps:** provide mock data with indoor transfer ([#1951](https://github.com/sbb-design-systems/sbb-angular/issues/1951)) ([da5ef6c](https://github.com/sbb-design-systems/sbb-angular/commit/da5ef6c9e570b9a798e7c00f07a686aacaac3d84))
* **journey-maps:** removed indoor pois in examples ([#1960](https://github.com/sbb-design-systems/sbb-angular/issues/1960)) ([fd8f0ad](https://github.com/sbb-design-systems/sbb-angular/commit/fd8f0adfcf14d9d0e9dab041116cb5c380961c20))


### Bug Fixes

* **angular/accordion:** content visible when placed inside a hidden parent ([#1949](https://github.com/sbb-design-systems/sbb-angular/issues/1949)) ([8449cd4](https://github.com/sbb-design-systems/sbb-angular/commit/8449cd405ba173635e35c754b80a517366facc91))
* **angular/autocomplete:** blocking events to other overlays when there are no results ([#1947](https://github.com/sbb-design-systems/sbb-angular/issues/1947)) ([f5a16f4](https://github.com/sbb-design-systems/sbb-angular/commit/f5a16f4a0d681ddb5542acf329318c067ea802c1))
* **angular/autocomplete:** clear selected option if input is cleared ([#1946](https://github.com/sbb-design-systems/sbb-angular/issues/1946)) ([c5fe856](https://github.com/sbb-design-systems/sbb-angular/commit/c5fe8569e07e2f33abcfef4690b0515fbb01555b))
* **angular/radio:** clear selected radio button from group ([#1950](https://github.com/sbb-design-systems/sbb-angular/issues/1950)) ([8f707be](https://github.com/sbb-design-systems/sbb-angular/commit/8f707be86515d7df3e4bc3a2cce9d00cdee9df21))
* **deps:** update dependency tslib to v2.6.1 ([a8a2b04](https://github.com/sbb-design-systems/sbb-angular/commit/a8a2b04bec8af0882f7398bfd14bb707f547bb23))
* **journey-maps:** allow deselecting pois even without popups ([5986080](https://github.com/sbb-design-systems/sbb-angular/commit/5986080475b3a527ee78c942d6fa2a8abcae5555))
* **journey-maps:** prevent error when unselecting POIs without previously selecting any ([#1963](https://github.com/sbb-design-systems/sbb-angular/issues/1963)) ([a22ed03](https://github.com/sbb-design-systems/sbb-angular/commit/a22ed03122dd4952abc047d73ec835e99f4153cc))

## [16.4.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.3.0...16.4.0) (2023-07-24)


### Features

* **journey-maps:** add on_demand pois ([#1945](https://github.com/sbb-design-systems/sbb-angular/issues/1945)) ([036aa90](https://github.com/sbb-design-systems/sbb-angular/commit/036aa905802884b9a6409b2ef30041839acdefb4))
* **journey-maps:** allow programmatically selecting and deselecting a POI ([#1943](https://github.com/sbb-design-systems/sbb-angular/issues/1943)) ([154c07b](https://github.com/sbb-design-systems/sbb-angular/commit/154c07bd3c3dd378bf9c6b19ddb91702dd0d57e5))
* **journey-maps:** show stack-blitz example link ([#1927](https://github.com/sbb-design-systems/sbb-angular/issues/1927)) ([4dbb6d8](https://github.com/sbb-design-systems/sbb-angular/commit/4dbb6d88b8d2e4d8eb596bb9535e7392561d4485))
* **journey-maps:** added on-demand pois to interface ([#1938](https://github.com/sbb-design-systems/sbb-angular/issues/1938)) ([db5cd49](https://github.com/sbb-design-systems/sbb-angular/commit/db5cd4970a374c8f5ab256ec599f4f6b2dccaff3))


### Bug Fixes

* **deps:** update angular to v16.1.4 ([e089754](https://github.com/sbb-design-systems/sbb-angular/commit/e0897542b5657cd3659203871ed378994c5e36cf))
* **deps:** update angular to v16.1.5 ([309e747](https://github.com/sbb-design-systems/sbb-angular/commit/309e7474f7aeba73be7b8376b51df797d636f682))
* **deps:** update angular to v16.1.6 ([19970c6](https://github.com/sbb-design-systems/sbb-angular/commit/19970c61a6dbc6a292a7998c7d6aa72fb77559e8))
* **deps:** update dependency @angular/cdk to v16.1.5 ([6065b00](https://github.com/sbb-design-systems/sbb-angular/commit/6065b00c8b32cb48f6679b06000b71bdd0f448ef))


### Documentation

* **angular/tabs:** add note when using together with `routerLink` ([#1942](https://github.com/sbb-design-systems/sbb-angular/issues/1942)) ([4f6cabc](https://github.com/sbb-design-systems/sbb-angular/commit/4f6cabc538e23042db424417430182afeddb3fac)), closes [#1941](https://github.com/sbb-design-systems/sbb-angular/issues/1941)

## [16.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.2.0...16.3.0) (2023-06-29)


### Features

* **journeyMaps:** bind method for web component ([#1928](https://github.com/sbb-design-systems/sbb-angular/issues/1928)) ([23e810b](https://github.com/sbb-design-systems/sbb-angular/commit/23e810ba06eb0ec0626ee573774fadb545632033))


### Bug Fixes

* **deps:** update angular to v16.1.2 ([00fc588](https://github.com/sbb-design-systems/sbb-angular/commit/00fc588efe8c61693a406d944edf0b432adfbb90))
* **deps:** update dependency @angular/cdk to v16.1.2 ([f3f5891](https://github.com/sbb-design-systems/sbb-angular/commit/f3f5891f915a25df8bf7cbd36f183be114d7e754))
* **deps:** update dependency tslib to v2.6.0 ([bd98598](https://github.com/sbb-design-systems/sbb-angular/commit/bd98598c903418af38662fa40a47a3b65659d690))

## [16.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.1.0...16.2.0) (2023-06-20)


### Features

* **journey-maps:** extend poi-url-generation with preview flag ([#1899](https://github.com/sbb-design-systems/sbb-angular/issues/1899)) ([19c8a51](https://github.com/sbb-design-systems/sbb-angular/commit/19c8a519573ec08748797678849be9cc7ce18507))


### Bug Fixes

* **deps:** update angular ([0a72fd2](https://github.com/sbb-design-systems/sbb-angular/commit/0a72fd243fc0f019edde8d4bdfd43e63aa256c9a))
* **deps:** update dependency @angular/cdk to v16.1.1 ([#1921](https://github.com/sbb-design-systems/sbb-angular/issues/1921)) ([1da03c9](https://github.com/sbb-design-systems/sbb-angular/commit/1da03c9b8ca686ee339574ce6474f85ac8483692))
* **stackblitz:** fix dependencies and registry ([#1916](https://github.com/sbb-design-systems/sbb-angular/issues/1916)) ([bf9ba4e](https://github.com/sbb-design-systems/sbb-angular/commit/bf9ba4e0c0b3c460eabba11de3c9af87a8536025))


### Documentation

* convert examples to standalone ([#1919](https://github.com/sbb-design-systems/sbb-angular/issues/1919)) ([592be21](https://github.com/sbb-design-systems/sbb-angular/commit/592be21c0f83c09b385d5162e1a119991a1cf047))
* **journey-maps:** add more information for the web-component ([#1913](https://github.com/sbb-design-systems/sbb-angular/issues/1913)) ([2fa7fc8](https://github.com/sbb-design-systems/sbb-angular/commit/2fa7fc82aae8e5374b71bbbf357a29c2a3723e8f))

## [16.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.0.0...16.1.0) (2023-06-07)


### Features

* **journey-maps:** deselect pois ([#1910](https://github.com/sbb-design-systems/sbb-angular/issues/1910)) ([1a68b63](https://github.com/sbb-design-systems/sbb-angular/commit/1a68b63f89b7e99af1ca0f0d48e11cf43ace3ffc))
* **multiple:** update components to use new icons ([#1905](https://github.com/sbb-design-systems/sbb-angular/issues/1905)) ([54b938b](https://github.com/sbb-design-systems/sbb-angular/commit/54b938b3aefaf7fe8fe3e61467a461aae9454395))


### Bug Fixes

* **deps:** update angular to v16.0.3 ([de13f32](https://github.com/sbb-design-systems/sbb-angular/commit/de13f32ed3712b77accf7e9b223ed2389cebf7d9))
* **deps:** update dependency @angular/cdk to v16.0.1 ([#1902](https://github.com/sbb-design-systems/sbb-angular/issues/1902)) ([b685a16](https://github.com/sbb-design-systems/sbb-angular/commit/b685a1630831f1e7beb60e2c573594634d88c86e))
* **deps:** update dependency tslib to v2.5.1 ([b734a48](https://github.com/sbb-design-systems/sbb-angular/commit/b734a48e02e38da85b9516276751d7ab4eaf9f2a))
* **deps:** update dependency tslib to v2.5.2 ([b14944a](https://github.com/sbb-design-systems/sbb-angular/commit/b14944a1f1a792cce9720171bdd8289347d8797c))
* **deps:** update dependency tslib to v2.5.3 ([c1f7f1b](https://github.com/sbb-design-systems/sbb-angular/commit/c1f7f1b9a1ab90925bb12eefb00ea4bbe256e0f4))


### Documentation

* **journey-maps:** help the user find the example source code ([#1911](https://github.com/sbb-design-systems/sbb-angular/issues/1911)) ([c4cdedd](https://github.com/sbb-design-systems/sbb-angular/commit/c4cdedd37757d6156968e458938b2d589ac37e8d))

## [16.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/16.0.0-rc.2...16.0.0) (2023-05-11)


### ⚠ BREAKING CHANGES

* Angular 16 is now used.
* The deprecated package `angular-maps` is removed.

### Features

* **angular/icon:** update to new icons and pictograms ([#1889](https://github.com/sbb-design-systems/sbb-angular/issues/1889)) ([0130dd0](https://github.com/sbb-design-systems/sbb-angular/commit/0130dd03b287e4e809a765f61ef5991027957c9c)), closes [#1871](https://github.com/sbb-design-systems/sbb-angular/issues/1871)
* remove deprecated `angular-maps` ([#1897](https://github.com/sbb-design-systems/sbb-angular/issues/1897)) ([a15886d](https://github.com/sbb-design-systems/sbb-angular/commit/a15886dc28f8908d26acc85835d6e72a7d51a614))
* add `sbb-off-brand-colors` style ([#1863](https://github.com/sbb-design-systems/sbb-angular/issues/1863)) ([5e0be1e](https://github.com/sbb-design-systems/sbb-angular/commit/5e0be1e8ce4e7f71b29d32f7198f16a9e5a9ea36))
* **angular/datepicker:** add option to prevent entering overflowing dates ([#1787](https://github.com/sbb-design-systems/sbb-angular/issues/1787)) ([ceb69ce](https://github.com/sbb-design-systems/sbb-angular/commit/ceb69cee524c122265319030b55566336ca2262b)), closes [#1761](https://github.com/sbb-design-systems/sbb-angular/issues/1761)
* **angular/datepicker:** expose calendar and make configurable ([#1762](https://github.com/sbb-design-systems/sbb-angular/issues/1762)) ([5494134](https://github.com/sbb-design-systems/sbb-angular/commit/5494134f39349a00cb08ef6aa3131a7388060541)), closes [#1671](https://github.com/sbb-design-systems/sbb-angular/issues/1671)
* **journey-maps:** add dropdown for POI category selection ([#1835](https://github.com/sbb-design-systems/sbb-angular/issues/1835)) ([9b2ec99](https://github.com/sbb-design-systems/sbb-angular/commit/9b2ec99b1e4323c21c0519b90ee20092c9e04e89))
* **journey-maps:** add new POIs subcategories ([#1765](https://github.com/sbb-design-systems/sbb-angular/issues/1765)) ([7bb0594](https://github.com/sbb-design-systems/sbb-angular/commit/7bb05948eeaa7fbf83b5365e5b899a63f43f92d1))
* **journey-maps:** add new POIs subcategories for angular showcase as well ([#1766](https://github.com/sbb-design-systems/sbb-angular/issues/1766)) ([4bf6383](https://github.com/sbb-design-systems/sbb-angular/commit/4bf6383a4ad40b226dfbd6a129b3e9a699e59d80))
* **journey-maps:** add SbbRailNetworkOptions ([#1837](https://github.com/sbb-design-systems/sbb-angular/issues/1837)) ([5cfa7fe](https://github.com/sbb-design-systems/sbb-angular/commit/5cfa7fe8c7568c832c81b2268d4fe3ae97923714))
* **journey-maps:** custom map attribution component ([#1845](https://github.com/sbb-design-systems/sbb-angular/issues/1845)) ([fc666f5](https://github.com/sbb-design-systems/sbb-angular/commit/fc666f520ff60b507d6a994a10f2073d934e2613))
* **journey-maps:** display bounding box info ([#1813](https://github.com/sbb-design-systems/sbb-angular/issues/1813)) ([f89ff21](https://github.com/sbb-design-systems/sbb-angular/commit/f89ff21fc321794cc05689663b7ec734bed7cb01))
* **journey-maps:** improved route hover ([#1828](https://github.com/sbb-design-systems/sbb-angular/issues/1828)) ([08e77ea](https://github.com/sbb-design-systems/sbb-angular/commit/08e77eaa500fff26101c3444e2f0d0429ac28a23))
* **journey-maps:** journey start- and end-station clickable ([#1865](https://github.com/sbb-design-systems/sbb-angular/issues/1865)) ([69f307d](https://github.com/sbb-design-systems/sbb-angular/commit/69f307d0199aae7a800c7da638d358e003b1dc11))
* **journey-maps:** switch between 2D and 3D layers ([#1814](https://github.com/sbb-design-systems/sbb-angular/issues/1814)) ([b5c215b](https://github.com/sbb-design-systems/sbb-angular/commit/b5c215b7083c085fd3390dd3c16da2f6d78e3265))
* **journey-maps:** switch to map style 'ki_v2' ([#1769](https://github.com/sbb-design-systems/sbb-angular/issues/1769)) ([0360a1c](https://github.com/sbb-design-systems/sbb-angular/commit/0360a1c37afb4106095c4eaa862a870cc7653d65))
* **journey-maps:** use the new aerial style 'aerial_sbb_ki_v2' ([#1811](https://github.com/sbb-design-systems/sbb-angular/issues/1811)) ([0cbc546](https://github.com/sbb-design-systems/sbb-angular/commit/0cbc5461746ef7d31cd0f10b506910d7f06d2dae))
* **journey-maps:** v1 route hover ([#1829](https://github.com/sbb-design-systems/sbb-angular/issues/1829)) ([001f4ed](https://github.com/sbb-design-systems/sbb-angular/commit/001f4edbfb95db8e3790c8edc33fa5f999a18066))
* **journeyMaps:** implement bbox event emitter ([#1807](https://github.com/sbb-design-systems/sbb-angular/issues/1807)) ([00ae372](https://github.com/sbb-design-systems/sbb-angular/commit/00ae3722d592e2e5619d9b34296b0e9b5c15121c))


### Bug Fixes

* **angular/checkbox:** fix ARIA semantics and use native DOM properties ([#1850](https://github.com/sbb-design-systems/sbb-angular/issues/1850)) ([ac29d15](https://github.com/sbb-design-systems/sbb-angular/commit/ac29d15aa1a66ca058bc7b5f9da4a6e748827be2))
* **angular/core:** sbb-option sets aria-selected="false" ([#1847](https://github.com/sbb-design-systems/sbb-angular/issues/1847)) ([170db04](https://github.com/sbb-design-systems/sbb-angular/commit/170db04a7405a15ef0cced0ce8d790545d0fcb2d))
* **angular/datepicker:** avoid calendar being cut off on small screens ([#1869](https://github.com/sbb-design-systems/sbb-angular/issues/1869)) ([0414d11](https://github.com/sbb-design-systems/sbb-angular/commit/0414d112d210eb2e75741c19a317ae9a0d848a4b)), closes [#1819](https://github.com/sbb-design-systems/sbb-angular/issues/1819)
* **angular/datepicker:** remove div as a child of button ([#1866](https://github.com/sbb-design-systems/sbb-angular/issues/1866)) ([559a544](https://github.com/sbb-design-systems/sbb-angular/commit/559a544ac236db019d9af9b83a17e1ea2c06dcb5))
* **angular/datepicker:** update arrow keys of connected datepicker  ([#1858](https://github.com/sbb-design-systems/sbb-angular/issues/1858)) ([1336584](https://github.com/sbb-design-systems/sbb-angular/commit/1336584df894f44fdf565407ab7db424d79a9887)), closes [#1852](https://github.com/sbb-design-systems/sbb-angular/issues/1852)
* **angular/dialog:** scrollable content if no dialog height is defined ([#1804](https://github.com/sbb-design-systems/sbb-angular/issues/1804)) ([f4b16b1](https://github.com/sbb-design-systems/sbb-angular/commit/f4b16b1afd01aa1cfc3826bd90ab31e40bd85734)), closes [#1803](https://github.com/sbb-design-systems/sbb-angular/issues/1803)
* **angular/menu:** explicitly set aria-expanded to true/false ([#1752](https://github.com/sbb-design-systems/sbb-angular/issues/1752)) ([e8a400a](https://github.com/sbb-design-systems/sbb-angular/commit/e8a400a437c6e691f992e155c43223b529b17622))
* **angular/select:** changed after checked error if option label changes ([#1753](https://github.com/sbb-design-systems/sbb-angular/issues/1753)) ([1b53276](https://github.com/sbb-design-systems/sbb-angular/commit/1b5327606d6c3759ca47765f9dd5419244d5e1a9))
* **deps:** update angular ([07710a8](https://github.com/sbb-design-systems/sbb-angular/commit/07710a8bb248679e991cb23490fff2835186ef3a))
* **deps:** update angular to v15.0.1 ([b4235c9](https://github.com/sbb-design-systems/sbb-angular/commit/b4235c916cc947f731401478b6608e69b13cbf42))
* **deps:** update angular to v15.2.4 ([cec6d64](https://github.com/sbb-design-systems/sbb-angular/commit/cec6d64f2ffc68a54b5d3f4fccf2637794cf658b))
* **deps:** update angular to v15.2.5 ([6165bc3](https://github.com/sbb-design-systems/sbb-angular/commit/6165bc327418f7049a62c2b1842e22ca1d7e2900))
* **deps:** update angular to v16.0.0-rc.2 ([#1864](https://github.com/sbb-design-systems/sbb-angular/issues/1864)) ([d2873cd](https://github.com/sbb-design-systems/sbb-angular/commit/d2873cda78b2994464e276336f20793a1a1f5f9c))
* **deps:** update dependency @angular/cdk to v15.1.5 ([c270d29](https://github.com/sbb-design-systems/sbb-angular/commit/c270d295d5073706654d3a47f32065d9dc62ec50))
* **deps:** update dependency @angular/cdk to v15.2.4 ([e3e27e8](https://github.com/sbb-design-systems/sbb-angular/commit/e3e27e80a848fde0d7220c82b8c6017669718b31))
* **deps:** update dependency @stackblitz/sdk to v1.8.2 ([8720f0a](https://github.com/sbb-design-systems/sbb-angular/commit/8720f0a2b2d213a58f912d6fcfa55453dad61ecd))
* **deps:** update dependency @stackblitz/sdk to v1.9.0 ([9c2096e](https://github.com/sbb-design-systems/sbb-angular/commit/9c2096e224cb20255e8f62d85cd2315a9b17fc3f))
* **deps:** update dependency rxjs to v7.6.0 ([6d8e798](https://github.com/sbb-design-systems/sbb-angular/commit/6d8e798ce995e0cf2f26c2536d39b507ff329b12))
* **deps:** update dependency rxjs to v7.8.0 ([6751d57](https://github.com/sbb-design-systems/sbb-angular/commit/6751d570b8055b51de6963038594d0fc50c3374c))
* **deps:** update dependency rxjs to v7.8.1 ([829107f](https://github.com/sbb-design-systems/sbb-angular/commit/829107fdcd7356ae66b66e3164ab911a55389f64))
* **deps:** update dependency tslib to v2.5.0 ([a80e353](https://github.com/sbb-design-systems/sbb-angular/commit/a80e353eb8481dc22d080aae0ceb7df305948300))
* **deps:** update typescript to 5.0.2 ([#1856](https://github.com/sbb-design-systems/sbb-angular/issues/1856)) ([118ea18](https://github.com/sbb-design-systems/sbb-angular/commit/118ea18245995b66cc0c87f1dd62edb7d650183b))
* ensure correct bundling of showcase ([#1823](https://github.com/sbb-design-systems/sbb-angular/issues/1823)) ([9fee0b7](https://github.com/sbb-design-systems/sbb-angular/commit/9fee0b7bb37bf3b0759ac671b798a2ca283a6197))
* **journey-maps:** display focused controls ([#1839](https://github.com/sbb-design-systems/sbb-angular/issues/1839)) ([9ec4e6f](https://github.com/sbb-design-systems/sbb-angular/commit/9ec4e6f5cd4330446610b4771f3256e64eff47a2))
* **journey-maps:** export web component CSS in package.json ([#1767](https://github.com/sbb-design-systems/sbb-angular/issues/1767)) ([e2696ec](https://github.com/sbb-design-systems/sbb-angular/commit/e2696ec5156e350d495175eaed9d0281c5d2b7ea))
* **journey-maps:** fix multiline attribution style ([#1873](https://github.com/sbb-design-systems/sbb-angular/issues/1873)) ([977be10](https://github.com/sbb-design-systems/sbb-angular/commit/977be10346c2797b8af7d47d80c14cff1470c523))
* **journey-maps:** keep button icon visible against black background ([#1840](https://github.com/sbb-design-systems/sbb-angular/issues/1840)) ([0556f05](https://github.com/sbb-design-systems/sbb-angular/commit/0556f055ae6296c5ccc5df2097e1657eee3be5e5))
* make rxjs imports forward compatible ([#1874](https://github.com/sbb-design-systems/sbb-angular/issues/1874)) ([e75c172](https://github.com/sbb-design-systems/sbb-angular/commit/e75c172ad56a5352543d05cbbbd4a515cd63a697)), closes [#1872](https://github.com/sbb-design-systems/sbb-angular/issues/1872)
* **oauth:** parse token correctly to be able to parse unicode characters ([#1848](https://github.com/sbb-design-systems/sbb-angular/issues/1848)) ([7966ac6](https://github.com/sbb-design-systems/sbb-angular/commit/7966ac6753cf9f8ff5096ea1b1d8e87afbbd026a))
* remove engine entries in package.json ([#1795](https://github.com/sbb-design-systems/sbb-angular/issues/1795)) ([784b4d3](https://github.com/sbb-design-systems/sbb-angular/commit/784b4d34831240b2ebb902f4311d3b38a2d2d038))
* **stackblitz:** update stackblitz assets to v15 ([#1751](https://github.com/sbb-design-systems/sbb-angular/issues/1751)) ([8cf9a81](https://github.com/sbb-design-systems/sbb-angular/commit/8cf9a810dc0f49ecdc643ecfc9b52fd739ba3a4b))


### Documentation

* **journey-maps:** document how to configure listenerOptions ([#1883](https://github.com/sbb-design-systems/sbb-angular/issues/1883)) ([d77af32](https://github.com/sbb-design-systems/sbb-angular/commit/d77af32a33f17cc652ccafa7e1b8f840b1febfae))
* add deprecation note to `angular-maps` ([#1824](https://github.com/sbb-design-systems/sbb-angular/issues/1824)) ([ada24c1](https://github.com/sbb-design-systems/sbb-angular/commit/ada24c133abcdcd6d92641d21ea21090647efadd))
* added new GitHub issue templates ([#1833](https://github.com/sbb-design-systems/sbb-angular/issues/1833)) ([2bcb69a](https://github.com/sbb-design-systems/sbb-angular/commit/2bcb69ad8c33f53fbb46459914c3d59c7d5c9c3f))
* **angular/tabs:** explain where to set 'selectedIndex' ([#1846](https://github.com/sbb-design-systems/sbb-angular/issues/1846)) ([eec721c](https://github.com/sbb-design-systems/sbb-angular/commit/eec721c1c03e7eebe81076e9555654b9f9d822c4))
* explain how to start the app with the api key for journey-maps ([#1853](https://github.com/sbb-design-systems/sbb-angular/issues/1853)) ([5e5af7a](https://github.com/sbb-design-systems/sbb-angular/commit/5e5af7a4ff565120bb7ea72a554292dbbf6c9eee))
* **journey-maps:** updated `journey-maps` maplibre css version to 2.4.0 ([#1836](https://github.com/sbb-design-systems/sbb-angular/issues/1836)) ([3a287e5](https://github.com/sbb-design-systems/sbb-angular/commit/3a287e5c9e1f09b856bdd84e1e971b5421af699e))
* **loading-indicator:** add note about fullbox mode ([#1792](https://github.com/sbb-design-systems/sbb-angular/issues/1792)) ([d065ded](https://github.com/sbb-design-systems/sbb-angular/commit/d065ded4a477d3440cbeb19dda35ea6225f411ae)), closes [#1791](https://github.com/sbb-design-systems/sbb-angular/issues/1791)
* make environment banner text configurable ([#1825](https://github.com/sbb-design-systems/sbb-angular/issues/1825)) ([08911c6](https://github.com/sbb-design-systems/sbb-angular/commit/08911c6ac3c9eb590d396a7904046533f35cbefc))
* update changelog ([20632c5](https://github.com/sbb-design-systems/sbb-angular/commit/20632c506724f1d57ebdd872b0798dc91551ba10))
* update changelog ([#1800](https://github.com/sbb-design-systems/sbb-angular/issues/1800)) ([b110b11](https://github.com/sbb-design-systems/sbb-angular/commit/b110b1120de913fa63384ce0e7024610c2dff6c2))
* update CODEOWNERS for journey-maps ([fb01fd0](https://github.com/sbb-design-systems/sbb-angular/commit/fb01fd03d67a2f95b57e121370f5e793bae38a25))


## [16.0.0-rc.2](https://github.com/sbb-design-systems/sbb-angular/compare/16.0.0-rc.1...16.0.0-rc.2) (2023-05-11)


### ⚠ BREAKING CHANGES

* This removes the `angular-maps` package.

### Features

* **angular/icon:** update to new icons and pictograms ([#1889](https://github.com/sbb-design-systems/sbb-angular/issues/1889)) ([0130dd0](https://github.com/sbb-design-systems/sbb-angular/commit/0130dd03b287e4e809a765f61ef5991027957c9c)), closes [#1871](https://github.com/sbb-design-systems/sbb-angular/issues/1871)


* remove deprecated `angular-maps` ([#1897](https://github.com/sbb-design-systems/sbb-angular/issues/1897)) ([a15886d](https://github.com/sbb-design-systems/sbb-angular/commit/a15886dc28f8908d26acc85835d6e72a7d51a614))


### Documentation

* **journey-maps:** document how to configure listenerOptions ([#1883](https://github.com/sbb-design-systems/sbb-angular/issues/1883)) ([d77af32](https://github.com/sbb-design-systems/sbb-angular/commit/d77af32a33f17cc652ccafa7e1b8f840b1febfae))

## [16.0.0-rc.1](https://github.com/sbb-design-systems/sbb-angular/compare/16.0.0-rc.0...16.0.0-rc.1) (2023-05-08)

This is the second pre-release of version 16 from our library.

## [16.0.0-rc.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.0.0...16.0.0-rc.0) (2023-05-08)

This is the first pre-release of version 16 from our library.

### ⚠ BREAKING CHANGES

* This updates the repo to typescript 5 and prepares the 16 release. Codelyzer is removed because it uses deprecated APIs. The `lifecycle-hook-interface` is taken from `angular/components` and some other less useful rules were removed.

### Features

* add `sbb-off-brand-colors` style ([#1863](https://github.com/sbb-design-systems/sbb-angular/issues/1863)) ([5e0be1e](https://github.com/sbb-design-systems/sbb-angular/commit/5e0be1e8ce4e7f71b29d32f7198f16a9e5a9ea36))
* **angular/datepicker:** add option to prevent entering overflowing dates ([#1787](https://github.com/sbb-design-systems/sbb-angular/issues/1787)) ([ceb69ce](https://github.com/sbb-design-systems/sbb-angular/commit/ceb69cee524c122265319030b55566336ca2262b)), closes [#1761](https://github.com/sbb-design-systems/sbb-angular/issues/1761)
* **angular/datepicker:** expose calendar and make configurable ([#1762](https://github.com/sbb-design-systems/sbb-angular/issues/1762)) ([5494134](https://github.com/sbb-design-systems/sbb-angular/commit/5494134f39349a00cb08ef6aa3131a7388060541)), closes [#1671](https://github.com/sbb-design-systems/sbb-angular/issues/1671)
* **journey-maps:** add dropdown for POI category selection ([#1835](https://github.com/sbb-design-systems/sbb-angular/issues/1835)) ([9b2ec99](https://github.com/sbb-design-systems/sbb-angular/commit/9b2ec99b1e4323c21c0519b90ee20092c9e04e89))
* **journey-maps:** add new POIs subcategories ([#1765](https://github.com/sbb-design-systems/sbb-angular/issues/1765)) ([7bb0594](https://github.com/sbb-design-systems/sbb-angular/commit/7bb05948eeaa7fbf83b5365e5b899a63f43f92d1))
* **journey-maps:** add new POIs subcategories for angular showcase as well ([#1766](https://github.com/sbb-design-systems/sbb-angular/issues/1766)) ([4bf6383](https://github.com/sbb-design-systems/sbb-angular/commit/4bf6383a4ad40b226dfbd6a129b3e9a699e59d80))
* **journey-maps:** add SbbRailNetworkOptions ([#1837](https://github.com/sbb-design-systems/sbb-angular/issues/1837)) ([5cfa7fe](https://github.com/sbb-design-systems/sbb-angular/commit/5cfa7fe8c7568c832c81b2268d4fe3ae97923714))
* **journey-maps:** custom map attribution component ([#1845](https://github.com/sbb-design-systems/sbb-angular/issues/1845)) ([fc666f5](https://github.com/sbb-design-systems/sbb-angular/commit/fc666f520ff60b507d6a994a10f2073d934e2613))
* **journey-maps:** display bounding box info ([#1813](https://github.com/sbb-design-systems/sbb-angular/issues/1813)) ([f89ff21](https://github.com/sbb-design-systems/sbb-angular/commit/f89ff21fc321794cc05689663b7ec734bed7cb01))
* **journey-maps:** improved route hover ([#1828](https://github.com/sbb-design-systems/sbb-angular/issues/1828)) ([08e77ea](https://github.com/sbb-design-systems/sbb-angular/commit/08e77eaa500fff26101c3444e2f0d0429ac28a23))
* **journey-maps:** journey start- and end-station clickable ([#1865](https://github.com/sbb-design-systems/sbb-angular/issues/1865)) ([69f307d](https://github.com/sbb-design-systems/sbb-angular/commit/69f307d0199aae7a800c7da638d358e003b1dc11))
* **journey-maps:** switch between 2D and 3D layers ([#1814](https://github.com/sbb-design-systems/sbb-angular/issues/1814)) ([b5c215b](https://github.com/sbb-design-systems/sbb-angular/commit/b5c215b7083c085fd3390dd3c16da2f6d78e3265))
* **journey-maps:** switch to map style 'ki_v2' ([#1769](https://github.com/sbb-design-systems/sbb-angular/issues/1769)) ([0360a1c](https://github.com/sbb-design-systems/sbb-angular/commit/0360a1c37afb4106095c4eaa862a870cc7653d65))
* **journey-maps:** use the new aerial style 'aerial_sbb_ki_v2' ([#1811](https://github.com/sbb-design-systems/sbb-angular/issues/1811)) ([0cbc546](https://github.com/sbb-design-systems/sbb-angular/commit/0cbc5461746ef7d31cd0f10b506910d7f06d2dae))
* **journey-maps:** v1 route hover ([#1829](https://github.com/sbb-design-systems/sbb-angular/issues/1829)) ([001f4ed](https://github.com/sbb-design-systems/sbb-angular/commit/001f4edbfb95db8e3790c8edc33fa5f999a18066))
* **journeyMaps:** implement bbox event emitter ([#1807](https://github.com/sbb-design-systems/sbb-angular/issues/1807)) ([00ae372](https://github.com/sbb-design-systems/sbb-angular/commit/00ae3722d592e2e5619d9b34296b0e9b5c15121c))


### Bug Fixes

* **angular/checkbox:** fix ARIA semantics and use native DOM properties ([#1850](https://github.com/sbb-design-systems/sbb-angular/issues/1850)) ([ac29d15](https://github.com/sbb-design-systems/sbb-angular/commit/ac29d15aa1a66ca058bc7b5f9da4a6e748827be2))
* **angular/core:** sbb-option sets aria-selected="false" ([#1847](https://github.com/sbb-design-systems/sbb-angular/issues/1847)) ([170db04](https://github.com/sbb-design-systems/sbb-angular/commit/170db04a7405a15ef0cced0ce8d790545d0fcb2d))
* **angular/datepicker:** avoid calendar being cut off on small screens ([#1869](https://github.com/sbb-design-systems/sbb-angular/issues/1869)) ([0414d11](https://github.com/sbb-design-systems/sbb-angular/commit/0414d112d210eb2e75741c19a317ae9a0d848a4b)), closes [#1819](https://github.com/sbb-design-systems/sbb-angular/issues/1819)
* **angular/datepicker:** remove div as a child of button ([#1866](https://github.com/sbb-design-systems/sbb-angular/issues/1866)) ([559a544](https://github.com/sbb-design-systems/sbb-angular/commit/559a544ac236db019d9af9b83a17e1ea2c06dcb5))
* **angular/datepicker:** update arrow keys of connected datepicker  ([#1858](https://github.com/sbb-design-systems/sbb-angular/issues/1858)) ([1336584](https://github.com/sbb-design-systems/sbb-angular/commit/1336584df894f44fdf565407ab7db424d79a9887)), closes [#1852](https://github.com/sbb-design-systems/sbb-angular/issues/1852)
* **angular/dialog:** scrollable content if no dialog height is defined ([#1804](https://github.com/sbb-design-systems/sbb-angular/issues/1804)) ([f4b16b1](https://github.com/sbb-design-systems/sbb-angular/commit/f4b16b1afd01aa1cfc3826bd90ab31e40bd85734)), closes [#1803](https://github.com/sbb-design-systems/sbb-angular/issues/1803)
* **angular/menu:** explicitly set aria-expanded to true/false ([#1752](https://github.com/sbb-design-systems/sbb-angular/issues/1752)) ([e8a400a](https://github.com/sbb-design-systems/sbb-angular/commit/e8a400a437c6e691f992e155c43223b529b17622))
* **angular/select:** changed after checked error if option label changes ([#1753](https://github.com/sbb-design-systems/sbb-angular/issues/1753)) ([1b53276](https://github.com/sbb-design-systems/sbb-angular/commit/1b5327606d6c3759ca47765f9dd5419244d5e1a9))
* **deps:** update angular ([07710a8](https://github.com/sbb-design-systems/sbb-angular/commit/07710a8bb248679e991cb23490fff2835186ef3a))
* **deps:** update angular to v15.0.1 ([b4235c9](https://github.com/sbb-design-systems/sbb-angular/commit/b4235c916cc947f731401478b6608e69b13cbf42))
* **deps:** update angular to v15.2.4 ([cec6d64](https://github.com/sbb-design-systems/sbb-angular/commit/cec6d64f2ffc68a54b5d3f4fccf2637794cf658b))
* **deps:** update angular to v15.2.5 ([6165bc3](https://github.com/sbb-design-systems/sbb-angular/commit/6165bc327418f7049a62c2b1842e22ca1d7e2900))
* **deps:** update angular to v16.0.0-rc.2 ([#1864](https://github.com/sbb-design-systems/sbb-angular/issues/1864)) ([d2873cd](https://github.com/sbb-design-systems/sbb-angular/commit/d2873cda78b2994464e276336f20793a1a1f5f9c))
* **deps:** update dependency @angular/cdk to v15.1.5 ([c270d29](https://github.com/sbb-design-systems/sbb-angular/commit/c270d295d5073706654d3a47f32065d9dc62ec50))
* **deps:** update dependency @angular/cdk to v15.2.4 ([e3e27e8](https://github.com/sbb-design-systems/sbb-angular/commit/e3e27e80a848fde0d7220c82b8c6017669718b31))
* **deps:** update dependency @stackblitz/sdk to v1.8.2 ([8720f0a](https://github.com/sbb-design-systems/sbb-angular/commit/8720f0a2b2d213a58f912d6fcfa55453dad61ecd))
* **deps:** update dependency @stackblitz/sdk to v1.9.0 ([9c2096e](https://github.com/sbb-design-systems/sbb-angular/commit/9c2096e224cb20255e8f62d85cd2315a9b17fc3f))
* **deps:** update dependency rxjs to v7.6.0 ([6d8e798](https://github.com/sbb-design-systems/sbb-angular/commit/6d8e798ce995e0cf2f26c2536d39b507ff329b12))
* **deps:** update dependency rxjs to v7.8.0 ([6751d57](https://github.com/sbb-design-systems/sbb-angular/commit/6751d570b8055b51de6963038594d0fc50c3374c))
* **deps:** update dependency rxjs to v7.8.1 ([829107f](https://github.com/sbb-design-systems/sbb-angular/commit/829107fdcd7356ae66b66e3164ab911a55389f64))
* **deps:** update dependency tslib to v2.5.0 ([a80e353](https://github.com/sbb-design-systems/sbb-angular/commit/a80e353eb8481dc22d080aae0ceb7df305948300))
* ensure correct bundling of showcase ([#1823](https://github.com/sbb-design-systems/sbb-angular/issues/1823)) ([9fee0b7](https://github.com/sbb-design-systems/sbb-angular/commit/9fee0b7bb37bf3b0759ac671b798a2ca283a6197))
* **journey-maps:** display focused controls ([#1839](https://github.com/sbb-design-systems/sbb-angular/issues/1839)) ([9ec4e6f](https://github.com/sbb-design-systems/sbb-angular/commit/9ec4e6f5cd4330446610b4771f3256e64eff47a2))
* **journey-maps:** export web component CSS in package.json ([#1767](https://github.com/sbb-design-systems/sbb-angular/issues/1767)) ([e2696ec](https://github.com/sbb-design-systems/sbb-angular/commit/e2696ec5156e350d495175eaed9d0281c5d2b7ea))
* **journey-maps:** fix multiline attribution style ([#1873](https://github.com/sbb-design-systems/sbb-angular/issues/1873)) ([977be10](https://github.com/sbb-design-systems/sbb-angular/commit/977be10346c2797b8af7d47d80c14cff1470c523))
* **journey-maps:** keep button icon visible against black background ([#1840](https://github.com/sbb-design-systems/sbb-angular/issues/1840)) ([0556f05](https://github.com/sbb-design-systems/sbb-angular/commit/0556f055ae6296c5ccc5df2097e1657eee3be5e5))
* make rxjs imports forward compatible ([#1874](https://github.com/sbb-design-systems/sbb-angular/issues/1874)) ([e75c172](https://github.com/sbb-design-systems/sbb-angular/commit/e75c172ad56a5352543d05cbbbd4a515cd63a697)), closes [#1872](https://github.com/sbb-design-systems/sbb-angular/issues/1872)
* **oauth:** parse token correctly to be able to parse unicode characters ([#1848](https://github.com/sbb-design-systems/sbb-angular/issues/1848)) ([7966ac6](https://github.com/sbb-design-systems/sbb-angular/commit/7966ac6753cf9f8ff5096ea1b1d8e87afbbd026a))
* remove engine entries in package.json ([#1795](https://github.com/sbb-design-systems/sbb-angular/issues/1795)) ([784b4d3](https://github.com/sbb-design-systems/sbb-angular/commit/784b4d34831240b2ebb902f4311d3b38a2d2d038))
* **stackblitz:** update stackblitz assets to v15 ([#1751](https://github.com/sbb-design-systems/sbb-angular/issues/1751)) ([8cf9a81](https://github.com/sbb-design-systems/sbb-angular/commit/8cf9a810dc0f49ecdc643ecfc9b52fd739ba3a4b))


### Documentation

* add deprecation note to `angular-maps` ([#1824](https://github.com/sbb-design-systems/sbb-angular/issues/1824)) ([ada24c1](https://github.com/sbb-design-systems/sbb-angular/commit/ada24c133abcdcd6d92641d21ea21090647efadd))
* added new GitHub issue templates ([#1833](https://github.com/sbb-design-systems/sbb-angular/issues/1833)) ([2bcb69a](https://github.com/sbb-design-systems/sbb-angular/commit/2bcb69ad8c33f53fbb46459914c3d59c7d5c9c3f))
* **angular/tabs:** explain where to set 'selectedIndex' ([#1846](https://github.com/sbb-design-systems/sbb-angular/issues/1846)) ([eec721c](https://github.com/sbb-design-systems/sbb-angular/commit/eec721c1c03e7eebe81076e9555654b9f9d822c4))
* explain how to start the app with the api key for journey-maps ([#1853](https://github.com/sbb-design-systems/sbb-angular/issues/1853)) ([5e5af7a](https://github.com/sbb-design-systems/sbb-angular/commit/5e5af7a4ff565120bb7ea72a554292dbbf6c9eee))
* **journey-maps:** updated `journey-maps` maplibre css version to 2.4.0 ([#1836](https://github.com/sbb-design-systems/sbb-angular/issues/1836)) ([3a287e5](https://github.com/sbb-design-systems/sbb-angular/commit/3a287e5c9e1f09b856bdd84e1e971b5421af699e))
* **loading-indicator:** add note about fullbox mode ([#1792](https://github.com/sbb-design-systems/sbb-angular/issues/1792)) ([d065ded](https://github.com/sbb-design-systems/sbb-angular/commit/d065ded4a477d3440cbeb19dda35ea6225f411ae)), closes [#1791](https://github.com/sbb-design-systems/sbb-angular/issues/1791)
* make environment banner text configurable ([#1825](https://github.com/sbb-design-systems/sbb-angular/issues/1825)) ([08911c6](https://github.com/sbb-design-systems/sbb-angular/commit/08911c6ac3c9eb590d396a7904046533f35cbefc))
* update changelog ([20632c5](https://github.com/sbb-design-systems/sbb-angular/commit/20632c506724f1d57ebdd872b0798dc91551ba10))
* update changelog ([#1800](https://github.com/sbb-design-systems/sbb-angular/issues/1800)) ([b110b11](https://github.com/sbb-design-systems/sbb-angular/commit/b110b1120de913fa63384ce0e7024610c2dff6c2))
* update CODEOWNERS for journey-maps ([fb01fd0](https://github.com/sbb-design-systems/sbb-angular/commit/fb01fd03d67a2f95b57e121370f5e793bae38a25))


* update typescript to 5.0.2 ([#1856](https://github.com/sbb-design-systems/sbb-angular/issues/1856)) ([118ea18](https://github.com/sbb-design-systems/sbb-angular/commit/118ea18245995b66cc0c87f1dd62edb7d650183b))

## [15.10.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.9.0...15.10.0) (2023-04-17)


### Features

* add `sbb-off-brand-colors` style ([#1863](https://github.com/sbb-design-systems/sbb-angular/issues/1863)) ([044a6ae](https://github.com/sbb-design-systems/sbb-angular/commit/044a6ae3a78c47296d18ca94ce6d86e7cf23b95f))
* **journey-maps:** journey start- and end-station clickable ([#1865](https://github.com/sbb-design-systems/sbb-angular/issues/1865)) ([031c985](https://github.com/sbb-design-systems/sbb-angular/commit/031c9859ee1c7ad02c25579e9b6988823163cf5f))


### Bug Fixes

* **angular/datepicker:** avoid calendar being cut off on small screens ([#1869](https://github.com/sbb-design-systems/sbb-angular/issues/1869)) ([f4a972b](https://github.com/sbb-design-systems/sbb-angular/commit/f4a972bc259a8ab5a92401450c5278b7592141d2)), closes [#1819](https://github.com/sbb-design-systems/sbb-angular/issues/1819)
* **deps:** update angular to v15.2.6 ([67bdc91](https://github.com/sbb-design-systems/sbb-angular/commit/67bdc9114d12d5725f849729ee3ab5a6b3d9f27e))
* **deps:** update dependency @stackblitz/sdk to v1.9.0 ([a178716](https://github.com/sbb-design-systems/sbb-angular/commit/a1787164fe9cf5ec8cb1fa226d348e1a48498de3))
* make rxjs imports forward compatible ([#1874](https://github.com/sbb-design-systems/sbb-angular/issues/1874)) ([408aea6](https://github.com/sbb-design-systems/sbb-angular/commit/408aea65e8bf8655a459c9e37eb0da3990b2a3ee)), closes [#1872](https://github.com/sbb-design-systems/sbb-angular/issues/1872)

## [15.9.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.8.0...15.9.0) (2023-04-04)


### Features

* **angular/datepicker:** expose calendar and make configurable ([#1762](https://github.com/sbb-design-systems/sbb-angular/issues/1762)) ([1431a47](https://github.com/sbb-design-systems/sbb-angular/commit/1431a477cc3b4254972b1db48c8245a6d810ce06)), closes [#1671](https://github.com/sbb-design-systems/sbb-angular/issues/1671)
* **journey-maps:** custom map attribution component ([#1845](https://github.com/sbb-design-systems/sbb-angular/issues/1845)) ([7e643b1](https://github.com/sbb-design-systems/sbb-angular/commit/7e643b1d06dcac2424b107fe6e4f30e053647ed8))


### Bug Fixes

* **angular/datepicker:** update arrow keys of connected datepicker  ([#1858](https://github.com/sbb-design-systems/sbb-angular/issues/1858)) ([d30d3c8](https://github.com/sbb-design-systems/sbb-angular/commit/d30d3c8e0b9e15c863bc6e0bc2970792a9f8f1cd)), closes [#1852](https://github.com/sbb-design-systems/sbb-angular/issues/1852)
* **deps:** update angular to v15.2.5 ([0d1e333](https://github.com/sbb-design-systems/sbb-angular/commit/0d1e3331836bb071ec6282957bc880712d9d58ba))
* **journey-maps:** keep button icon visible against black background ([#1840](https://github.com/sbb-design-systems/sbb-angular/issues/1840)) ([29eca5c](https://github.com/sbb-design-systems/sbb-angular/commit/29eca5ca0a8d37e66690ff6dd5cca82808deb9ec))


### Documentation

* explain how to start the app with the api key for journey-maps ([#1853](https://github.com/sbb-design-systems/sbb-angular/issues/1853)) ([508ad91](https://github.com/sbb-design-systems/sbb-angular/commit/508ad91113c69c1c55a6706fe5a7056df2160e1c))

## [15.8.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.7.0...15.8.0) (2023-03-27)


### Features

* **journey-maps:** add SbbRailNetworkOptions ([#1837](https://github.com/sbb-design-systems/sbb-angular/issues/1837)) ([1bedf40](https://github.com/sbb-design-systems/sbb-angular/commit/1bedf40479e544309bf280906e5cea37d3a5e798))


### Bug Fixes

* **angular/checkbox:** fix ARIA semantics and use native DOM properties ([#1850](https://github.com/sbb-design-systems/sbb-angular/issues/1850)) ([5e27ebc](https://github.com/sbb-design-systems/sbb-angular/commit/5e27ebceb6031475941a04d72bfe38ca110637ac))
* **angular/core:** sbb-option sets aria-selected="false" ([#1847](https://github.com/sbb-design-systems/sbb-angular/issues/1847)) ([58538dc](https://github.com/sbb-design-systems/sbb-angular/commit/58538dc64a4aaaf7470eacb58009a5e7941842d2))
* **deps:** update angular to v15.2.4 ([f2a01fe](https://github.com/sbb-design-systems/sbb-angular/commit/f2a01fec8ed2dcb46e34b03b4a5f97c9fa2e7729))
* **deps:** update dependency @angular/cdk to v15.2.4 ([38dfd18](https://github.com/sbb-design-systems/sbb-angular/commit/38dfd18e407e73813c6f1285e1e5f0998cd385f4))
* **journey-maps:** display focused controls ([#1839](https://github.com/sbb-design-systems/sbb-angular/issues/1839)) ([8cfe4aa](https://github.com/sbb-design-systems/sbb-angular/commit/8cfe4aa19ef894d71b00d34d13cec78581eba526))


### Documentation

* **angular/tabs:** explain where to set 'selectedIndex' ([#1846](https://github.com/sbb-design-systems/sbb-angular/issues/1846)) ([79eba2d](https://github.com/sbb-design-systems/sbb-angular/commit/79eba2df90e19318a50a2c757223efa86719b725))

## [15.7.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.6.0...15.7.0) (2023-03-14)


### Features

* **journey-maps:** add dropdown for POI category selection ([#1835](https://github.com/sbb-design-systems/sbb-angular/issues/1835)) ([fcabe91](https://github.com/sbb-design-systems/sbb-angular/commit/fcabe913033bf38d037e27b4243297f9aa8b2f0a))
* **journey-maps:** display bounding box info ([#1813](https://github.com/sbb-design-systems/sbb-angular/issues/1813)) ([a917611](https://github.com/sbb-design-systems/sbb-angular/commit/a9176116b29910f34c3e5b968d084437fba6dbe3))
* **journey-maps:** v1 route hover ([#1829](https://github.com/sbb-design-systems/sbb-angular/issues/1829)) ([d664b24](https://github.com/sbb-design-systems/sbb-angular/commit/d664b2452d56811334610f6cb87384e694cd0983))


### Documentation

* added new GitHub issue templates ([#1833](https://github.com/sbb-design-systems/sbb-angular/issues/1833)) ([55c933c](https://github.com/sbb-design-systems/sbb-angular/commit/55c933cbb01d6c8d4a6103c24c48a16e6372aee6))
* **journey-maps:** updated `journey-maps` maplibre css version to 2.4.0 ([#1836](https://github.com/sbb-design-systems/sbb-angular/issues/1836)) ([f824c06](https://github.com/sbb-design-systems/sbb-angular/commit/f824c062f98b63cf673e85d0e33cabf0481e1dab))

## [15.6.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.5.0...15.6.0) (2023-03-06)


### Features

* **angular/datepicker:** add option to prevent entering overflowing dates ([#1787](https://github.com/sbb-design-systems/sbb-angular/issues/1787)) ([58f2fcf](https://github.com/sbb-design-systems/sbb-angular/commit/58f2fcf68a2ece029e9e3363b970125a9a675663)), closes [#1761](https://github.com/sbb-design-systems/sbb-angular/issues/1761)
* **journey-maps:** improved route hover ([#1828](https://github.com/sbb-design-systems/sbb-angular/issues/1828)) ([d8126ea](https://github.com/sbb-design-systems/sbb-angular/commit/d8126ea43dc570345d17c8f4996fc005558c643d))


### Documentation

* add deprecation note to `angular-maps` ([#1824](https://github.com/sbb-design-systems/sbb-angular/issues/1824)) ([dbafef0](https://github.com/sbb-design-systems/sbb-angular/commit/dbafef0e883ce8d1de2daa2ccb563266c9dfbad4))
* make environment banner text configurable ([#1825](https://github.com/sbb-design-systems/sbb-angular/issues/1825)) ([ed29820](https://github.com/sbb-design-systems/sbb-angular/commit/ed298204b6be8da677f6edab40630606f9e188b3))

## [15.5.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.4.1...15.5.0) (2023-02-20)


### Features

* **journey-maps:** switch between 2D and 3D layers ([#1814](https://github.com/sbb-design-systems/sbb-angular/issues/1814)) ([5c4c987](https://github.com/sbb-design-systems/sbb-angular/commit/5c4c9876148fb075594e66798f0c4a512526e1fe))
* **journey-maps:** use the new aerial style 'aerial_sbb_ki_v2' ([#1811](https://github.com/sbb-design-systems/sbb-angular/issues/1811)) ([5d842ce](https://github.com/sbb-design-systems/sbb-angular/commit/5d842ce780df9348bbbf51c823e3349bb250bcc6))


### Bug Fixes

* **deps:** update dependency @angular/cdk to v15.1.5 ([ae851c1](https://github.com/sbb-design-systems/sbb-angular/commit/ae851c1d159ae6039942d903cf61a5a97c77680a))

### [15.4.1](https://github.com/sbb-design-systems/sbb-angular/compare/15.4.0...15.4.1) (2023-02-07)

* **ci:** fix publishing of npm package


## [15.4.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.3.1...15.4.0) (2023-02-06)


### Features

* **journeyMaps:** implement bbox event emitter ([#1807](https://github.com/sbb-design-systems/sbb-angular/issues/1807)) ([9803d99](https://github.com/sbb-design-systems/sbb-angular/commit/9803d99f561b4028b1b0521194892b4004653110))


### Bug Fixes

* **angular/dialog:** scrollable content if no dialog height is defined ([#1804](https://github.com/sbb-design-systems/sbb-angular/issues/1804)) ([3d39249](https://github.com/sbb-design-systems/sbb-angular/commit/3d392491001771ad55431458e9164d3b4c1e6def)), closes [#1803](https://github.com/sbb-design-systems/sbb-angular/issues/1803)
* **deps:** update dependency @stackblitz/sdk to v1.8.2 ([5975546](https://github.com/sbb-design-systems/sbb-angular/commit/5975546467fcdaf01c213ceefe744f2cdc31fc03))


### Documentation

* update changelog ([#1800](https://github.com/sbb-design-systems/sbb-angular/issues/1800)) ([d4cd7a7](https://github.com/sbb-design-systems/sbb-angular/commit/d4cd7a758968172741ec1f3bd8f33aab45a80653))

### [14.4.3](https://github.com/sbb-design-systems/sbb-angular/compare/14.4.2...14.4.3) (2023-02-06)


### Bug Fixes

* **angular/dialog:** scrollable content if no dialog height is defined ([#1804](https://github.com/sbb-design-systems/sbb-angular/issues/1804)) ([d84660e](https://github.com/sbb-design-systems/sbb-angular/commit/d84660e394439e83874956c0937d2db37866caa1)), closes [#1803](https://github.com/sbb-design-systems/sbb-angular/issues/1803)


### [14.4.2](https://github.com/sbb-design-systems/sbb-angular/compare/14.4.1...14.4.2) (2023-01-30)


### Bug Fixes

* use correct angular and cdk version range ([#1799](https://github.com/sbb-design-systems/sbb-angular/issues/1799)) ([3c766fe](https://github.com/sbb-design-systems/sbb-angular/commit/3c766fe58165c9f60eb3e692f8cf2f4705f4a7be))


### [15.3.1](https://github.com/sbb-design-systems/sbb-angular/compare/15.3.0...15.3.1) (2023-01-27)


### Bug Fixes

* **deps:** update dependency tslib to v2.5.0 ([b82baad](https://github.com/sbb-design-systems/sbb-angular/commit/b82baad9023583139a16f0b8e4297fa0e71359d9))
* remove engine entries in package.json ([#1795](https://github.com/sbb-design-systems/sbb-angular/issues/1795)) ([dd03e0a](https://github.com/sbb-design-systems/sbb-angular/commit/dd03e0ac5cf80283978c191af70e7593f8eb3692))


### Documentation

* **loading-indicator:** add note about fullbox mode ([#1792](https://github.com/sbb-design-systems/sbb-angular/issues/1792)) ([854fb00](https://github.com/sbb-design-systems/sbb-angular/commit/854fb00ee1ac713bb20065e13ac22651cd5c743b)), closes [#1791](https://github.com/sbb-design-systems/sbb-angular/issues/1791)

### [14.4.1](https://github.com/sbb-design-systems/sbb-angular/compare/14.4.0...14.4.1) (2023-01-27)


### Bug Fixes

* **angular/tooltip:** animations running when timeouts haven't elapsed ([#1690](https://github.com/sbb-design-systems/sbb-angular/issues/1690)) ([5e3d10e](https://github.com/sbb-design-systems/sbb-angular/commit/5e3d10e849628a0bda5e8ae86675570bdeb4f066))
* **deps:** update angular to v14.2.12 ([6389aad](https://github.com/sbb-design-systems/sbb-angular/commit/6389aadeff8338574b5e7b24bc9580be8465294d))
* **deps:** update dependency @stackblitz/sdk to v1.8.1 ([7f21b02](https://github.com/sbb-design-systems/sbb-angular/commit/7f21b02749add5e6b66ec52dbd066bb21fe7d4cf))
* **deps:** update dependency maplibre-gl to v2.4.0 (14.x) ([#1649](https://github.com/sbb-design-systems/sbb-angular/issues/1649)) ([10548d7](https://github.com/sbb-design-systems/sbb-angular/commit/10548d723b7803eae99dba4978cb7d34a1541ba6))
* **deps:** update dependency tslib to v2.4.1 ([ebb0e22](https://github.com/sbb-design-systems/sbb-angular/commit/ebb0e2297ac7dd136f61767df9dfbb0271dbfad0))
* **deps:** update dependency zone.js to v0.12.0 ([3d07a73](https://github.com/sbb-design-systems/sbb-angular/commit/3d07a734da7ed6d370c7cb59402bb0e7953d2201))
* **multiple:** add HCM for disabled tabs and steps ([#1714](https://github.com/sbb-design-systems/sbb-angular/issues/1714)) ([c9bee31](https://github.com/sbb-design-systems/sbb-angular/commit/c9bee318d4ee37b6ab6df88de4625d0d2eb2ee03))
* remove engine entries in package.json ([#1795](https://github.com/sbb-design-systems/sbb-angular/issues/1795)) ([0447eea](https://github.com/sbb-design-systems/sbb-angular/commit/0447eea285ca76e731c449fd97ef14274c3fbb1b))


### Documentation

* display warnings in update guide ([#1702](https://github.com/sbb-design-systems/sbb-angular/issues/1702)) ([813a9ad](https://github.com/sbb-design-systems/sbb-angular/commit/813a9ad27fdc998c2c20fa5a9ee393caff292efd))

### [13.15.1](https://github.com/sbb-design-systems/sbb-angular/compare/13.15.0...13.15.1) (2023-01-27)


### Bug Fixes

* **deps:** update dependency @angular/cdk to v13.3.9 ([9a4430e](https://github.com/sbb-design-systems/sbb-angular/commit/9a4430eab65d8c7ecc0d3a17612abfe54487d3b2))
* **deps:** update dependency @stackblitz/sdk to v1.8.0 ([9df8ada](https://github.com/sbb-design-systems/sbb-angular/commit/9df8ada9c20fda6467204801561e2ad8520399d4))
* **journey-maps:** add missing migration instruction ([#1499](https://github.com/sbb-design-systems/sbb-angular/issues/1499)) ([888c0c7](https://github.com/sbb-design-systems/sbb-angular/commit/888c0c7a11400134b06cd6b57844d82d73c95abf))
* remove engine entries in package.json ([#1795](https://github.com/sbb-design-systems/sbb-angular/issues/1795)) ([cd4e8b4](https://github.com/sbb-design-systems/sbb-angular/commit/cd4e8b476dccc48e30ce0be43c00d8ca5d53bff0))


### Documentation

* update 13.x how-to-update guide ([#1688](https://github.com/sbb-design-systems/sbb-angular/issues/1688)) ([ffe6668](https://github.com/sbb-design-systems/sbb-angular/commit/ffe6668d6c6218527ed520f05c79783f1deb94c8))

## [15.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.1.0...15.3.0) (2023-01-19)

Due to a hiccup with 15.2.0 we skip directly to 15.3.0.

### Features

* **journey-maps:** add new POIs subcategories for angular showcase as well ([#1766](https://github.com/sbb-design-systems/sbb-angular/issues/1766)) ([043bc09](https://github.com/sbb-design-systems/sbb-angular/commit/043bc09351465541f51164783393217498715b8f))


### Bug Fixes

* **deps:** update dependency rxjs to v7.8.0 ([8ef827e](https://github.com/sbb-design-systems/sbb-angular/commit/8ef827ea44ce2c07ed86b7f45aea4f9bc98ec8d8))
* **journey-maps:** export web component CSS in package.json ([#1767](https://github.com/sbb-design-systems/sbb-angular/issues/1767)) ([46027dc](https://github.com/sbb-design-systems/sbb-angular/commit/46027dcfa1d9dc9df3bd6e59212289ecac5773bd))

## [15.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/15.0.2...15.1.0) (2023-01-04)


### Features

* **journey-maps:** add new POIs subcategories ([#1765](https://github.com/sbb-design-systems/sbb-angular/issues/1765)) ([39012f6](https://github.com/sbb-design-systems/sbb-angular/commit/39012f67e7be12ed4d4d175e36035b2080cec8b7))


### Bug Fixes

* **deps:** update dependency rxjs to v7.6.0 ([4ad1f50](https://github.com/sbb-design-systems/sbb-angular/commit/4ad1f50a213d9bb19f4e8f696dc81b22159bc0de))

### [15.0.2](https://github.com/sbb-design-systems/sbb-angular/compare/15.0.1...15.0.2) (2022-12-05)


### Bug Fixes

* **angular/menu:** explicitly set aria-expanded to true/false ([#1752](https://github.com/sbb-design-systems/sbb-angular/issues/1752)) ([edf01ec](https://github.com/sbb-design-systems/sbb-angular/commit/edf01ecae6aefe3d3ff48b1a6cf24b6014111238))
* **angular/select:** changed after checked error if option label changes ([#1753](https://github.com/sbb-design-systems/sbb-angular/issues/1753)) ([aa583df](https://github.com/sbb-design-systems/sbb-angular/commit/aa583dff9257a0e030ccbbe502ef7cbd35bb2ac1))
* **stackblitz:** update stackblitz assets to v15 ([#1751](https://github.com/sbb-design-systems/sbb-angular/issues/1751)) ([890066f](https://github.com/sbb-design-systems/sbb-angular/commit/890066f6638e13ab95bf0d1777fe222e3c9e36c4))

### [15.0.1](https://github.com/sbb-design-systems/sbb-angular/compare/15.0.0...15.0.1) (2022-11-23)


### Bug Fixes

* **fix:** update angular and cdk version range ([1741](https://github.com/sbb-design-systems/sbb-angular/pull/1741))
* **deps:** update angular to v15.0.1 ([b4235c9](https://github.com/sbb-design-systems/sbb-angular/commit/b4235c916cc947f731401478b6608e69b13cbf42))

## [15.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/14.0.0...15.0.0) (2022-11-22)


### ⚠ BREAKING CHANGES

* **angular/tooltip:** Align the default tooltip icon in lean mode with the SBB style guide and replace the question mark with an info icon.
* **angular/button:** Constructor parameter `contentObserver` becomes required.
* **angular/dialog:** Remove unused constructor parameter `overlayContainer`.
* **angular/lightbox:** Remove unused constructor parameter `overlayContainer`.
* **angular/loading-indicator:** Mode `fullscreen` is removed.
* **angular/menu:** Constructor parameter `_changeDetectorRef` becomes required.
  * SbbMenuTrigger: Constructor parameter `_ngZone` becomes required.
* **angular/datepicker:** In `SbbDateFormats` `dateInputPure` becomes required.

### Features

* **angular/notification:** add type `info-light` ([#1561](https://github.com/sbb-design-systems/sbb-angular/issues/1561)) ([15ede0a](https://github.com/sbb-design-systems/sbb-angular/commit/15ede0a7fcccad9e3b467a7b5d9709fbf27db7d0))
* **angular/select:** add page down/up button functionality ([#1718](https://github.com/sbb-design-systems/sbb-angular/issues/1718)) ([33d683e](https://github.com/sbb-design-systems/sbb-angular/commit/33d683eb1da9f3c76386ef8cbde4bcd62556c6da))
* **journey-maps:** implement option to remove overflowing labels on static map ([#1678](https://github.com/sbb-design-systems/sbb-angular/issues/1678)) ([43f8f9d](https://github.com/sbb-design-systems/sbb-angular/commit/43f8f9d6ab4b5f9e72fda539024cd59428ca1f92))
* **journey-maps:** journey-maps display options ([#1681](https://github.com/sbb-design-systems/sbb-angular/issues/1681)) ([ed5b9d4](https://github.com/sbb-design-systems/sbb-angular/commit/ed5b9d4dc1ecd3dbcfb84be44acc7e3ff1876eee))
* **journey-maps:** points of interest environment option ([#1679](https://github.com/sbb-design-systems/sbb-angular/issues/1679)) ([306269e](https://github.com/sbb-design-systems/sbb-angular/commit/306269e989a4cc169164e2cf90f095df1c0ee84b))
* **multiple:** provide the complete set of the SBBWeb font ([#1676](https://github.com/sbb-design-systems/sbb-angular/issues/1676)) ([db74518](https://github.com/sbb-design-systems/sbb-angular/commit/db745188cec3bdff9af55911629899c921021d49)), closes [#1564](https://github.com/sbb-design-systems/sbb-angular/issues/1564)


### Bug Fixes

* **angular/autocomplete:** do not reset scroll if an option is added ([#1589](https://github.com/sbb-design-systems/sbb-angular/issues/1589)) ([7b13018](https://github.com/sbb-design-systems/sbb-angular/commit/7b130181d1f81c0a1bf05d072b7efad61820c079)), closes [#1571](https://github.com/sbb-design-systems/sbb-angular/issues/1571)
* **angular/autocomplete:** prevent outside clicks from going to other overlays ([#1616](https://github.com/sbb-design-systems/sbb-angular/issues/1616)) ([c3a2124](https://github.com/sbb-design-systems/sbb-angular/commit/c3a2124b3a564434464614df83da59cc8f95ed78))
* **angular/button:** support content change between text and no text ([#1659](https://github.com/sbb-design-systems/sbb-angular/issues/1659)) ([a876cba](https://github.com/sbb-design-systems/sbb-angular/commit/a876cbac7b98783308a39a586646ca4b57418519))
* **angular/checkbox:** disabled state not distinguishable in high contrast mode ([#1691](https://github.com/sbb-design-systems/sbb-angular/issues/1691)) ([c0da19e](https://github.com/sbb-design-systems/sbb-angular/commit/c0da19e11c308488bbe0d5905098b5eb19edc275))
* **angular/datepicker:** no weekday in standalone date input ([#1622](https://github.com/sbb-design-systems/sbb-angular/issues/1622)) ([9a7e80f](https://github.com/sbb-design-systems/sbb-angular/commit/9a7e80f869712cbb25aa53c6934d5cab0e7ede7d))
* **angular/dialog:** aria-modal not being set ([#1689](https://github.com/sbb-design-systems/sbb-angular/issues/1689)) ([6a6ea9f](https://github.com/sbb-design-systems/sbb-angular/commit/6a6ea9f930c44fbf9509bbabe712ed495f9aab62))
* **angular/lightbox:** correct dependency tree for CDK dialog ([#1658](https://github.com/sbb-design-systems/sbb-angular/issues/1658)) ([9ccb968](https://github.com/sbb-design-systems/sbb-angular/commit/9ccb968acb674061756a3913a2da0583205ac144))
* **angular/lightbox:** fix height calculation on mobile ([#1591](https://github.com/sbb-design-systems/sbb-angular/issues/1591)) ([1a64f8b](https://github.com/sbb-design-systems/sbb-angular/commit/1a64f8b9fa7cec611282911438c896fa340289b3))
* **angular/lightbox:** update height on window resize ([#1698](https://github.com/sbb-design-systems/sbb-angular/issues/1698)) ([87d2dd5](https://github.com/sbb-design-systems/sbb-angular/commit/87d2dd5f82a8286626832b7ec08d68332c3bcc81)), closes [#1696](https://github.com/sbb-design-systems/sbb-angular/issues/1696)
* **angular/processflow:** accept AbstractControl in isErrorState ([#1552](https://github.com/sbb-design-systems/sbb-angular/issues/1552)) ([1ee7ab4](https://github.com/sbb-design-systems/sbb-angular/commit/1ee7ab4dcca0d132d80815f00ac06cdb35c76a69))
* **angular/processflow:** avoid letters being cut off ([#1638](https://github.com/sbb-design-systems/sbb-angular/issues/1638)) ([d688ea9](https://github.com/sbb-design-systems/sbb-angular/commit/d688ea954c46eea6ab7e43ee69d80664eb92977d))
* **angular/processflow:** fix bug that inactive steps are displayed ([#1651](https://github.com/sbb-design-systems/sbb-angular/issues/1651)) ([9750a99](https://github.com/sbb-design-systems/sbb-angular/commit/9750a998af5473b7378da592da8f510cc050a229)), closes [#1650](https://github.com/sbb-design-systems/sbb-angular/issues/1650)
* **angular/processflow:** remove obsolete aria-expanded attribute ([#1623](https://github.com/sbb-design-systems/sbb-angular/issues/1623)) ([c6aad0b](https://github.com/sbb-design-systems/sbb-angular/commit/c6aad0bf1dbef9406bfa83e38029da0cb324a3b7))
* **angular/radio:** radio not preselected with static value and an ngIf ([#1695](https://github.com/sbb-design-systems/sbb-angular/issues/1695)) ([b359380](https://github.com/sbb-design-systems/sbb-angular/commit/b3593800c7aa8d67e3ad3e3b3bfaf20029f52d4a))
* **angular/schematics:** adapt schematics imports ([#1593](https://github.com/sbb-design-systems/sbb-angular/issues/1593)) ([dfe2c71](https://github.com/sbb-design-systems/sbb-angular/commit/dfe2c711f33c4eb69bd431b6896d307044f989c4))
* **angular/search:** close and open header search programmatically ([#1585](https://github.com/sbb-design-systems/sbb-angular/issues/1585)) ([f14254e](https://github.com/sbb-design-systems/sbb-angular/commit/f14254e54c87c0e450b7309f1704f50f74534ff1)), closes [#1579](https://github.com/sbb-design-systems/sbb-angular/issues/1579)
* **angular/select:** don't assign typeahead value after blur ([#1727](https://github.com/sbb-design-systems/sbb-angular/issues/1727)) ([df7fe8a](https://github.com/sbb-design-systems/sbb-angular/commit/df7fe8a877a53b449a35f24d69a12b0c8cd89250))
* **angular/tooltip:** animations running when timeouts haven't elapsed ([#1690](https://github.com/sbb-design-systems/sbb-angular/issues/1690)) ([89e1279](https://github.com/sbb-design-systems/sbb-angular/commit/89e1279457a04a2b85651bffff095d232389f3ab))
* **angular/tooltip:** avoid problem when triggers hide animation for not visible tooltip ([#1640](https://github.com/sbb-design-systems/sbb-angular/issues/1640)) ([603726e](https://github.com/sbb-design-systems/sbb-angular/commit/603726eb804c56033ffab3ea9787f8048903884e))
* **angular/tooltip:** change tooltip icon to info in lean mode ([#1704](https://github.com/sbb-design-systems/sbb-angular/issues/1704)) ([65ee52c](https://github.com/sbb-design-systems/sbb-angular/commit/65ee52c04d249d43e71e62d33dedf592849d751d)), closes [#1684](https://github.com/sbb-design-systems/sbb-angular/issues/1684)
* **angular/tooltip:** stop event propagation on trigger click ([cdd7087](https://github.com/sbb-design-systems/sbb-angular/commit/cdd70878e364b00ed143a13f02ca362d7c47bc49)), closes [#1554](https://github.com/sbb-design-systems/sbb-angular/issues/1554)
* **journey-maps/web-component:** export the web-component in package.json ([#1675](https://github.com/sbb-design-systems/sbb-angular/issues/1675)) ([424abd1](https://github.com/sbb-design-systems/sbb-angular/commit/424abd147d2e8850032c8f624dd4ab82fb465fe9))
* **journey-maps:** do not set empty lineColor property ([#1683](https://github.com/sbb-design-systems/sbb-angular/issues/1683)) ([79de755](https://github.com/sbb-design-systems/sbb-angular/commit/79de755422c6e681ba1315e2cea30cff24985be5))
* **journey-maps:** fix hover for overlapping features ([#1599](https://github.com/sbb-design-systems/sbb-angular/issues/1599)) ([edd2135](https://github.com/sbb-design-systems/sbb-angular/commit/edd21351f77a1e5c369708a8e4a03201c5acc508))
* **journey-maps:** fix styling when popup in markeroptions on false ([#1577](https://github.com/sbb-design-systems/sbb-angular/issues/1577)) ([305121c](https://github.com/sbb-design-systems/sbb-angular/commit/305121c986d1380e6f64d418a2744f937e3a9876))
* **journey-maps:** hide paginator for web component ([#1592](https://github.com/sbb-design-systems/sbb-angular/issues/1592)) ([5e9fea7](https://github.com/sbb-design-systems/sbb-angular/commit/5e9fea7a2d0139ab51ed4cd8cb3d23534f10a6fa))
* **journey-maps:** simplify sort logic ([#1514](https://github.com/sbb-design-systems/sbb-angular/issues/1514)) ([9d6f516](https://github.com/sbb-design-systems/sbb-angular/commit/9d6f51675afcb3c49dc56bf926fd393cf6ca2dc8))
* **multipe:** don't use div containers inside labels ([#1624](https://github.com/sbb-design-systems/sbb-angular/issues/1624)) ([100ecc3](https://github.com/sbb-design-systems/sbb-angular/commit/100ecc3975f28a2f9bca53ce261740fb6b8d9452))
* **multiple:** add HCM for disabled tabs and steps ([#1714](https://github.com/sbb-design-systems/sbb-angular/issues/1714)) ([9a6f2db](https://github.com/sbb-design-systems/sbb-angular/commit/9a6f2db542456c0bd2bd5717904f70e1d3ea6fc9))
* **multiple:** clean up list key manager on destroy ([#1720](https://github.com/sbb-design-systems/sbb-angular/issues/1720)) ([35a80bc](https://github.com/sbb-design-systems/sbb-angular/commit/35a80bcbc7dc2d5db0c83de9849c91eca3bc8ae5))
* **multiple:** do not override styles of SBB.ch ([#1618](https://github.com/sbb-design-systems/sbb-angular/issues/1618)) ([1dab147](https://github.com/sbb-design-systems/sbb-angular/commit/1dab147ce0c3085d401a2d9649303443ed2c0f80))
* **multiple:** replace all usages of color grey with granite ([#1665](https://github.com/sbb-design-systems/sbb-angular/issues/1665)) ([b7417a5](https://github.com/sbb-design-systems/sbb-angular/commit/b7417a5f8142efb1942762dca348c756605f90f6))
* **multiple:** resolve extended template diagnostic warnings ([#1666](https://github.com/sbb-design-systems/sbb-angular/issues/1666)) ([80f12ef](https://github.com/sbb-design-systems/sbb-angular/commit/80f12ef4dcf5d7f9d4037d6247935181154b10bc))
* **multiple:** style changes for better accessibility ([#1546](https://github.com/sbb-design-systems/sbb-angular/issues/1546)) ([889dbb2](https://github.com/sbb-design-systems/sbb-angular/commit/889dbb25c5b23051fc51bcb8c3168a6fa96ee0c9))
* remove global $localize usage ([#1570](https://github.com/sbb-design-systems/sbb-angular/issues/1570)) ([36f2a23](https://github.com/sbb-design-systems/sbb-angular/commit/36f2a231931a5b1005c0d9b19bfe0b6a7fa50300))
* **sbb-loading:** fix 3d transformation in firefox ([#1655](https://github.com/sbb-design-systems/sbb-angular/issues/1655)) ([ed56598](https://github.com/sbb-design-systems/sbb-angular/commit/ed5659820110502be44f0239a35491662ebb9c8a))
* **tooltip:** allow click event bubbling on hover trigger ([#1574](https://github.com/sbb-design-systems/sbb-angular/issues/1574)) ([a6073b9](https://github.com/sbb-design-systems/sbb-angular/commit/a6073b94e51583ebb1ca29c717af29c5b8442f26))


### Documentation

* add v15 update steps ([#1715](https://github.com/sbb-design-systems/sbb-angular/issues/1715)) ([6b12e11](https://github.com/sbb-design-systems/sbb-angular/commit/6b12e119e156e7be5bcee2eca54697c72bed323b))
* **angular/loading-indicator:** add accessibility section ([#1643](https://github.com/sbb-design-systems/sbb-angular/issues/1643)) ([f013071](https://github.com/sbb-design-systems/sbb-angular/commit/f0130716df993769ba6d8bfb37581dd8529f5626))
* **angular/notification:** add accessibility section ([#1644](https://github.com/sbb-design-systems/sbb-angular/issues/1644)) ([e978522](https://github.com/sbb-design-systems/sbb-angular/commit/e978522a544588bd5e2db8e3223831037524ff4e))
* **angular/select:** improve section about disabling the control, options or groups ([#1532](https://github.com/sbb-design-systems/sbb-angular/issues/1532)) ([7073afe](https://github.com/sbb-design-systems/sbb-angular/commit/7073afe3f79cddca388d9df5baa3e5ec67ca3225))
* display warnings in update guide ([#1702](https://github.com/sbb-design-systems/sbb-angular/issues/1702)) ([7e2759f](https://github.com/sbb-design-systems/sbb-angular/commit/7e2759fb5ade8b4dad624e48a40178393e24991e))
* fix update guide for `ng add` with version 13 ([#1578](https://github.com/sbb-design-systems/sbb-angular/issues/1578)) ([37d65a0](https://github.com/sbb-design-systems/sbb-angular/commit/37d65a0d0b35a17b3b12231f02bf67d2f59991b3))
* **journey-maps/web-component:** explain how to run the web-component showcase ([#1653](https://github.com/sbb-design-systems/sbb-angular/issues/1653)) ([128b068](https://github.com/sbb-design-systems/sbb-angular/commit/128b068bc6448f4bd209c11f5fc1244d3d354af1))
* remove angular-public package from CONTRIBUTING.md ([#1553](https://github.com/sbb-design-systems/sbb-angular/issues/1553)) ([941f78c](https://github.com/sbb-design-systems/sbb-angular/commit/941f78cd884bca911d1d5ab68b437000d54b4ea1))
* update stackblitz tsconfig.json ([#1556](https://github.com/sbb-design-systems/sbb-angular/issues/1556)) ([6e8f770](https://github.com/sbb-design-systems/sbb-angular/commit/6e8f770d7e0872567413b776ddfb11e850c95b1b))
* update steps for v13 migration ([#1580](https://github.com/sbb-design-systems/sbb-angular/issues/1580)) ([ad8c2d3](https://github.com/sbb-design-systems/sbb-angular/commit/ad8c2d34f96a27e513275ba2e090b4da9414e371))


* remove various deprecations ([#1736](https://github.com/sbb-design-systems/sbb-angular/issues/1736)) ([fd967be](https://github.com/sbb-design-systems/sbb-angular/commit/fd967be13af554e7ed3d335316cfb0c96858d17d))

## [14.4.0](https://github.com/sbb-design-systems/sbb-angular/compare/14.3.0...14.4.0) (2022-10-31)


### Features

* **journey-maps:** journey-maps display options ([#1681](https://github.com/sbb-design-systems/sbb-angular/issues/1681)) ([dad861e](https://github.com/sbb-design-systems/sbb-angular/commit/dad861e94ffdca8f9dd2ff89c17dc03039c7b811))


### Bug Fixes

* **angular/checkbox:** disabled state not distinguishable in high contrast mode ([#1691](https://github.com/sbb-design-systems/sbb-angular/issues/1691)) ([a765917](https://github.com/sbb-design-systems/sbb-angular/commit/a76591713206c17041bfda4c945f377878d2cded))
* **angular/dialog:** aria-modal not being set ([#1689](https://github.com/sbb-design-systems/sbb-angular/issues/1689)) ([59c3dea](https://github.com/sbb-design-systems/sbb-angular/commit/59c3dea218673e55b7c625d378339a83d90fe5f0)), closes [/github.com/angular/components/blob/main/src/cdk/dialog/dialog-container.ts#L62](https://github.com/sbb-design-systems//github.com/angular/components/blob/main/src/cdk/dialog/dialog-container.ts/issues/L62)
* **angular/lightbox:** update height on window resize ([#1698](https://github.com/sbb-design-systems/sbb-angular/issues/1698)) ([9be2af3](https://github.com/sbb-design-systems/sbb-angular/commit/9be2af3ab43a3b58e95579c92d309ac9ae53d3a4)), closes [#1696](https://github.com/sbb-design-systems/sbb-angular/issues/1696)
* **angular/radio:** radio not preselected with static value and an ngIf ([#1695](https://github.com/sbb-design-systems/sbb-angular/issues/1695)) ([bdac9eb](https://github.com/sbb-design-systems/sbb-angular/commit/bdac9ebb6534d30e7f6d37b1463fd13fffffe7f8))
* **deps:** update angular to v14.2.7 ([597ec3b](https://github.com/sbb-design-systems/sbb-angular/commit/597ec3b83c18ff177e29b15802d2966cd598369a))
* **journey-maps:** do not set empty lineColor property ([#1683](https://github.com/sbb-design-systems/sbb-angular/issues/1683)) ([9ab7637](https://github.com/sbb-design-systems/sbb-angular/commit/9ab7637ea9e3901a154c745a70a0cc629121ac0a))

## [14.3.0](https://github.com/sbb-design-systems/sbb-angular/compare/14.2.0...14.3.0) (2022-10-04)


### Features

* **journey-maps:** implement option to remove overflowing labels on static map ([#1678](https://github.com/sbb-design-systems/sbb-angular/issues/1678)) ([cc513df](https://github.com/sbb-design-systems/sbb-angular/commit/cc513df24df9a9222f074fb29479cfa4249c3891))
* **journey-maps:** points of interest environment option ([#1679](https://github.com/sbb-design-systems/sbb-angular/issues/1679)) ([fe7836a](https://github.com/sbb-design-systems/sbb-angular/commit/fe7836aad2ff1fdd55e424521887bf74ff375a9b))


### Bug Fixes

* **deps:** update angular to v14.2.3 ([5bef729](https://github.com/sbb-design-systems/sbb-angular/commit/5bef72910d59e87027f8627c367c1b6703f953b5))
* **deps:** update dependency rxjs to v7.5.7 ([7e96814](https://github.com/sbb-design-systems/sbb-angular/commit/7e968143150af31a728035568b1687766e22a049))

## [14.2.0](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.7...14.2.0) (2022-09-15)


### Features

* **multiple:** provide the complete set of the SBBWeb font ([#1676](https://github.com/sbb-design-systems/sbb-angular/issues/1676)) ([7845b20](https://github.com/sbb-design-systems/sbb-angular/commit/7845b20bb3d5e4803f3e37b937cca9349775b03a)), closes [#1564](https://github.com/sbb-design-systems/sbb-angular/issues/1564)


### Bug Fixes

* **journey-maps/web-component:** export the web-component in package.json ([#1675](https://github.com/sbb-design-systems/sbb-angular/issues/1675)) ([304e5b6](https://github.com/sbb-design-systems/sbb-angular/commit/304e5b6d6182511fd439fcaaed21ececd9fc6563))

### [14.1.7](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.6...14.1.7) (2022-09-05)


### Bug Fixes

* **multiple:** replace all usages of color grey with granite ([#1665](https://github.com/sbb-design-systems/sbb-angular/issues/1665)) ([08f1e0c](https://github.com/sbb-design-systems/sbb-angular/commit/08f1e0c442a1633942068f06758d988b9f6c210a))
* **multiple:** resolve extended template diagnostic warnings ([#1666](https://github.com/sbb-design-systems/sbb-angular/issues/1666)) ([5ff0dea](https://github.com/sbb-design-systems/sbb-angular/commit/5ff0deaad26c5f8c292f5941944031352d7f1af7))

### [14.1.6](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.5...14.1.6) (2022-08-25)


### Bug Fixes

* **angular/button:** support content change between text and no text ([#1659](https://github.com/sbb-design-systems/sbb-angular/issues/1659)) ([08f84b2](https://github.com/sbb-design-systems/sbb-angular/commit/08f84b25b29759ad7024f030f0368e42a01ef7d9))
* **angular/lightbox:** correct dependency tree for CDK dialog ([#1658](https://github.com/sbb-design-systems/sbb-angular/issues/1658)) ([bc94a81](https://github.com/sbb-design-systems/sbb-angular/commit/bc94a8146239a9d21ea5ec2212bad4c1157e72e1))
* **deps:** update dependency @angular/cdk to v14.1.3 ([7d80c15](https://github.com/sbb-design-systems/sbb-angular/commit/7d80c15e6a63030d6b8d83af48675f6c51c13f09))
* **sbb-loading:** fix 3d transformation in firefox ([#1655](https://github.com/sbb-design-systems/sbb-angular/issues/1655)) ([5146475](https://github.com/sbb-design-systems/sbb-angular/commit/5146475632a6ff7b8d5bff48393ae9c236164cc6))


### Documentation

* **journey-maps/web-component:** explain how to run the web-component showcase ([#1653](https://github.com/sbb-design-systems/sbb-angular/issues/1653)) ([3a2bc70](https://github.com/sbb-design-systems/sbb-angular/commit/3a2bc705d5cd3d1400a2d36070f3edd0df7ec622))

### [14.1.5](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.4...14.1.5) (2022-08-15)


### Bug Fixes

* **angular/processflow:** fix bug that inactive steps are displayed ([#1651](https://github.com/sbb-design-systems/sbb-angular/issues/1651)) ([f48ad53](https://github.com/sbb-design-systems/sbb-angular/commit/f48ad53ac00ef668cc04ad6c0e436a0dcd379481)), closes [#1650](https://github.com/sbb-design-systems/sbb-angular/issues/1650)
* **deps:** update dependency @angular/cdk to v14.1.2 ([fb7cf3e](https://github.com/sbb-design-systems/sbb-angular/commit/fb7cf3e0471c37033f4c2146308b9425a5b79867))
* **deps:** update dependency zone.js to v0.11.8 ([ae3869a](https://github.com/sbb-design-systems/sbb-angular/commit/ae3869a375790efbcb38b532020dabc69b44165b))

### [14.1.4](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.3...14.1.4) (2022-08-10)


### Bug Fixes

* **angular/datepicker:** no weekday in standalone date input ([#1622](https://github.com/sbb-design-systems/sbb-angular/issues/1622)) ([557f00a](https://github.com/sbb-design-systems/sbb-angular/commit/557f00a8238f5e2ee2574dee6dd5ff46e7b27871))
* **angular/lightbox:** fix height calculation on mobile ([#1591](https://github.com/sbb-design-systems/sbb-angular/issues/1591)) ([35bb747](https://github.com/sbb-design-systems/sbb-angular/commit/35bb74795f7a716e7ec81b6db521dcd9669728e0))
* **angular/processflow:** avoid letters being cut off ([#1638](https://github.com/sbb-design-systems/sbb-angular/issues/1638)) ([85426a2](https://github.com/sbb-design-systems/sbb-angular/commit/85426a2ed554fa5efc1e215ae944f6291e1a4840))
* **angular/processflow:** remove obsolete aria-expanded attribute ([#1623](https://github.com/sbb-design-systems/sbb-angular/issues/1623)) ([097e8a6](https://github.com/sbb-design-systems/sbb-angular/commit/097e8a691318969134696bfc07aed9452e77d6bb))
* **deps:** update dependency zone.js to v0.11.7 ([#1625](https://github.com/sbb-design-systems/sbb-angular/issues/1625)) ([a7e61a7](https://github.com/sbb-design-systems/sbb-angular/commit/a7e61a7df54ebf942e7a1a6c1cf5b2655ee1bca1))
* **multipe:** don't use div containers inside labels ([#1624](https://github.com/sbb-design-systems/sbb-angular/issues/1624)) ([eb6614c](https://github.com/sbb-design-systems/sbb-angular/commit/eb6614c3718285bda5effa82eb8c4bfaaa210bc1))


### Documentation

* **angular/loading-indicator:** add accessibility section ([#1643](https://github.com/sbb-design-systems/sbb-angular/issues/1643)) ([337bead](https://github.com/sbb-design-systems/sbb-angular/commit/337bead0fa23c8991306f0e3ef9bfe5ccb2daa18))
* **angular/notification:** add accessibility section ([#1644](https://github.com/sbb-design-systems/sbb-angular/issues/1644)) ([7097c61](https://github.com/sbb-design-systems/sbb-angular/commit/7097c612f15cc3aad2b491f0ea4843f53816f263))

### [14.1.3](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.2...14.1.3) (2022-07-26)


### Bug Fixes

* **angular/autocomplete:** prevent outside clicks from going to other overlays ([#1616](https://github.com/sbb-design-systems/sbb-angular/issues/1616)) ([6ec25ce](https://github.com/sbb-design-systems/sbb-angular/commit/6ec25ce82d8fd7cae131fc4927d0401542d9edbb))
* **angular/schematics:** adapt schematics imports ([#1593](https://github.com/sbb-design-systems/sbb-angular/issues/1593)) ([1ec46b9](https://github.com/sbb-design-systems/sbb-angular/commit/1ec46b9b8e6ece50e97851b298fa32da7f6f887c))
* **deps:** update angular ([#1596](https://github.com/sbb-design-systems/sbb-angular/issues/1596)) ([0750aef](https://github.com/sbb-design-systems/sbb-angular/commit/0750aefa532d1580d73aa306816d2b0f893482a2))
* **multiple:** do not override styles of SBB.ch ([#1618](https://github.com/sbb-design-systems/sbb-angular/issues/1618)) ([12f06ac](https://github.com/sbb-design-systems/sbb-angular/commit/12f06ac15d80867cbd7e915d575b400e4e0c1261))

### [14.1.2](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.1...14.1.2) (2022-07-14)


### Bug Fixes

* **angular/autocomplete:** do not reset scroll if an option is added ([#1589](https://github.com/sbb-design-systems/sbb-angular/issues/1589)) ([7bed87c](https://github.com/sbb-design-systems/sbb-angular/commit/7bed87cd503540208c01374f6a2ae9c450e44fca)), closes [#1571](https://github.com/sbb-design-systems/sbb-angular/issues/1571)
* **angular/search:** close and open header search programmatically ([#1585](https://github.com/sbb-design-systems/sbb-angular/issues/1585)) ([d94797f](https://github.com/sbb-design-systems/sbb-angular/commit/d94797fd2a957f5a9531a3a966aeec0d6f3075aa)), closes [#1579](https://github.com/sbb-design-systems/sbb-angular/issues/1579)
* **deps:** update dependency rxjs to v7.5.6 ([#1583](https://github.com/sbb-design-systems/sbb-angular/issues/1583)) ([43c4e7e](https://github.com/sbb-design-systems/sbb-angular/commit/43c4e7e7c0427f72090a0774c79287b2d0dcfbce))
* **journey-maps:** fix styling when popup in markeroptions on false ([#1577](https://github.com/sbb-design-systems/sbb-angular/issues/1577)) ([184b8e1](https://github.com/sbb-design-systems/sbb-angular/commit/184b8e1808dcfe0b1b45d44b37b3a39a5314639e))
* **journey-maps:** hide paginator for web component ([#1592](https://github.com/sbb-design-systems/sbb-angular/issues/1592)) ([261dccb](https://github.com/sbb-design-systems/sbb-angular/commit/261dccb6582d05f0e9eb51461e702d4a889b7966))


### Documentation

* fix update guide for `ng add` with version 13 ([#1578](https://github.com/sbb-design-systems/sbb-angular/issues/1578)) ([a392c59](https://github.com/sbb-design-systems/sbb-angular/commit/a392c59490be50377f7849571fef969a06700ef9))
* update steps for v13 migration ([#1580](https://github.com/sbb-design-systems/sbb-angular/issues/1580)) ([68ec4f2](https://github.com/sbb-design-systems/sbb-angular/commit/68ec4f2ec886da9c6b6d605d7cfb629f10e4da59))

### [14.1.1](https://github.com/sbb-design-systems/sbb-angular/compare/14.1.0...14.1.1) (2022-07-07)


### Bug Fixes

* remove global $localize usage ([#1570](https://github.com/sbb-design-systems/sbb-angular/issues/1570)) ([630767b](https://github.com/sbb-design-systems/sbb-angular/commit/630767bac6778f21763fba1ae4842d0d278bf70a))
* **tooltip:** allow click event bubbling on hover trigger ([#1574](https://github.com/sbb-design-systems/sbb-angular/issues/1574)) ([f96599c](https://github.com/sbb-design-systems/sbb-angular/commit/f96599cd549589b002bec520ca9721692ef37aa6))

## [14.1.0](https://github.com/sbb-design-systems/sbb-angular/compare/14.0.0...14.1.0) (2022-06-30)


### Features

* **angular/notification:** add type `info-light` ([#1561](https://github.com/sbb-design-systems/sbb-angular/issues/1561)) ([731e4bf](https://github.com/sbb-design-systems/sbb-angular/commit/731e4bf11237dcafcc5e33004fc737162e7ee119))


### Bug Fixes

* **angular/processflow:** accept AbstractControl in isErrorState ([#1552](https://github.com/sbb-design-systems/sbb-angular/issues/1552)) ([f265a8c](https://github.com/sbb-design-systems/sbb-angular/commit/f265a8cdd884cc46b4c44f107b6ca0200590d222))
* **angular/tooltip:** stop event propagation on trigger click ([f84c82a](https://github.com/sbb-design-systems/sbb-angular/commit/f84c82a1e293e3099b4e9ff3029d14e840ffc1b8)), closes [#1554](https://github.com/sbb-design-systems/sbb-angular/issues/1554)
* **deps:** update angular to v14.0.3 ([#1545](https://github.com/sbb-design-systems/sbb-angular/issues/1545)) ([1680df3](https://github.com/sbb-design-systems/sbb-angular/commit/1680df3194e3bfa51ae13f090d09855cb9ac3930))
* **deps:** update dependency @angular/cdk to v14.0.2 ([ad2d58b](https://github.com/sbb-design-systems/sbb-angular/commit/ad2d58b16b595681c9470b703c4c27798edb7448))
* **deps:** update dependency zone.js to v0.11.6 ([369295c](https://github.com/sbb-design-systems/sbb-angular/commit/369295c80304b0a99ee9828f0f3b97c7ef7b2feb))
* **journey-maps:** simplify sort logic ([#1514](https://github.com/sbb-design-systems/sbb-angular/issues/1514)) ([c1a7727](https://github.com/sbb-design-systems/sbb-angular/commit/c1a77271018d1b2d9090be4b3c1a59a013ffaf55))
* **multiple:** style changes for better accessibility ([#1546](https://github.com/sbb-design-systems/sbb-angular/issues/1546)) ([132dc6a](https://github.com/sbb-design-systems/sbb-angular/commit/132dc6a7515cd69f9e9886f785261c39961cfadd))


### Documentation

* **angular/select:** improve section about disabling the control, options or groups ([#1532](https://github.com/sbb-design-systems/sbb-angular/issues/1532)) ([bdae6bb](https://github.com/sbb-design-systems/sbb-angular/commit/bdae6bbc045a89ecf7ba75567deb18572b47cc13))
* remove angular-public package from CONTRIBUTING.md ([#1553](https://github.com/sbb-design-systems/sbb-angular/issues/1553)) ([d60467c](https://github.com/sbb-design-systems/sbb-angular/commit/d60467c78dc861294a7dba30d1b7e6801ea86926))
* update stackblitz tsconfig.json ([#1556](https://github.com/sbb-design-systems/sbb-angular/issues/1556)) ([2e5e872](https://github.com/sbb-design-systems/sbb-angular/commit/2e5e872d33049823683619d266b7914fbabfa2e2))

## [14.0.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.11.0...14.0.0) (2022-06-14)


### ⚠ BREAKING CHANGES

* **angular/button:**
  - sbb-icon-button has been removed and replaced in a way where the icon button styles dynamically get applied if the button only contains an icon. If you have used the sbb-icon-button in standard variant, it now has an increased size from 36px to 48px as the other buttons have.
  - SbbAnchor: Constructor parameter `ngZone` has become required.
* **angular/datepicker:** SbbDatepicker: Remove unused constructor parameter `document`.
* **journey-maps:**
  - `minZoomLevel`, `maxZoomLevel` and `maxBounds` have been moved from `viewportOptions` to `viewportBounds` input parameter
  - replace `SbbViewportOptions` with `SbbViewportDimensions` and rename input parameter from `viewportOptions` to `viewportDimensions`.
* Previously our sass code could be used via `@import '@sbb-esta/angular/styles.scss';`. This is no longer possible as we refactored our sass code to switch from `@import` to `@use` (see https://sass-lang.com/documentation/at-rules/use). We also adapted the recommended way to export sass code from a package
via an `_index.scss` file in the root of the package. You should now be able to use the following code to import our sass code: `@use '@sbb-esta/angular' as sbb;`
* **angular/menu:** Order of constructor parameters of `SbbMenuItem` has been changed and made required.
* **angular/core:** Previously the `mixinErrorState` mixin function defined
a class member for `stateChanges`. This is no longer the case, and consumers
need to provide the `stateChanges` class member themselves.
* Update to Angular 14

### Features

* **angular/dialog:** switch to CDK dialog ([#1463](https://github.com/sbb-design-systems/sbb-angular/issues/1463)) ([6e4cad6](https://github.com/sbb-design-systems/sbb-angular/commit/6e4cad61991c320b2e55481f3e96c6e8a6c95862))
* **angular/select:** allow user-defined aria-describedby ([#1402](https://github.com/sbb-design-systems/sbb-angular/issues/1402)) ([8a15b0c](https://github.com/sbb-design-systems/sbb-angular/commit/8a15b0c57dbc04a4e3f3d2b5049f62522e61e666))
* **angular/tooltip:** allow zero padding styling ([#1379](https://github.com/sbb-design-systems/sbb-angular/issues/1379)) ([eaf8fbd](https://github.com/sbb-design-systems/sbb-angular/commit/eaf8fbd1ddb597099c4cc5d07ae9724f0706c4af)), closes [#939](https://github.com/sbb-design-systems/sbb-angular/issues/939)
* **angular/tooltip:** provide style class to use tooltip inline ([#1376](https://github.com/sbb-design-systems/sbb-angular/issues/1376)) ([cdbc7af](https://github.com/sbb-design-systems/sbb-angular/commit/cdbc7afd51aad9d7516c18376ac825d93fdca1b9)), closes [#1375](https://github.com/sbb-design-systems/sbb-angular/issues/1375)
* **journey-maps:** add new input parameters to restrict map zoom or bounds  ([#1479](https://github.com/sbb-design-systems/sbb-angular/issues/1479)) ([9b0a0ce](https://github.com/sbb-design-systems/sbb-angular/commit/9b0a0ce7ecc593ec945814097e2ccfe472722e12))
* **journey-maps:** integrate Park-and-Rail and other Rokas points-of-interests ([#1424](https://github.com/sbb-design-systems/sbb-angular/issues/1424)) ([bcaa744](https://github.com/sbb-design-systems/sbb-angular/commit/bcaa744293235301cb38aa53c7ec8947158893d1))
* **journey-maps:** make the home button configurable and refactor viewportOptions ([#1483](https://github.com/sbb-design-systems/sbb-angular/issues/1483)) ([2423d27](https://github.com/sbb-design-systems/sbb-angular/commit/2423d27dff4333970bfe280525aac5d6738a6ece))
* **journey-maps:** migrate journey-maps to sbb-angular ([#1285](https://github.com/sbb-design-systems/sbb-angular/issues/1285)) ([9761323](https://github.com/sbb-design-systems/sbb-angular/commit/9761323ecaab1f6adf1b6f7817c7105f0aa3339d))
* **journey-maps:** migrate web component ([#1403](https://github.com/sbb-design-systems/sbb-angular/issues/1403)) ([d70654f](https://github.com/sbb-design-systems/sbb-angular/commit/d70654f9a34f4ff7fff3fb8300a740d75d7bc357))


### Bug Fixes

* add missing packages to ng-update package group ([#1430](https://github.com/sbb-design-systems/sbb-angular/issues/1430)) ([4be1122](https://github.com/sbb-design-systems/sbb-angular/commit/4be1122408a9f9392da1b9e9146f125f7aa14fa0))
* allow library projects to be migrated ([#1415](https://github.com/sbb-design-systems/sbb-angular/issues/1415)) ([f60c16b](https://github.com/sbb-design-systems/sbb-angular/commit/f60c16bdea63764091a46617fe0148b5ec52ca81))
* **angular/autocomplete:** outside click in Angular zone ([#1409](https://github.com/sbb-design-systems/sbb-angular/issues/1409)) ([a9462f0](https://github.com/sbb-design-systems/sbb-angular/commit/a9462f08959f50eb1a209c81459e5933900aa543))
* **angular/autocomplete:** prevent clean-up from repeatedly being called ([#1386](https://github.com/sbb-design-systems/sbb-angular/issues/1386)) ([c190114](https://github.com/sbb-design-systems/sbb-angular/commit/c190114ff86e46b57d342c8356eb631216bbf4d4))
* **angular/checkbox-panel:** correct spacing in checkbox-panel ([#1465](https://github.com/sbb-design-systems/sbb-angular/issues/1465)) ([e7cd440](https://github.com/sbb-design-systems/sbb-angular/commit/e7cd44069c288a885e5ad605d815ce74658bf9e7))
* **angular/checkbox:** add the boolean property coercion for checked input ([#1365](https://github.com/sbb-design-systems/sbb-angular/issues/1365)) ([1f7355a](https://github.com/sbb-design-systems/sbb-angular/commit/1f7355a2c936cd0c24fd8e758f5cb35120458aa3))
* **angular/chips:** don't clear the chip list when adding a new item ([#1454](https://github.com/sbb-design-systems/sbb-angular/issues/1454)) ([e56f193](https://github.com/sbb-design-systems/sbb-angular/commit/e56f19323c0a517fe9c0605d12cf0c49eeabd5a8))
* **angular/chips:** fix invalid styling when using with autocomplete ([#1420](https://github.com/sbb-design-systems/sbb-angular/issues/1420)) ([728e5cc](https://github.com/sbb-design-systems/sbb-angular/commit/728e5cc08c226ebed93e5ac2401ab062962b0aa9))
* **angular/chips:** prevent default behavior on remove button ([#1393](https://github.com/sbb-design-systems/sbb-angular/issues/1393)) ([1c2626d](https://github.com/sbb-design-systems/sbb-angular/commit/1c2626d6b09047668ef2cd4d4860a2785333cc14))
* **angular/chips:** set dirty state and correctly delete entries in arrays ([#1417](https://github.com/sbb-design-systems/sbb-angular/issues/1417)) ([0785837](https://github.com/sbb-design-systems/sbb-angular/commit/078583742a45a55a5582c9bcfa27a6acb87c1678))
* **angular/datepicker:** add ability to have numeric zero value in input ([#1447](https://github.com/sbb-design-systems/sbb-angular/issues/1447)) ([59a5f38](https://github.com/sbb-design-systems/sbb-angular/commit/59a5f38d6edc651ea31fc3e8d203230fe2ab85b1))
* **angular/datepicker:** avoid rerender when min/maxDate changes to different time on the same day ([#1361](https://github.com/sbb-design-systems/sbb-angular/issues/1361)) ([8ebb53c](https://github.com/sbb-design-systems/sbb-angular/commit/8ebb53cb257a20e4822c23e6bb57ed8fe8cc5e0c))
* **angular/form-field:** only style direct descendant buttons of `sbb-form-group-vertical` ([#1453](https://github.com/sbb-design-systems/sbb-angular/issues/1453)) ([0eaf02e](https://github.com/sbb-design-systems/sbb-angular/commit/0eaf02e019a38ee35130df345089c4ab148d6fd0))
* **angular/icon:** fix inline icon styles ([#1436](https://github.com/sbb-design-systems/sbb-angular/issues/1436)) ([d332be0](https://github.com/sbb-design-systems/sbb-angular/commit/d332be00f30466e9afa45f87a53c4f8375598c25)), closes [#1433](https://github.com/sbb-design-systems/sbb-angular/issues/1433)
* **angular/menu:** focus the first item when opening menu on iOS VoiceOver ([#1448](https://github.com/sbb-design-systems/sbb-angular/issues/1448)) ([b0af1e7](https://github.com/sbb-design-systems/sbb-angular/commit/b0af1e7a54aa43dfa458102ecfacde0428a0e2b7))
* **angular/select:** don't announce selected value multiple times ([#1411](https://github.com/sbb-design-systems/sbb-angular/issues/1411)) ([d0e1c08](https://github.com/sbb-design-systems/sbb-angular/commit/d0e1c080abde2d67987e273911a7e80ce89eea9c)), closes [#1385](https://github.com/sbb-design-systems/sbb-angular/issues/1385)
* **angular/styles:** provide missing colors smoke, charcoal and midnight as vars ([#1396](https://github.com/sbb-design-systems/sbb-angular/issues/1396)) ([4065edf](https://github.com/sbb-design-systems/sbb-angular/commit/4065edf166cbea625a651d34997c5d8f7c09cd7a))
* **angular/table:** accessibility improvements on table wrapper ([#1408](https://github.com/sbb-design-systems/sbb-angular/issues/1408)) ([13a55b2](https://github.com/sbb-design-systems/sbb-angular/commit/13a55b2c34402b1c595f0fef56817d837a7d87ce))
* **angular/tabs:** wrong scroll distance if selected tab is removed ([#1360](https://github.com/sbb-design-systems/sbb-angular/issues/1360)) ([b225276](https://github.com/sbb-design-systems/sbb-angular/commit/b225276ef0d17fe053035e8afe1c6cb1cc792ee6))
* **angular/textarea:** fix displaying line breaks in firefox ([#1446](https://github.com/sbb-design-systems/sbb-angular/issues/1446)) ([84042b3](https://github.com/sbb-design-systems/sbb-angular/commit/84042b350f13f8a811cc52e449a98e429f68e9f2))
* **angular/toast:** update generic types for openFromComponent ([#1392](https://github.com/sbb-design-systems/sbb-angular/issues/1392)) ([21cef58](https://github.com/sbb-design-systems/sbb-angular/commit/21cef586d0ca67966fcb975321fd33b926200c09))
* **deps:** pin dependency maplibre-gl to v ([#1382](https://github.com/sbb-design-systems/sbb-angular/issues/1382)) ([a7abf5e](https://github.com/sbb-design-systems/sbb-angular/commit/a7abf5ef8cdbd9a61ef9454540d3d9f6c006da55))
* **deps:** update dependency @angular/cdk to v14.0.1 ([c0c24ec](https://github.com/sbb-design-systems/sbb-angular/commit/c0c24ecf3f6fdf7ec4f546858e8c2dccfb2dc064))
* **deps:** update dependency @stackblitz/sdk to v1.8.0 ([b08ea97](https://github.com/sbb-design-systems/sbb-angular/commit/b08ea9782be896eb6acca8f412825d9b3c8ce7e3))
* **deps:** update dependency maplibre-gl to v1.15.3 ([d2c1c2e](https://github.com/sbb-design-systems/sbb-angular/commit/d2c1c2e9c3b58fc1b365fecb71703f4e489c3db0))
* **deps:** update dependency tslib to v2.4.0 ([503eea2](https://github.com/sbb-design-systems/sbb-angular/commit/503eea281b076d8cd82268016dd9a38d977b1368))
* **dialog:** avoid colliding symbol names in dialog and lightbox ([#1509](https://github.com/sbb-design-systems/sbb-angular/issues/1509)) ([503c036](https://github.com/sbb-design-systems/sbb-angular/commit/503c03628eb88828bba0011ef511bc418e8e44dc))
* **journey-maps:** add missing migration instruction ([#1499](https://github.com/sbb-design-systems/sbb-angular/issues/1499)) ([594beaa](https://github.com/sbb-design-systems/sbb-angular/commit/594beaaa59c3797ad75b44e1382473fbd87cfdf9))
* **journey-maps:** adjusted breakpoint for teaser styling ([#1475](https://github.com/sbb-design-systems/sbb-angular/issues/1475)) ([84f780c](https://github.com/sbb-design-systems/sbb-angular/commit/84f780c64bde13d8974be6442af64ea1cccd55a1))
* **journey-maps:** adjusted teaser styling ([#1437](https://github.com/sbb-design-systems/sbb-angular/issues/1437)) ([08cb622](https://github.com/sbb-design-systems/sbb-angular/commit/08cb6222e8f459b9ec8917f8b8efd3d1afa83c6f))
* **journey-maps:** buttons must be of type button ([#1443](https://github.com/sbb-design-systems/sbb-angular/issues/1443)) ([b3af852](https://github.com/sbb-design-systems/sbb-angular/commit/b3af852e6829786b1ab761a79a374e2a68296494))
* **journey-maps:** disable all map rotation ([#1471](https://github.com/sbb-design-systems/sbb-angular/issues/1471)) ([addde83](https://github.com/sbb-design-systems/sbb-angular/commit/addde8377bc919dcee169a5069e1731f01c887a5))
* **journey-maps:** don't bundle maplibre-gl into the APF ([#1470](https://github.com/sbb-design-systems/sbb-angular/issues/1470)) ([285aeaa](https://github.com/sbb-design-systems/sbb-angular/commit/285aeaa1a924a33130297c4d3ddc98f627756e10))
* **journey-maps:** fix internal references ([#1507](https://github.com/sbb-design-systems/sbb-angular/issues/1507)) ([55f90d5](https://github.com/sbb-design-systems/sbb-angular/commit/55f90d5938263a6e11c6da3625b325065280317a))
* **journey-maps:** show "Leit-POIs" for default floor in journey based routing ([#1512](https://github.com/sbb-design-systems/sbb-angular/issues/1512)) ([3efddcc](https://github.com/sbb-design-systems/sbb-angular/commit/3efddccf9bffb0ba721b87c793fbe9baf586f90d))
* **journey-maps:** show "Leit-POIs" for journey based routing ([#1500](https://github.com/sbb-design-systems/sbb-angular/issues/1500)) ([5c041d4](https://github.com/sbb-design-systems/sbb-angular/commit/5c041d4aed5bd9f4a368a8adab7e1922764c5980))
* **journey-maps:** show correct start level for indoor routing ([#1450](https://github.com/sbb-design-systems/sbb-angular/issues/1450)) ([1a12ac6](https://github.com/sbb-design-systems/sbb-angular/commit/1a12ac62d7e4e82174c9410871fafb260515ad28))
* **journey-maps:** show POI when no listenerOptions are set ([#1440](https://github.com/sbb-design-systems/sbb-angular/issues/1440)) ([56f4d58](https://github.com/sbb-design-systems/sbb-angular/commit/56f4d58b63f4440b279eb25024eb8c2a179bfe63))
* **journey-maps:** synchronize click-overlay and selection state ([#1442](https://github.com/sbb-design-systems/sbb-angular/issues/1442)) ([c8367d6](https://github.com/sbb-design-systems/sbb-angular/commit/c8367d6004ffbe55387513196b4eb7402594dce1))
* **lightbox:** fix internal reference ([#1476](https://github.com/sbb-design-systems/sbb-angular/issues/1476)) ([d0aa852](https://github.com/sbb-design-systems/sbb-angular/commit/d0aa8520cae17c5af4a5191c0265c4812e7a0928))
* remove journey-maps from stackblitz example to make it working again ([#1416](https://github.com/sbb-design-systems/sbb-angular/issues/1416)) ([c5198f3](https://github.com/sbb-design-systems/sbb-angular/commit/c5198f3fcd4c345be757590a7ad01be14d126896))
* **schematics:** weaken type check of SchematicsException ([#1513](https://github.com/sbb-design-systems/sbb-angular/issues/1513)) ([7069097](https://github.com/sbb-design-systems/sbb-angular/commit/70690979d054ac4d881d377437a5ebfd5e8ff2ad))
* **showcase:** fix icon size when using `sbb-icon-fit` ([#1421](https://github.com/sbb-design-systems/sbb-angular/issues/1421)) ([c7ab99a](https://github.com/sbb-design-systems/sbb-angular/commit/c7ab99a0ea0e0664f1f238f4caa3814eaeaa9294))


### build

* update to Angular 14 ([#1351](https://github.com/sbb-design-systems/sbb-angular/issues/1351)) ([15c4776](https://github.com/sbb-design-systems/sbb-angular/commit/15c4776611a162be19aa59b9a4c81a543aedc33e))


### Documentation

* **angular/sidebar:** typo ([#1387](https://github.com/sbb-design-systems/sbb-angular/issues/1387)) ([a72aebd](https://github.com/sbb-design-systems/sbb-angular/commit/a72aebdd2b7d79de219f2c7f487988abe287aa2e))
* **angular/table:** add example for expandable table ([#1355](https://github.com/sbb-design-systems/sbb-angular/issues/1355)) ([50001ef](https://github.com/sbb-design-systems/sbb-angular/commit/50001ef6375e0f90dd01d63d7350f04c51dd88f9))
* **angular/tabs:** typo ([#1388](https://github.com/sbb-design-systems/sbb-angular/issues/1388)) ([b40151b](https://github.com/sbb-design-systems/sbb-angular/commit/b40151b751173fb7d042cb2631dca66cbaf2199a))
* describe v14 update steps ([#1503](https://github.com/sbb-design-systems/sbb-angular/issues/1503)) ([0181bd5](https://github.com/sbb-design-systems/sbb-angular/commit/0181bd58148c9e3c344c7941c55907147d264227))
* explicitly declare v13 in migration guide ([#1495](https://github.com/sbb-design-systems/sbb-angular/issues/1495)) ([bd811bd](https://github.com/sbb-design-systems/sbb-angular/commit/bd811bd23fca29e89b8229d554906423e61e14a5))
* fix readme title ([#1394](https://github.com/sbb-design-systems/sbb-angular/issues/1394)) ([7b76dd4](https://github.com/sbb-design-systems/sbb-angular/commit/7b76dd42d1aa2f40a353b4936c6c1d897d11e8b5))
* how to release ([#1366](https://github.com/sbb-design-systems/sbb-angular/issues/1366)) ([4865afb](https://github.com/sbb-design-systems/sbb-angular/commit/4865afb6a7c49968f6b35c0666323077a81c02a3))
* release notes for the 13.12.0 release ([068d948](https://github.com/sbb-design-systems/sbb-angular/commit/068d9485f3f8ee26f29f7fd77cca7f537eff1abc))
* update developer documentation for wsl ([#1432](https://github.com/sbb-design-systems/sbb-angular/issues/1432)) ([9a1e8ca](https://github.com/sbb-design-systems/sbb-angular/commit/9a1e8ca70431c6ede4da813365667321bbf76a54))
* update journey-maps preview image ([#1429](https://github.com/sbb-design-systems/sbb-angular/issues/1429)) ([aea8f18](https://github.com/sbb-design-systems/sbb-angular/commit/aea8f1813d2746cf40ff1f9d67d1573a0520f392))
* update macOS DEVELOPER.md ([#1478](https://github.com/sbb-design-systems/sbb-angular/issues/1478)) ([6e72163](https://github.com/sbb-design-systems/sbb-angular/commit/6e721635c2bf6abe383fc5fb988f3e620e7c8e73))


* adapt sass to [@use](https://github.com/use) instead of [@import](https://github.com/import) ([#1462](https://github.com/sbb-design-systems/sbb-angular/issues/1462)) ([b02e1e4](https://github.com/sbb-design-systems/sbb-angular/commit/b02e1e48d68bd71620144acb3a544c5f3609a4a6))
* **angular/button:** dynamic icon buttons ([#1501](https://github.com/sbb-design-systems/sbb-angular/issues/1501)) ([30bdd7c](https://github.com/sbb-design-systems/sbb-angular/commit/30bdd7c73045d814a923231a96f7cfb2278ae774)), closes [#1074](https://github.com/sbb-design-systems/sbb-angular/issues/1074)
* **angular/core:** no longer define stateChanges in `mixinErrorState` ([#1372](https://github.com/sbb-design-systems/sbb-angular/issues/1372)) ([f9d8a2a](https://github.com/sbb-design-systems/sbb-angular/commit/f9d8a2a4b4e2c0788208fe2bdb3d0d7418eb56e7))
* **angular/menu:** make parameters required in constructor of SbbMenuItem ([#1427](https://github.com/sbb-design-systems/sbb-angular/issues/1427)) ([b572fb3](https://github.com/sbb-design-systems/sbb-angular/commit/b572fb360a4aec4790afa91d931b5d076ce9eed0))
* remove various deprecations ([#1496](https://github.com/sbb-design-systems/sbb-angular/issues/1496)) ([9fc8845](https://github.com/sbb-design-systems/sbb-angular/commit/9fc8845c5ac8635125b357d17ed27d1bfa5bf4e7))

## [13.15.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.14.1...13.15.0) (2022-06-02)


### Features

* **journey-maps:** add new input parameters to restrict map zoom or bounds  ([#1479](https://github.com/sbb-design-systems/sbb-angular/issues/1479)) ([5bcb343](https://github.com/sbb-design-systems/sbb-angular/commit/5bcb343c900bda644237d10207ee10c3ef01c598))


### Bug Fixes

* **deps:** update angular to v13.3.11 ([d4810cb](https://github.com/sbb-design-systems/sbb-angular/commit/d4810cb5ccaa585bc8c5516c8b0b7c25eef68038))
* **journey-maps:** adjusted breakpoint for teaser styling ([#1475](https://github.com/sbb-design-systems/sbb-angular/issues/1475)) ([1ce9edc](https://github.com/sbb-design-systems/sbb-angular/commit/1ce9edc4bda9f443bbffe5696a0cf61b24e5b192))


### Documentation

* update macOS DEVELOPER.md ([#1478](https://github.com/sbb-design-systems/sbb-angular/issues/1478)) ([2bcf447](https://github.com/sbb-design-systems/sbb-angular/commit/2bcf4471a28bb7b5481727c2edce0583862555cb))

### [13.14.1](https://github.com/sbb-design-systems/sbb-angular/compare/13.14.0...13.14.1) (2022-05-25)


### Bug Fixes

* **angular/checkbox-panel:** correct spacing in checkbox-panel ([#1468](https://github.com/sbb-design-systems/sbb-angular/issues/1468)) ([ad0b5a1](https://github.com/sbb-design-systems/sbb-angular/commit/ad0b5a113479a9f5e9d546c3c7ea755464cc1201))
* **deps:** update angular ([c66d352](https://github.com/sbb-design-systems/sbb-angular/commit/c66d3520d805ad4d3e253e615dea1043675d4791))
* **journey-maps:** disable all map rotation ([#1471](https://github.com/sbb-design-systems/sbb-angular/issues/1471)) ([66656e7](https://github.com/sbb-design-systems/sbb-angular/commit/66656e708439075854bcca6f4d82dfff1c9a87c2))
* **journey-maps:** don't bundle maplibre-gl into the APF ([#1470](https://github.com/sbb-design-systems/sbb-angular/issues/1470)) ([77999da](https://github.com/sbb-design-systems/sbb-angular/commit/77999da7d46dd4fb50ae35f08044323e99aa81b9))

## [13.14.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.13.2...13.14.0) (2022-05-12)


### Features

* **journey-maps:** integrate Park-and-Rail and other Rokas points-of-interests ([#1424](https://github.com/sbb-design-systems/sbb-angular/issues/1424)) ([467a7ba](https://github.com/sbb-design-systems/sbb-angular/commit/467a7ba52e5a78e5b50f05df6d69846eee712d7e))


### Bug Fixes

* add missing packages to ng-update package group ([#1430](https://github.com/sbb-design-systems/sbb-angular/issues/1430)) ([286ceed](https://github.com/sbb-design-systems/sbb-angular/commit/286ceed80a24059e26a1322f81d7dd25f6f45b8e))
* **angular/chips:** don't clear the chip list when adding a new item ([#1454](https://github.com/sbb-design-systems/sbb-angular/issues/1454)) ([2166565](https://github.com/sbb-design-systems/sbb-angular/commit/21665655e94c5a033c7f0a7446f0d78224ebe4bf))
* **angular/chips:** set dirty state and correctly delete entries in arrays ([#1419](https://github.com/sbb-design-systems/sbb-angular/issues/1419)) ([70ad808](https://github.com/sbb-design-systems/sbb-angular/commit/70ad80848d51ae86ce1f68eaa194b01e292ed933))
* **angular/datepicker:** add ability to have numeric zero value in input ([#1447](https://github.com/sbb-design-systems/sbb-angular/issues/1447)) ([7a9c1cc](https://github.com/sbb-design-systems/sbb-angular/commit/7a9c1cced46a07c25ba0a71b9f2e743e85aa105c))
* **angular/form-field:** only style direct descendant buttons of `sbb-form-group-vertical` ([#1453](https://github.com/sbb-design-systems/sbb-angular/issues/1453)) ([ee918aa](https://github.com/sbb-design-systems/sbb-angular/commit/ee918aa722fbb86ceaa5a2734c9c2bdf466bcda5))
* **angular/icon:** fix inline icon styles ([#1436](https://github.com/sbb-design-systems/sbb-angular/issues/1436)) ([d9ee9c3](https://github.com/sbb-design-systems/sbb-angular/commit/d9ee9c31ff10d51ff05f0134de27c252a6958186)), closes [#1433](https://github.com/sbb-design-systems/sbb-angular/issues/1433)
* **angular/menu:** focus the first item when opening menu on iOS VoiceOver ([#1448](https://github.com/sbb-design-systems/sbb-angular/issues/1448)) ([fb5e326](https://github.com/sbb-design-systems/sbb-angular/commit/fb5e3261df259337f75637637469bc63fda7ee74))
* **angular/select:** don't announce selected value multiple times ([#1411](https://github.com/sbb-design-systems/sbb-angular/issues/1411)) ([227ae03](https://github.com/sbb-design-systems/sbb-angular/commit/227ae035d29387d068b4a780144ea7a85f227868)), closes [#1385](https://github.com/sbb-design-systems/sbb-angular/issues/1385)
* **angular/textarea:** fix displaying line breaks in firefox ([#1446](https://github.com/sbb-design-systems/sbb-angular/issues/1446)) ([6ca9ed1](https://github.com/sbb-design-systems/sbb-angular/commit/6ca9ed1faab30ab2d9ccb6a73d6586f55d51909d))
* **journey-maps:** adjusted teaser styling ([#1437](https://github.com/sbb-design-systems/sbb-angular/issues/1437)) ([88d895f](https://github.com/sbb-design-systems/sbb-angular/commit/88d895ff5251584f64fe8e9b2c765249f1cd3cc3))
* **journey-maps:** buttons must be of type button ([#1443](https://github.com/sbb-design-systems/sbb-angular/issues/1443)) ([2d8661e](https://github.com/sbb-design-systems/sbb-angular/commit/2d8661efb207e933787a30cb3bd8a01080399de3))
* **journey-maps:** show correct start level for indoor routing ([#1450](https://github.com/sbb-design-systems/sbb-angular/issues/1450)) ([ee170f4](https://github.com/sbb-design-systems/sbb-angular/commit/ee170f459052f6930b4261a93265d68ee9e48ed7))
* **journey-maps:** show POI when no listenerOptions are set ([#1440](https://github.com/sbb-design-systems/sbb-angular/issues/1440)) ([0facb2a](https://github.com/sbb-design-systems/sbb-angular/commit/0facb2acdd5c9c777159b339036f74bf54e1aad4))
* **journey-maps:** synchronize click-overlay and selection state ([#1442](https://github.com/sbb-design-systems/sbb-angular/issues/1442)) ([330d123](https://github.com/sbb-design-systems/sbb-angular/commit/330d123ab598390fe4a4208410a874749dac3845))


### Documentation

* update developer documentation for wsl ([#1432](https://github.com/sbb-design-systems/sbb-angular/issues/1432)) ([ca52d1a](https://github.com/sbb-design-systems/sbb-angular/commit/ca52d1aadca93fc881e92feaaa9481d7ac6a24f4))
* update journey-maps preview image ([#1429](https://github.com/sbb-design-systems/sbb-angular/issues/1429)) ([f2f5cf0](https://github.com/sbb-design-systems/sbb-angular/commit/f2f5cf018d6740ea761025d6065b3def6dae10ce))

### [13.13.2](https://github.com/sbb-design-systems/sbb-angular/compare/13.13.0...13.13.2) (2022-05-03)


### Bug Fixes

* allow library projects to be migrated ([#1428](https://github.com/sbb-design-systems/sbb-angular/issues/1428)) ([9eccc30](https://github.com/sbb-design-systems/sbb-angular/commit/9eccc307e5d88e4188538e876cfbced0876e8349))
* **angular/autocomplete:** outside click in Angular zone ([#1409](https://github.com/sbb-design-systems/sbb-angular/issues/1409)) ([ae9e082](https://github.com/sbb-design-systems/sbb-angular/commit/ae9e082d04122440a132d74362a2a805b931aba1))
* **angular/chips:** fix invalid styling when using with autocomplete ([#1420](https://github.com/sbb-design-systems/sbb-angular/issues/1420)) ([b1f9074](https://github.com/sbb-design-systems/sbb-angular/commit/b1f907450ae06034a520897f045849eb85d9e163))
* **angular/table:** accessibility improvements on table wrapper ([#1408](https://github.com/sbb-design-systems/sbb-angular/issues/1408)) ([59dc110](https://github.com/sbb-design-systems/sbb-angular/commit/59dc1107ed99876bacfe5ab1ca1e4f15b5bcdb2a))
* **deps:** update dependency tslib to v2.4.0 ([814ea58](https://github.com/sbb-design-systems/sbb-angular/commit/814ea5888e3f1120a2a3b3a113842656e92cb4fd))
* remove journey-maps from stackblitz example to make it working again ([#1416](https://github.com/sbb-design-systems/sbb-angular/issues/1416)) ([97ed2cb](https://github.com/sbb-design-systems/sbb-angular/commit/97ed2cb7551fece93432ed83d702643b572c17c2))
* **showcase:** fix icon size when using `sbb-icon-fit` ([#1421](https://github.com/sbb-design-systems/sbb-angular/issues/1421)) ([9d97337](https://github.com/sbb-design-systems/sbb-angular/commit/9d97337838c3fd5daa7903fc2e27f807db1e5a16))

## [13.13.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.12.0...13.13.0) (2022-04-21)


### Features

* **angular/select:** allow user-defined aria-describedby ([#1402](https://github.com/sbb-design-systems/sbb-angular/issues/1402)) ([0de0096](https://github.com/sbb-design-systems/sbb-angular/commit/0de00960f0a8b89f1e6bc84f7781f84bbf7b4a34))
* **journey-maps:** migrate web component ([#1403](https://github.com/sbb-design-systems/sbb-angular/issues/1403)) ([5fae5ba](https://github.com/sbb-design-systems/sbb-angular/commit/5fae5ba54d2a99dfd8770d892eb5260611415866))


### Bug Fixes

* **angular/chips:** prevent default behavior on remove button ([#1393](https://github.com/sbb-design-systems/sbb-angular/issues/1393)) ([78fa29b](https://github.com/sbb-design-systems/sbb-angular/commit/78fa29b5e969951518372385227899da0e22f830))
* **angular/styles:** provide missing colors smoke, charcoal and midnight as vars ([#1396](https://github.com/sbb-design-systems/sbb-angular/issues/1396)) ([f9dd524](https://github.com/sbb-design-systems/sbb-angular/commit/f9dd524ee5ed2931a2aae1b35d44952264576196))
* **angular/toast:** update generic types for openFromComponent ([#1392](https://github.com/sbb-design-systems/sbb-angular/issues/1392)) ([015bf32](https://github.com/sbb-design-systems/sbb-angular/commit/015bf32716159f2f8e95f98308deef9f4feb6d37))
* **deps:** update angular to v13.3.4 ([833e63f](https://github.com/sbb-design-systems/sbb-angular/commit/833e63f0cbc324222b2461389b36340ebbe508d1))
* **deps:** update dependency maplibre-gl to v1.15.3 ([4c9f2b1](https://github.com/sbb-design-systems/sbb-angular/commit/4c9f2b1eb32e1362f779c0877a1bd8507a798172))


### Documentation

* fix readme title ([#1394](https://github.com/sbb-design-systems/sbb-angular/issues/1394)) ([55178cd](https://github.com/sbb-design-systems/sbb-angular/commit/55178cd8c098295bcedd29328e2a9174de42fccc))

## [13.12.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.11.0...13.12.0) (2022-04-12)


### Features

* **angular/tooltip:** allow zero padding styling ([#1379](https://github.com/sbb-design-systems/sbb-angular/issues/1379)) ([2952482](https://github.com/sbb-design-systems/sbb-angular/commit/29524828c8f262caf8e38482f6e0f0282db55062)), closes [#939](https://github.com/sbb-design-systems/sbb-angular/issues/939)
* **angular/tooltip:** provide style class to use tooltip inline ([#1376](https://github.com/sbb-design-systems/sbb-angular/issues/1376)) ([9531986](https://github.com/sbb-design-systems/sbb-angular/commit/953198602c7c493731d176f25e46400c148332c8)), closes [#1375](https://github.com/sbb-design-systems/sbb-angular/issues/1375)
* **journey-maps:** migrate journey-maps to sbb-angular ([#1285](https://github.com/sbb-design-systems/sbb-angular/issues/1285)) ([9fbf6db](https://github.com/sbb-design-systems/sbb-angular/commit/9fbf6dbf8939558ee58ee5e66a6a55df16290ccb))


### Bug Fixes

* **angular/autocomplete:** prevent clean-up from repeatedly being called ([#1386](https://github.com/sbb-design-systems/sbb-angular/issues/1386)) ([b528551](https://github.com/sbb-design-systems/sbb-angular/commit/b5285510499181b026baa654008098f9fe542062))
* **angular/checkbox:** add the boolean property coercion for checked input ([#1365](https://github.com/sbb-design-systems/sbb-angular/issues/1365)) ([1f7355a](https://github.com/sbb-design-systems/sbb-angular/commit/1f7355a2c936cd0c24fd8e758f5cb35120458aa3))
* **angular/datepicker:** avoid rerender when min/maxDate changes to different time on the same day ([#1361](https://github.com/sbb-design-systems/sbb-angular/issues/1361)) ([8ebb53c](https://github.com/sbb-design-systems/sbb-angular/commit/8ebb53cb257a20e4822c23e6bb57ed8fe8cc5e0c))
* **angular/tabs:** wrong scroll distance if selected tab is removed ([#1360](https://github.com/sbb-design-systems/sbb-angular/issues/1360)) ([b225276](https://github.com/sbb-design-systems/sbb-angular/commit/b225276ef0d17fe053035e8afe1c6cb1cc792ee6))
* **deps:** pin dependency maplibre-gl to v ([66d413f](https://github.com/sbb-design-systems/sbb-angular/commit/66d413f49680e6d7ead85880cefce1f5f9e1e247))


### Documentation

* **angular/sidebar:** typo ([#1387](https://github.com/sbb-design-systems/sbb-angular/issues/1387)) ([b08c890](https://github.com/sbb-design-systems/sbb-angular/commit/b08c8906a8e85d458ea608581ca5cbb7d53e5de2))
* **angular/table:** add example for expandable table ([#1355](https://github.com/sbb-design-systems/sbb-angular/issues/1355)) ([f6d99a2](https://github.com/sbb-design-systems/sbb-angular/commit/f6d99a2a01a8bfe66c5e40e40d3c000f8cb0811e))
* **angular/tabs:** typo ([#1388](https://github.com/sbb-design-systems/sbb-angular/issues/1388)) ([3d06da9](https://github.com/sbb-design-systems/sbb-angular/commit/3d06da92fa216232da62bc826158316cb9f1e3cf))
* how to release ([#1366](https://github.com/sbb-design-systems/sbb-angular/issues/1366)) ([1653aa4](https://github.com/sbb-design-systems/sbb-angular/commit/1653aa46b168a06b77f8ef9a79a6392f5b6e6bf2))

## [13.11.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.10.0...13.11.0) (2022-03-31)


### Features

* **angular/dialog:** add support for explicit injector ([#1342](https://github.com/sbb-design-systems/sbb-angular/issues/1342)) ([3056dd0](https://github.com/sbb-design-systems/sbb-angular/commit/3056dd0b1ce0f8da0a3236f299654f3b0cd001e0))


### Bug Fixes

* **angular/autocomplete:** always emit closed event ([#1320](https://github.com/sbb-design-systems/sbb-angular/issues/1320)) ([670f881](https://github.com/sbb-design-systems/sbb-angular/commit/670f881d995b31f6f60418fcc6dba726bbf3e9e0))
* **angular/radio:** set tabindex based on selected state ([#1345](https://github.com/sbb-design-systems/sbb-angular/issues/1345)) ([71712ed](https://github.com/sbb-design-systems/sbb-angular/commit/71712ededcfb4c6175956349f2927cb39e8677b9))
* **angular/tabs:** focus wrapping back to selected label when using shift + tab ([#1343](https://github.com/sbb-design-systems/sbb-angular/issues/1343)) ([c7bceb2](https://github.com/sbb-design-systems/sbb-angular/commit/c7bceb2e414b78330754aa37018fd8e82403c193))
* **angular/tabs:** update tab state when active tab is swapped out ([#1344](https://github.com/sbb-design-systems/sbb-angular/issues/1344)) ([9ac88ac](https://github.com/sbb-design-systems/sbb-angular/commit/9ac88acee9e677ae3677368860be2465bc6d98eb))

## [13.10.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.9.0...13.10.0) (2022-03-24)


### Features

* **angular/dialog:** add the ability to control the animation duration ([#1284](https://github.com/sbb-design-systems/sbb-angular/issues/1284)) ([afc7bf0](https://github.com/sbb-design-systems/sbb-angular/commit/afc7bf04dbb84b4fdd3a8882eb4e461271bdff74))


### Bug Fixes

* **angular/autocomplete:** re-enter the Angular zone when the `NgZone.onStable` emits ([#1314](https://github.com/sbb-design-systems/sbb-angular/issues/1314)) ([70fa240](https://github.com/sbb-design-systems/sbb-angular/commit/70fa240da3954d6b47ea69fccbb5c60fbeaac0dc))
* **angular/badge:** ensure overflow visible ([#1312](https://github.com/sbb-design-systems/sbb-angular/issues/1312)) ([ba6cf81](https://github.com/sbb-design-systems/sbb-angular/commit/ba6cf81180f8807c88cba118944773ce77f3c10f))
* **angular/button:** fix wrapping of sbb-link ([#1300](https://github.com/sbb-design-systems/sbb-angular/issues/1300)) ([5498488](https://github.com/sbb-design-systems/sbb-angular/commit/54984882bc3a565f7567ccbd36377ffc7db1cca9)), closes [#1296](https://github.com/sbb-design-systems/sbb-angular/issues/1296)
* **angular/checkbox:** model value not updated when using toggle method ([#1323](https://github.com/sbb-design-systems/sbb-angular/issues/1323)) ([b90dc32](https://github.com/sbb-design-systems/sbb-angular/commit/b90dc3293a0a7e21080a68a390835b02070abe13))
* **angular/datepicker:** fix Voiceover losing focus on PageDown ([#1286](https://github.com/sbb-design-systems/sbb-angular/issues/1286)) ([d976c81](https://github.com/sbb-design-systems/sbb-angular/commit/d976c818e8653a5a4b5caa0694d158830700710b))
* **angular/datepicker:** use cdk-visually-hidden on calendar header ([#1311](https://github.com/sbb-design-systems/sbb-angular/issues/1311)) ([4a6ed2e](https://github.com/sbb-design-systems/sbb-angular/commit/4a6ed2e7d25c13b6d09966bee77d01401d66e83a))
* **angular/icon:** clip overflowing icon elements ([#1301](https://github.com/sbb-design-systems/sbb-angular/issues/1301)) ([be0aa3b](https://github.com/sbb-design-systems/sbb-angular/commit/be0aa3b66d0c7a324a2044ffa950d07cb80ea5cf))
* **angular/input:** resolve memory leak on iOS ([#1313](https://github.com/sbb-design-systems/sbb-angular/issues/1313)) ([a1c1ede](https://github.com/sbb-design-systems/sbb-angular/commit/a1c1ede66a6cc802ae0728b7b1836bad0e1cd68b))
* **angular/radio:** fix empty radio in high-contrast-mode ([#1327](https://github.com/sbb-design-systems/sbb-angular/issues/1327)) ([bb0096c](https://github.com/sbb-design-systems/sbb-angular/commit/bb0096c358f7d1555c1e0a4e5e3f0bfc6cdb9ec7))
* **angular/schematics:** mark ng-add schematics as hidden ([#1317](https://github.com/sbb-design-systems/sbb-angular/issues/1317)) ([cb32ee2](https://github.com/sbb-design-systems/sbb-angular/commit/cb32ee28d019201d7a4c63949c94a85ee37c04a9))
* **angular/select:** value set through property not being propagated to value accessor ([#1324](https://github.com/sbb-design-systems/sbb-angular/issues/1324)) ([a4e0f07](https://github.com/sbb-design-systems/sbb-angular/commit/a4e0f07ba3007cbe2ff1b1be33e891dcc00e0bed))
* **angular/styles:** remove float style from fieldset legend ([#1299](https://github.com/sbb-design-systems/sbb-angular/issues/1299)) ([0d1b7d2](https://github.com/sbb-design-systems/sbb-angular/commit/0d1b7d27eb2a45e5488c876c4e50e0c5a005a99e)), closes [#1297](https://github.com/sbb-design-systems/sbb-angular/issues/1297)
* **angular/tabs:** avoid timeouts in background tabs ([#1283](https://github.com/sbb-design-systems/sbb-angular/issues/1283)) ([6836a8c](https://github.com/sbb-design-systems/sbb-angular/commit/6836a8cfcba76730962043fe9a671078b2327aa7))
* **angular/toggle:** highlight toggle in high contrast mode ([#1331](https://github.com/sbb-design-systems/sbb-angular/issues/1331)) ([722830b](https://github.com/sbb-design-systems/sbb-angular/commit/722830b2995f5639b39b55f4e9285a2dfa6eedbc))
* **angular:** scale native hidden inputs to its labels ([#1298](https://github.com/sbb-design-systems/sbb-angular/issues/1298)) ([bc0c6bf](https://github.com/sbb-design-systems/sbb-angular/commit/bc0c6bf833f9ea72281ca967d214c21943fcb3b5)), closes [#1295](https://github.com/sbb-design-systems/sbb-angular/issues/1295)

## [13.9.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.8.0...13.9.0) (2022-03-10)


### Features

* **angular/autocomplete:** enable hints for option groups inside menu ([#1251](https://github.com/sbb-design-systems/sbb-angular/issues/1251)) ([6fee165](https://github.com/sbb-design-systems/sbb-angular/commit/6fee165948100df14e962c0ebc1e35d25401c98f))
* **angular/menu:** allow grouping of elements ([#1249](https://github.com/sbb-design-systems/sbb-angular/issues/1249)) ([257b2a5](https://github.com/sbb-design-systems/sbb-angular/commit/257b2a57868e144960a23dd11e3cbe9bfa6a6c09)), closes [#201](https://github.com/sbb-design-systems/sbb-angular/issues/201)


### Bug Fixes

* **angular/autocomplete:** able to tab into descendants with visibility while closed ([#1269](https://github.com/sbb-design-systems/sbb-angular/issues/1269)) ([f13de08](https://github.com/sbb-design-systems/sbb-angular/commit/f13de08649b8bb095aa0592d469f838f3397aedf))
* **angular/autocomplete:** correct color of hover elements ([#1266](https://github.com/sbb-design-systems/sbb-angular/issues/1266)) ([14611d1](https://github.com/sbb-design-systems/sbb-angular/commit/14611d16746094e456a9e3340fee761eb9d884c6))
* **angular/button:** avoid setting a tabindex on all link buttons ([#1261](https://github.com/sbb-design-systems/sbb-angular/issues/1261)) ([9c1c636](https://github.com/sbb-design-systems/sbb-angular/commit/9c1c63640ccf05557b36f2c8787f6f8fe296455b))
* **angular/chips:** create new array or set on update ([#1273](https://github.com/sbb-design-systems/sbb-angular/issues/1273)) ([d708b4a](https://github.com/sbb-design-systems/sbb-angular/commit/d708b4a9348b08c612006ace9bdcd6bb9f4916b3))
* **angular/dialog:** don't block child component animations on open ([#1262](https://github.com/sbb-design-systems/sbb-angular/issues/1262)) ([6a90e5c](https://github.com/sbb-design-systems/sbb-angular/commit/6a90e5cdf12342d1f7942f9eb90b03da7c5b923a))
* **angular/dialog:** don't wait for animation before moving focus ([#1275](https://github.com/sbb-design-systems/sbb-angular/issues/1275)) ([99d6a05](https://github.com/sbb-design-systems/sbb-angular/commit/99d6a0557164c1b591318e7a962d962e3954bb15))
* **angular/select:** disabled state out of sync when swapping form group with a disabled one ([#1256](https://github.com/sbb-design-systems/sbb-angular/issues/1256)) ([773d480](https://github.com/sbb-design-systems/sbb-angular/commit/773d480c4eb0ae63b9114631536fd47cbdc63353))
* **angular/tooltip:** decouple removal logic from change detection ([#1264](https://github.com/sbb-design-systems/sbb-angular/issues/1264)) ([9c24067](https://github.com/sbb-design-systems/sbb-angular/commit/9c24067a3f2acb57249ad067e157f1fc4eca41a6))
* **deps:** update dependency rxjs to v7.5.5 ([#1267](https://github.com/sbb-design-systems/sbb-angular/issues/1267)) ([e364947](https://github.com/sbb-design-systems/sbb-angular/commit/e364947fab9ff3153ee079336d2acf6a841335f2))
* **deps:** update dependency zone.js to v0.11.5 ([#1254](https://github.com/sbb-design-systems/sbb-angular/issues/1254)) ([7b72b24](https://github.com/sbb-design-systems/sbb-angular/commit/7b72b2433a9b7f827d6265ae6eb1d204e0a5c06d))

## [13.8.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.7.0...13.8.0) (2022-03-03)


### Features

* **angular/autocomplete:** add the ability to auto-select the active option while navigating ([#1222](https://github.com/sbb-design-systems/sbb-angular/issues/1222)) ([67985d0](https://github.com/sbb-design-systems/sbb-angular/commit/67985d001c7ce1a29694d6c15ab6596896989781))
* **angular/icon:** allow multiple classes in setDefaultFontSetClass ([#1227](https://github.com/sbb-design-systems/sbb-angular/issues/1227)) ([c295170](https://github.com/sbb-design-systems/sbb-angular/commit/c295170a9af7c9fd5ced8a51e9689de2717293cd))
* **angular/menu:** allow for menu to be conditionally removed from trigger ([#1232](https://github.com/sbb-design-systems/sbb-angular/issues/1232)) ([020dd81](https://github.com/sbb-design-systems/sbb-angular/commit/020dd81b2fd7f9dd23280cbcc77e91246ca6b75f))
* **angular/schematics:** add option not to include animations module in ng-add ([#1226](https://github.com/sbb-design-systems/sbb-angular/issues/1226)) ([1796aab](https://github.com/sbb-design-systems/sbb-angular/commit/1796aab89ad7ed96a582602ef2a14b17ec7b4a09))
* **angular/schematics:** set lean test configuration on ng-update migrations ([#1243](https://github.com/sbb-design-systems/sbb-angular/issues/1243)) ([23f535b](https://github.com/sbb-design-systems/sbb-angular/commit/23f535bfa1f1e6306091f6b36156db3b18a64696))
* **showcase:** avoid 404s by only loading available example files ([#1213](https://github.com/sbb-design-systems/sbb-angular/issues/1213)) ([06e81ce](https://github.com/sbb-design-systems/sbb-angular/commit/06e81cecc24eec81fd1f3b4f8228030d4f22b38e))


### Bug Fixes

* **angular/accordion:** fix import path of expansion panel base ([#1244](https://github.com/sbb-design-systems/sbb-angular/issues/1244)) ([c1048e3](https://github.com/sbb-design-systems/sbb-angular/commit/c1048e310434857e3ad0c12739476617c2fc5edc))
* **angular/accordion:** picking up lazy content from child component ([#1235](https://github.com/sbb-design-systems/sbb-angular/issues/1235)) ([45ae537](https://github.com/sbb-design-systems/sbb-angular/commit/45ae5370e846eae38be991fa4c6060e599c68472))
* **angular/autocomplete:** reopen panel on input click ([#1221](https://github.com/sbb-design-systems/sbb-angular/issues/1221)) ([acdc9fa](https://github.com/sbb-design-systems/sbb-angular/commit/acdc9faf53aca499ad000a3bc70fc86d6b4e5bdc))
* **angular/chips:** allow for role to be overwritten on chip list and chip ([#1247](https://github.com/sbb-design-systems/sbb-angular/issues/1247)) ([265536f](https://github.com/sbb-design-systems/sbb-angular/commit/265536fde72985e6f1c4a8e1a263748729e6b19c))
* **angular/datepicker:** use aria-live over cdkAriaLive on period button ([#1236](https://github.com/sbb-design-systems/sbb-angular/issues/1236)) ([e1dd601](https://github.com/sbb-design-systems/sbb-angular/commit/e1dd601b684df21009f91ab6799057aaf6dd5808))
* **angular/dialog:** use passed in ComponentFactoryResolver to resolve dialog content ([#1237](https://github.com/sbb-design-systems/sbb-angular/issues/1237)) ([0c58ea8](https://github.com/sbb-design-systems/sbb-angular/commit/0c58ea848d05cf9edff8ccef0190921cc579ed78))
* **angular/i18n:** fix translations not used on production ([#1228](https://github.com/sbb-design-systems/sbb-angular/issues/1228)) ([da3e380](https://github.com/sbb-design-systems/sbb-angular/commit/da3e38065c8871f1d9c374507b4fce95e5f6f44d))
* **angular/menu:** focus lost if active item is removed ([#1234](https://github.com/sbb-design-systems/sbb-angular/issues/1234)) ([c83f5ea](https://github.com/sbb-design-systems/sbb-angular/commit/c83f5ea6af082eba2715c77add31c24b100ed1d1))
* **angular/menu:** use narrower value for aria-haspopup on trigger element ([#1233](https://github.com/sbb-design-systems/sbb-angular/issues/1233)) ([f668c7f](https://github.com/sbb-design-systems/sbb-angular/commit/f668c7f42eeff70b291471b7bc3f66cf60eea443))
* **angular/table:** remove role from sort header when disabled ([#1218](https://github.com/sbb-design-systems/sbb-angular/issues/1218)) ([6ab669e](https://github.com/sbb-design-systems/sbb-angular/commit/6ab669e29ace5dffae2f245f87698484b958e745))
* **angular/tooltip:** don't hide when pointer moves to tooltip ([#1225](https://github.com/sbb-design-systems/sbb-angular/issues/1225)) ([6c9c5c9](https://github.com/sbb-design-systems/sbb-angular/commit/6c9c5c98778b50d19512aa18931969ff932ec10d))
* **deps:** update dependency @stackblitz/sdk to v1.6.0 ([#1241](https://github.com/sbb-design-systems/sbb-angular/issues/1241)) ([015fb5c](https://github.com/sbb-design-systems/sbb-angular/commit/015fb5c293845963f577db5489cca8e39987be72))

## [13.7.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.6.0...13.7.0) (2022-02-24)


### Features

* **angular/header-lean:** align icons in app-chooser-section ([#1189](https://github.com/sbb-design-systems/sbb-angular/issues/1189)) ([116b932](https://github.com/sbb-design-systems/sbb-angular/commit/116b9329187ce7978b1b565fef23152df9c8a7df))
* **angular/lightbox:** allow aria-label of close button to customize ([#1176](https://github.com/sbb-design-systems/sbb-angular/issues/1176)) ([1dff68d](https://github.com/sbb-design-systems/sbb-angular/commit/1dff68d60dd482d979f9ed8f9d82c17f22692d80))
* **angular/table:** default arrow position in SbbSortDefaultOptions ([#1171](https://github.com/sbb-design-systems/sbb-angular/issues/1171)) ([2472c81](https://github.com/sbb-design-systems/sbb-angular/commit/2472c811852093fdd9e2d7fa71a2d6efe3b92f99))


### Bug Fixes

* **angular/autocomplete:** closing immediately when input is focused programmatically ([#1208](https://github.com/sbb-design-systems/sbb-angular/issues/1208)) ([ef69ea7](https://github.com/sbb-design-systems/sbb-angular/commit/ef69ea77e885b363b26ac08d8892804fdf6cee8a))
* **angular/autocomplete:** don't block default arrow keys when using modifiers ([#1211](https://github.com/sbb-design-systems/sbb-angular/issues/1211)) ([8437161](https://github.com/sbb-design-systems/sbb-angular/commit/843716165b6947b892d0e5d267ceb46d96f254fd))
* **angular/autocomplete:** use narrow value for aria-haspopup ([#1205](https://github.com/sbb-design-systems/sbb-angular/issues/1205)) ([d38ce18](https://github.com/sbb-design-systems/sbb-angular/commit/d38ce1884c101708ececb028ab45eaed1b5b2ee9))
* **angular/checkbox:** clear static aria attributes from host nodes ([#1210](https://github.com/sbb-design-systems/sbb-angular/issues/1210)) ([a2a4a8c](https://github.com/sbb-design-systems/sbb-angular/commit/a2a4a8c06c450d678c92d5c6b5cb620c4b2934d3))
* **angular/radio-button:** clicks not propagating to wrapper elements ([#1178](https://github.com/sbb-design-systems/sbb-angular/issues/1178)) ([03296ad](https://github.com/sbb-design-systems/sbb-angular/commit/03296adf1ac08d5bbc4d67f671433da0f2937f82)), closes [#1172](https://github.com/sbb-design-systems/sbb-angular/issues/1172)
* **angular/radio-button:** not checked on first click if partially visible ([#1172](https://github.com/sbb-design-systems/sbb-angular/issues/1172)) ([ff2827a](https://github.com/sbb-design-systems/sbb-angular/commit/ff2827ac2006ca2f77f418a7c645d8c6bf103eab))
* **angular/sidebar:** fix translations of collapse and expand ([#1164](https://github.com/sbb-design-systems/sbb-angular/issues/1164)) ([7a99505](https://github.com/sbb-design-systems/sbb-angular/commit/7a99505af19e856fcb8f4801c3c98406ac37acb5)), closes [#1160](https://github.com/sbb-design-systems/sbb-angular/issues/1160)
* **angular/sidebar:** prevent focus from entering hidden sidenav if child element has a visibility ([#1209](https://github.com/sbb-design-systems/sbb-angular/issues/1209)) ([56fc92b](https://github.com/sbb-design-systems/sbb-angular/commit/56fc92b00cf76ef1083e92f9742ee0b96ac88cda)), closes [angular/angular#44990](https://github.com/angular/angular/issues/44990)
* **angular/table:** don't override definitions of non .sbb-table tables ([eda3d96](https://github.com/sbb-design-systems/sbb-angular/commit/eda3d9612479ad58d6f24c0e88c9ca8d3372d328))


### Documentation

* add note to clear angular cache on how to update guide ([#1180](https://github.com/sbb-design-systems/sbb-angular/issues/1180)) ([c470be3](https://github.com/sbb-design-systems/sbb-angular/commit/c470be3d79bc7faea8a0739df0082d4362306a67))
* **angular/lightbox:** remove obsolete button alignment infos ([#1177](https://github.com/sbb-design-systems/sbb-angular/issues/1177)) ([a979cbe](https://github.com/sbb-design-systems/sbb-angular/commit/a979cbe4c519570dda0d4ec8a349aa6498d48af5))

## [13.6.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.5.0...13.6.0) (2022-02-17)


### Features

* **angular/table:** allow hover action buttons ([#1140](https://github.com/sbb-design-systems/sbb-angular/issues/1140)) ([4e6c97e](https://github.com/sbb-design-systems/sbb-angular/commit/4e6c97e9c01c7eaae945f9f21423572b46ad77f7))


### Bug Fixes

* **angular/chips:** update chip-list describedby to match input ([#1137](https://github.com/sbb-design-systems/sbb-angular/issues/1137)) ([76a158c](https://github.com/sbb-design-systems/sbb-angular/commit/76a158caf92599b0b224f1faa29c8cc1b21e28ee))
* **angular/datepicker:** update active date on focusing a calendar cell ([#1118](https://github.com/sbb-design-systems/sbb-angular/issues/1118)) ([0b76d1d](https://github.com/sbb-design-systems/sbb-angular/commit/0b76d1d6d98a43c9ea8241a48680c6ee1aab6328))
* **angular/dialog:** ensure close button is always displayed ([#1123](https://github.com/sbb-design-systems/sbb-angular/issues/1123)) ([ed35c0b](https://github.com/sbb-design-systems/sbb-angular/commit/ed35c0bccbaaffc2029fa13e75dfc3157f4a6ce2))
* **angular/dialog:** use `align` as `@Input()` in `SbbDialogActions` ([#1138](https://github.com/sbb-design-systems/sbb-angular/issues/1138)) ([933f194](https://github.com/sbb-design-systems/sbb-angular/commit/933f1946599b6c0b889758fe079729ddc1cc405b))
* **angular/form-field:** allow sbb-error styling to be used outside form-field ([#1131](https://github.com/sbb-design-systems/sbb-angular/issues/1131)) ([1faa6d2](https://github.com/sbb-design-systems/sbb-angular/commit/1faa6d265f06a9a884f6eed6f195904dfe5dfb89))
* **angular/lightbox:** fix aria-label on close button ([#1153](https://github.com/sbb-design-systems/sbb-angular/issues/1153)) ([5d2c518](https://github.com/sbb-design-systems/sbb-angular/commit/5d2c51841477a1b5c3d841bbafa68e690a53a91d)), closes [#1152](https://github.com/sbb-design-systems/sbb-angular/issues/1152)
* **angular/lightbox:** hide scrollbar from scroll lock container ([#1142](https://github.com/sbb-design-systems/sbb-angular/issues/1142)) ([72e2661](https://github.com/sbb-design-systems/sbb-angular/commit/72e2661f0b272b637a7ef4f09a875147861e2568)), closes [#1139](https://github.com/sbb-design-systems/sbb-angular/issues/1139)
* **angular/menu:** fix panel corner radius of contextmenu ([#1127](https://github.com/sbb-design-systems/sbb-angular/issues/1127)) ([2e6ab6b](https://github.com/sbb-design-systems/sbb-angular/commit/2e6ab6ba49ec97a1ba35ccf41d616f1ecce1ff20))
* **angular/menu:** position classes not updated when window is resized ([#1136](https://github.com/sbb-design-systems/sbb-angular/issues/1136)) ([3430961](https://github.com/sbb-design-systems/sbb-angular/commit/343096184d0577eb97a0341492d81662c90b5fd2))
* **angular/schematics:** include lean test environment configuration in ngAdd command ([#1133](https://github.com/sbb-design-systems/sbb-angular/issues/1133)) ([c294e6b](https://github.com/sbb-design-systems/sbb-angular/commit/c294e6b56867a8b2c8cf1cd8b101328a3017befa))
* **angular/table:** fix button styles inside table ([#1128](https://github.com/sbb-design-systems/sbb-angular/issues/1128)) ([10e8d3b](https://github.com/sbb-design-systems/sbb-angular/commit/10e8d3b0d6a4c038aa61ff5790c5022f80b4b6f8))
* **angular/table:** fix line-height of standard design variant ([#1129](https://github.com/sbb-design-systems/sbb-angular/issues/1129)) ([f0c68b9](https://github.com/sbb-design-systems/sbb-angular/commit/f0c68b9e8f649e263731c5ab90797638e36ae5df))
* **angular/toggle:** fix toggle animation ([#1122](https://github.com/sbb-design-systems/sbb-angular/issues/1122)) ([100f143](https://github.com/sbb-design-systems/sbb-angular/commit/100f143e21b8d4fdd5b4d1e97258d9b823d3f52d)), closes [#652](https://github.com/sbb-design-systems/sbb-angular/issues/652)
* **angular/toggle:** remove aria-expanded for role "radio" ([#1013](https://github.com/sbb-design-systems/sbb-angular/issues/1013)) ([c4fce88](https://github.com/sbb-design-systems/sbb-angular/commit/c4fce88946626bfe8495e974a7b94bd42c005005))


### Documentation

* **angular/loading:** remove deprecated fullscreen mode docs ([#1132](https://github.com/sbb-design-systems/sbb-angular/issues/1132)) ([d6fe546](https://github.com/sbb-design-systems/sbb-angular/commit/d6fe546f74db10930552187fad3846e32f5eaaae))
* **angular/notification:** fix use `warn` instead of `warning` ([#1126](https://github.com/sbb-design-systems/sbb-angular/issues/1126)) ([85bddd9](https://github.com/sbb-design-systems/sbb-angular/commit/85bddd94a608e8690a49dccb9f16d105a5fb9d13))
* **angular/tabs:** update tabs keyboard interaction docs ([#1134](https://github.com/sbb-design-systems/sbb-angular/issues/1134)) ([0023231](https://github.com/sbb-design-systems/sbb-angular/commit/0023231be56f3c26164b5525456a4593b064e9e7))

## [13.5.0](https://github.com/sbb-design-systems/sbb-angular/compare/13.4.0...13.5.0) (2022-02-09)


### Features

* **angular/datepicker:** allow hiding toggle with notoggle attribute ([#1121](https://github.com/sbb-design-systems/sbb-angular/issues/1121)) ([8ca3b13](https://github.com/sbb-design-systems/sbb-angular/commit/8ca3b1376dd80e27e7016029c2e6151efa67cfc9))
* **angular/tabs:** introduce options to set animationDuration ([#1115](https://github.com/sbb-design-systems/sbb-angular/issues/1115)) ([5f48329](https://github.com/sbb-design-systems/sbb-angular/commit/5f483292c180f05835982110bbf4e5413e2f7d8f))


### Bug Fixes

* **angular/datepicker:** change calendar cells to buttons ([#1105](https://github.com/sbb-design-systems/sbb-angular/issues/1105)) ([fedd564](https://github.com/sbb-design-systems/sbb-angular/commit/fedd56441f1604ef1e1bb78ca10c4f960b451b7d)), closes [angular/components#23476](https://github.com/angular/components/issues/23476)
* **angular/datepicker:** fix improper focus trapping with VoiceOver and ChromeVox ([#1120](https://github.com/sbb-design-systems/sbb-angular/issues/1120)) ([914a7a1](https://github.com/sbb-design-systems/sbb-angular/commit/914a7a1cccffb2cb8357e245238d61fe99a1c510))
* **angular/lightbox:** fix height of empty lightbox and dialog titles ([#1107](https://github.com/sbb-design-systems/sbb-angular/issues/1107)) ([6e879dd](https://github.com/sbb-design-systems/sbb-angular/commit/6e879dd8cb7fe46522d6a1c60c420cf83a470538))
* **angular/loading:** add sanity check for mode and deprecate fullscreen mode ([#1116](https://github.com/sbb-design-systems/sbb-angular/issues/1116)) ([6aa5f5a](https://github.com/sbb-design-systems/sbb-angular/commit/6aa5f5a834f2d650531608313a4012ff12f4284e))
* **angular/select:** fix positioning inside sbb-form-field ([#1109](https://github.com/sbb-design-systems/sbb-angular/issues/1109)) ([dd36350](https://github.com/sbb-design-systems/sbb-angular/commit/dd363504d1510f7a3b557be6c7c749f3594b855c))
* **angular/styles:** vertically align links in fluid texts and lists correctly ([#1117](https://github.com/sbb-design-systems/sbb-angular/issues/1117)) ([6f04be4](https://github.com/sbb-design-systems/sbb-angular/commit/6f04be4bd4dd1e4fd7e10feb1fc5b9d6d3eb9a2b))
* **angular:** allow coercing of booleans for all inputs ([#1114](https://github.com/sbb-design-systems/sbb-angular/issues/1114)) ([817853f](https://github.com/sbb-design-systems/sbb-angular/commit/817853fe8a1969eb7df71ff31872508214c59c69))
* **angular:** fix migration for typescript versions smaller or equals 4.4 ([#1110](https://github.com/sbb-design-systems/sbb-angular/issues/1110)) ([b15c207](https://github.com/sbb-design-systems/sbb-angular/commit/b15c207d36ae6492cacef9318e08af76415b9321))


### Documentation

* **angular/datepicker:** add documentation for timezone/JSON date handling ([#1119](https://github.com/sbb-design-systems/sbb-angular/issues/1119)) ([3e9f484](https://github.com/sbb-design-systems/sbb-angular/commit/3e9f48413c04e7a7814bbe02b2471abc560a3bd2))

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
