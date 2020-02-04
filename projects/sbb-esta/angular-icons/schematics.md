# Schematics

The `@sbb-esta/angular-icons` package provides schematics to generate icon modules from svg files.
Each schematic provides a schema, which can be seen by using the `--help` command: `ng generate @sbb-esta/angular-icons:command --help`

## svg-registry

Generates a registry file from available svg files.

`ng generate @sbb-esta/angular-icons:svg-registry`

| Option             | Description                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| --svg-dir          | The directory of the svg files.                                               |
| --strip-number-ids | Whether the number ids in the file names should be stripped for the selector. |

## svg-icons

Generates icon modules from a svg registry file.

`ng generate @sbb-esta/angular-icons:svg-icons`

| Option         | Description                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------- |
| --project      | The name of the project.                                                                     |
| --svg-registry | The path to the svg registry file.                                                           |
| --target-dir   | The directory into which the icons will be generated, relative to projects.\[project\].root. |
