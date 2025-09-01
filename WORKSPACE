# Before making any changes, please read Bazel documentation.
# https://docs.bazel.build/versions/master/be/workspace.html
# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(
    name = "sbb_angular",
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "709cc0dcb51cf9028dd57c268066e5bc8f03a119ded410a13b5c3925d6e43c48",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.8.4/rules_nodejs-5.8.4.tar.gz"],
)

# Add skylib which contains common Bazel utilities.
http_archive(
    name = "bazel_skylib",
    sha256 = "bed16a10c419c59825b8453404bbb311258caaf154e6fe91a78ad9470fe57893",
    strip_prefix = "bazel-skylib-471f368fc95a7323078f69d569a164ee5bc07f8b",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/archive/471f368fc95a7323078f69d569a164ee5bc07f8b.tar.gz",
    ],
)

http_archive(
    name = "rules_pkg",
    sha256 = "a3eba00a4bae8ae3468e6c2b1e7554c366a2c7b335d9171f783ed4fc5645c87d",
    strip_prefix = "rules_pkg-8c7c2cf7f1742a1fb199d0164b800d2939fa9fef",
    urls = [
        "https://github.com/bazelbuild/rules_pkg/archive/8c7c2cf7f1742a1fb199d0164b800d2939fa9fef.tar.gz",
    ],
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

http_archive(
    name = "aspect_rules_js",
    sha256 = "3388abe9b9728ef68ea8d8301f932b11b2c9a271d74741ddd5f3b34d1db843ac",
    strip_prefix = "rules_js-2.1.1",
    url = "https://github.com/aspect-build/rules_js/releases/download/v2.1.1/rules_js-v2.1.1.tar.gz",
)

load("@aspect_rules_js//js:repositories.bzl", "rules_js_dependencies")

rules_js_dependencies()

load("@aspect_rules_js//js:toolchains.bzl", "rules_js_register_toolchains")

rules_js_register_toolchains(
    node_repositories = {
        "22.12.0-darwin_arm64": ("node-v22.12.0-darwin-arm64.tar.gz", "node-v22.12.0-darwin-arm64", "293dcc6c2408da21562d135b0412525e381bb6fe150d688edb58fe850d0f3e13"),
        "22.12.0-darwin_amd64": ("node-v22.12.0-darwin-x64.tar.gz", "node-v22.12.0-darwin-x64", "52bc25dd026db7247c3c00439afdb83e95087248267f02d6c1a7250d1f896173"),
        "22.12.0-linux_arm64": ("node-v22.12.0-linux-arm64.tar.xz", "node-v22.12.0-linux-arm64", "8cfd5a8b9afae5a2e0bd86b0148ca31d2589c0ea669c2d0b11c132e35d90ed68"),
        "22.12.0-linux_ppc64le": ("node-v22.12.0-linux-ppc64le.tar.xz", "node-v22.12.0-linux-ppc64le", "199a606ba1ee86cce6d6b369c71f9d00873d2836a6662592afc3b6a5923e2004"),
        "22.12.0-linux_s390x": ("node-v22.12.0-linux-s390x.tar.xz", "node-v22.12.0-linux-s390x", "9b517f8006eb4b451d40c461cbe64f93c6455566dbe2613387ab02412bc06d35"),
        "22.12.0-linux_amd64": ("node-v22.12.0-linux-x64.tar.xz", "node-v22.12.0-linux-x64", "22982235e1b71fa8850f82edd09cdae7e3f32df1764a9ec298c72d25ef2c164f"),
        "22.12.0-windows_amd64": ("node-v22.12.0-win-x64.zip", "node-v22.12.0-win-x64", "2b8f2256382f97ad51e29ff71f702961af466c4616393f767455501e6aece9b8"),
    },
    node_version = "22.12.0",
)

load("@aspect_rules_js//npm:repositories.bzl", "npm_translate_lock")

npm_translate_lock(
    name = "npm",
    custom_postinstalls = {
        "@angular/animations": "node ../../@nginfra/angular-linking/index.mjs",
        "@angular/cdk": "node ../../@nginfra/angular-linking/index.mjs",
        "@angular/common": "node ../../@nginfra/angular-linking/index.mjs",
        "@angular/forms": "node ../../@nginfra/angular-linking/index.mjs",
        "@angular/localize": "node ../../@nginfra/angular-linking/index.mjs",
        "@angular/platform-browser": "node ../../@nginfra/angular-linking/index.mjs",
        "@angular/platform-server": "node ../../@nginfra/angular-linking/index.mjs",
        "@angular/router": "node ../../@nginfra/angular-linking/index.mjs",
    },
    data = [
        "//:package.json",
        "//:pnpm-workspace.yaml",
        "//src/angular:package.json",
        "//src/angular-experimental:package.json",
        "//src/components-examples:package.json",
        "//src/journey-maps:package.json",
        "//src/journey-maps-wc:package.json",
    ],
    npmrc = "//:.npmrc",
    package_visibility = {
        "@sbb-esta/angular": [
            "//integration:__subpackages__",
            "//docs:__subpackages__",
            "//src/journey-maps-wc:__subpackages__",
        ],
        "@sbb-esta/angular-experimental": [
            "//integration:__subpackages__",
            "//docs:__subpackages__",
        ],
        "@sbb-esta/journey-maps": [
            "//integration:__subpackages__",
            "//docs:__subpackages__",
            "//src/journey-maps-wc:__subpackages__",
        ],
        "@sbb-esta/journey-maps-wc": [
            "//integration:__subpackages__",
            "//docs:__subpackages__",
        ],
    },
    pnpm_lock = "//:pnpm-lock.yaml",
    pnpm_version = "9.14.1",
    verify_node_modules_ignored = "//:.bazelignore",
)

load("@npm//:repositories.bzl", "npm_repositories")

npm_repositories()

http_archive(
    name = "aspect_rules_ts",
    sha256 = "9acd128abe77397505148eaa6895faed57839560dbf2177dd6285e51235e2724",
    strip_prefix = "rules_ts-3.3.1",
    url = "https://github.com/aspect-build/rules_ts/releases/download/v3.3.1/rules_ts-v3.3.1.tar.gz",
)

load("@aspect_rules_ts//ts:repositories.bzl", "rules_ts_dependencies")

rules_ts_dependencies(
    # Obtained by: curl --silent https://registry.npmjs.org/typescript/5.8.3 | jq -r '.dist.integrity'
    ts_integrity = "sha512-p1diW6TqL9L07nNxvRMM7hMMw4c5XOo/1ibL4aAIGmSAt9slTE1Xgw5KWuof2uTOvCg9BY7ZRi+GaF+7sfgPeQ==",
    ts_version_from = "//:package.json",
)

http_archive(
    name = "aspect_rules_rollup",
    sha256 = "0b8ac7d97cd660eb9a275600227e9c4268f5904cba962939d1a6ce9a0a059d2e",
    strip_prefix = "rules_rollup-2.0.1",
    url = "https://github.com/aspect-build/rules_rollup/releases/download/v2.0.1/rules_rollup-v2.0.1.tar.gz",
)

http_archive(
    name = "aspect_rules_jasmine",
    sha256 = "0d2f9c977842685895020cac721d8cc4f1b37aae15af46128cf619741dc61529",
    strip_prefix = "rules_jasmine-2.0.0",
    url = "https://github.com/aspect-build/rules_jasmine/releases/download/v2.0.0/rules_jasmine-v2.0.0.tar.gz",
)

load("@aspect_rules_jasmine//jasmine:dependencies.bzl", "rules_jasmine_dependencies")

rules_jasmine_dependencies()

load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

git_repository(
    name = "devinfra",
    commit = "90560ac34ffbb40189d98d8e54110e9c43575761",
    remote = "https://github.com/angular/dev-infra.git",
)

load("@devinfra//bazel:setup_dependencies_1.bzl", "setup_dependencies_1")

setup_dependencies_1()

load("@devinfra//bazel:setup_dependencies_2.bzl", "setup_dependencies_2")

setup_dependencies_2()

git_repository(
    name = "rules_angular",
    commit = "17eac47ea99057f7473a7d93292e76327c894ed9",
    remote = "https://github.com/devversion/rules_angular.git",
)

load("@rules_angular//setup:step_1.bzl", "rules_angular_step1")

rules_angular_step1()

load("@rules_angular//setup:step_2.bzl", "rules_angular_step2")

rules_angular_step2()

load("@rules_angular//setup:step_3.bzl", "rules_angular_step3")

rules_angular_step3(
    angular_compiler_cli = "//:node_modules/@angular/compiler-cli",
    typescript = "//:node_modules/typescript",
)

http_archive(
    name = "aspect_rules_esbuild",
    sha256 = "550e33ddeb86a564b22b2c5d3f84748c6639b1b2b71fae66bf362c33392cbed8",
    strip_prefix = "rules_esbuild-0.21.0",
    url = "https://github.com/aspect-build/rules_esbuild/releases/download/v0.21.0/rules_esbuild-v0.21.0.tar.gz",
)

load("@aspect_rules_esbuild//esbuild:dependencies.bzl", "rules_esbuild_dependencies")

rules_esbuild_dependencies()

load("@aspect_rules_esbuild//esbuild:repositories.bzl", "LATEST_ESBUILD_VERSION", "esbuild_register_toolchains")

esbuild_register_toolchains(
    name = "esbuild",
    esbuild_version = LATEST_ESBUILD_VERSION,
)

git_repository(
    name = "rules_browsers",
    commit = "671017c30c0a595d7d639f59c6985255e4b90e0a",
    remote = "https://github.com/devversion/rules_browsers.git",
)

load("@rules_browsers//setup:step_1.bzl", "rules_browsers_setup_1")

rules_browsers_setup_1()

load("@rules_browsers//setup:step_2.bzl", "rules_browsers_setup_2")

rules_browsers_setup_2()

git_repository(
    name = "rules_sass",
    commit = "3cd198e291caf21ba8f7105d53963dd3df62ef6d",
    remote = "https://github.com/devversion/rules_sass.git",
)

load("@rules_sass//src/toolchain:repositories.bzl", "setup_rules_sass")

setup_rules_sass()
