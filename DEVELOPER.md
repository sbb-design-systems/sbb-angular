# Developer guide: getting your environment set up

Make sure you have both `node` and `pnpm` installed. We recommend using `nvm` to manage your node versions.

## Windows

sbb-angular uses Bazel which requires certain Bash and UNIX tools.
On Windows we recommend using WSL2. Please make sure firefox and google-chrome-stable is installed inside WSL.
Otherwise you might encounter `wslpath` errors when running tests.

On Windows on SBB Managed Devices: Follow the guide to install on windows below,
but install MSYS2 to `C:\devsbb\msys64` and add `.bazelrc` to your user directory (`C:\Users\{user}\.bazelrc`) with the following content:

```
startup --output_user_root=C:/devsbb/bazel/out
build --repository_cache=C:/devsbb/bazel/cache
```

Follow the [instructions](https://docs.bazel.build/versions/master/install-windows.html#step-5-optional-install-compilers-and-language-runtimes)
to install [`MSYS2`](https://www.msys2.org/) and the listed "Common MSYS2 packages". Afterwards add `C:\msys64\usr\bin` to the `PATH` environment variable.

## macOS

sbb-angular uses Bazel which requires certain Bash and UNIX tools.
On macOS: Create .bazelrc file in your home directory and add `test --experimental_inprocess_symlink_creation` and `build --experimental_inprocess_symlink_creation` on a second line.
This avoids errors with Chromium as it currently contains spaces in the filename.

### devcontainer

Since version 21 of this library, hot reloading is not working anymore on macOS due to Bazel updates.
To address this, we provide a devcontainer setup for a consistent development environment.
For troubleshooting or customization, see `.devcontainer/Dockerfile` and `.devcontainer/devcontainer.json`.

The devcontainer setup on macOS is tested with `Rancher Desktop`. To use it, make sure to use the "VZ" Virtual Machine Type and have Rosetta support enabled.
You can find these settings under "Preferences" -> "Virtual Machine" -> "Emulation" (Tab).

**Known Issues:**

- Sometimes the build process stops with the question "Would you like to share pseudonymous usage data about this project with the Angular Team ..." and does not continue after answering.
  In this case, you can set the environment variable `NG_CLI_ANALYTICS=ci` to avoid the prompt.

## Starting the project

From the root of the project, run `pnpm` to install the dependencies.

To build sbb-angular in release mode, run `pnpm build packages`. The output can be found under `dist/releases`.

To bring up a local server, run `pnpm start`. This will automatically watch for changes and rebuild. The browser should refresh automatically when changes are made.

## Bazel

[Bazel](https://www.bazel.build/) is a build system. It allows incremental builds by caching build artifacts.

To install bazel globally, we recommend installing it with `pnpm global add @bazel/bazelisk`, after
following the steps above. This will add `bazel` and `bazelisk` to the global path.
(`bazelisk` will check the version in `.bazelversion` and use the appropriate bazel version.)

- [Bazel Concepts](https://docs.bazel.build/versions/master/build-ref.html)
- [Bazel CLI](https://docs.bazel.build/versions/master/command-line-reference.html)
- [Bazel JavaScript Rules](https://bazelbuild.github.io/rules_nodejs/index.html)

### Generate Bazel files

In order to automatically generate BUILD.bazel files, we implemented a schematic.
You can run it with `pnpm generate:bazel`.

## Running tests

To run unit tests, run `pnpm test <target>`. The `target` can be either a short name (e.g. `pnpm test button`) or an explicit path `pnpm test src/angular/menu`.
You can also directly use bazel: `bazel test src/...` (to test everything) or `bazel test src/angular/...`
(e.g. to test the angular package) or `bazel test src/angular/button:unit_tests` (e.g. to test the button module).

To run lint, run `pnpm lint`.

## Starting docs

To start the docs application, run:

```
pnpm start
```

This will run the devserver in watch mode. It might ask you to allow opening an outgoing port, which would allow you to open the page on another machine in the same network.

To be able to display the map inside the `journey-maps` examples, you need to provide the API key as well:

```
JM_API_KEY=<YOUR-API-KEY> pnpm start
```
