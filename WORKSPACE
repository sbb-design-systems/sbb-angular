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
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "94070eff79305be05b7699207fbac5d2608054dd53e6109f7d00d923919ff45a",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.8.2/rules_nodejs-5.8.2.tar.gz"],
)

# Add sass rules
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "4b6153ae6c454c5bd44f3e47e5430f8a634d4affb983a237d21ca6199e13991c",
    strip_prefix = "rules_sass-1.50.1",
    urls = [
        "https://github.com/bazelbuild/rules_sass/archive/1.50.1.zip",
    ],
)

# Add skylib which contains common Bazel utilities. Note that `rules_nodejs` would also
# bring in the skylib repository but with an older version that does not support shorthands
# for declaring Bazel build setting flags.
http_archive(
    name = "bazel_skylib",
    sha256 = "a9c5d3a22461ed7063aa7b088f9c96fa0aaaa8b6984b601f84d705adc47d8a58",
    strip_prefix = "bazel-skylib-8334f938c1574ef6f1f7a38a03550a31df65274e",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/archive/8334f938c1574ef6f1f7a38a03550a31df65274e.tar.gz",
    ],
)

http_archive(
    name = "rules_pkg",
    sha256 = "a89e203d3cf264e564fcb96b6e06dd70bc0557356eb48400ce4b5d97c2c3720d",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_pkg/releases/download/0.5.1/rules_pkg-0.5.1.tar.gz",
        "https://github.com/bazelbuild/rules_pkg/releases/download/0.5.1/rules_pkg-0.5.1.tar.gz",
    ],
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@rules_nodejs//nodejs:repositories.bzl", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_repositories = {
        "22.0.0-darwin_arm64": ("node-v22.0.0-darwin-arm64.tar.gz", "node-v22.0.0-darwin-arm64", "ea96d349cfaa67aa87ceeaa3e5b52c9167f7ac302fd8d1ff162d0785e9dc0785"),
        "22.0.0-darwin_amd64": ("node-v22.0.0-darwin-x64.tar.gz", "node-v22.0.0-darwin-x64", "422a3887ff5418f0a4552d89cf99346ab8ab51bb5d384660baa88b8444d2c111"),
        "22.0.0-linux_arm64": ("node-v22.0.0-linux-arm64.tar.xz", "node-v22.0.0-linux-arm64", "83711d29cbe46375bdffab5419f3d831892e24294169272f6c39edc364556241"),
        "22.0.0-linux_ppc64le": ("node-v22.0.0-linux-ppc64le.tar.xz", "node-v22.0.0-linux-ppc64le", "2b3fb8707a79243bfb3131312b86716ddc3855bce21bb168095b6b916798e5e9"),
        "22.0.0-linux_s390x": ("node-v22.0.0-linux-s390x.tar.xz", "node-v22.0.0-linux-s390x", "89a8efeeb9f94ce9ea251b8109e079c14919f4c0dc2cbc9f545ec47ef0886737"),
        "22.0.0-linux_amd64": ("node-v22.0.0-linux-x64.tar.xz", "node-v22.0.0-linux-x64", "9122e50f2642afd5f6078cafd1f52ede60fc464284384f05c18a04d13d07ae5a"),
        "22.0.0-windows_amd64": ("node-v22.0.0-win-x64.zip", "node-v22.0.0-win-x64", "32d639b47d4c0a651ff8f8d7d41a454168a3d4045be37985f9a810cf8cef6174"),
    },
    node_version = "22.0.0",
)

load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

yarn_install(
    name = "npm",
    # We add the postinstall patches file here so that Yarn will rerun whenever
    # the file is modified.
    data = [
        "//:.yarn/releases/yarn-1.22.22.cjs",
        "//:.yarnrc",
        "//:tools/postinstall/apply-patches.js",
        "//:tools/postinstall/patches/@angular+bazel+16.0.0-next.6.patch",
    ],
    # Currently disabled due to:
    #  1. Missing Windows support currently.
    #  2. Incompatibilites with the `ts_library` rule.
    exports_directories_only = False,
    package_json = "//:package.json",
    quiet = False,
    # We prefer to symlink the `node_modules` to only maintain a single install.
    # See https://github.com/angular/dev-infra/pull/446#issuecomment-1059820287 for details.
    symlink_node_modules = True,
    yarn = "//:.yarn/releases/yarn-1.22.22.cjs",
    yarn_lock = "//:yarn.lock",
)

load("@npm//@bazel/protractor:package.bzl", "npm_bazel_protractor_dependencies")

npm_bazel_protractor_dependencies()

# Setup web testing. We need to setup a browser because the web testing rules for TypeScript need
# a reference to a registered browser (ideally that's a hermetic version of a browser)
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

# Setup the Sass rule repositories.
load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")

sass_repositories(
    yarn_script = "//:.yarn/releases/yarn-1.22.22.cjs",
)

# Setup repositories for browsers provided by the shared dev-infra package.
load(
    "@npm//@angular/build-tooling/bazel/browsers:browser_repositories.bzl",
    _dev_infra_browser_repositories = "browser_repositories",
)

_dev_infra_browser_repositories()

load("@build_bazel_rules_nodejs//toolchains/esbuild:esbuild_repositories.bzl", "esbuild_repositories")

esbuild_repositories(
    npm_repository = "npm",
)
