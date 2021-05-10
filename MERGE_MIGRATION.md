# Merge Migration

The aim of the merge migration is to migrate all modules from `@sbb-esta/angular-core`,
`@sbb-esta/angular-business` and `@sbb-esta/angular-public` to `@sbb-esta/angular`.

In order to cleanly migrate, the SCSS code has to be refactored for each module.

See also our [migration issue](https://github.com/sbb-design-systems/sbb-angular/issues/684).

## Steps

Don't forget to run `yarn generate:bazel` after each step.

1. Copy module from `src/angular-business` or `src/angular-public` to `src/angular`.
   If both a business and a public variant exist, use the more tolerant variant.
   Rename files with `*.component.*` pattern to `*.*` and update references (e.g. `autocomplete.component.ts` should become `autocomplete.ts`).
   You can use `ng g .:mergeMigrate --module module-name` to perform the initial copy and renaming.
   (This is a fairly basic implementation and will require manual checking effort.)
2. Remove deprecated code in the copied module.
3. Where a template or visual difference is necessary, extend the component/directive class with the variant mixin (`mixinVariant`). See [Variant Mixin](#mixinVariant).
4. Refactor scss code according to [CODING_STANDARDS](./CODING_STANDARDS.md). Also see [SCSS Rules](#scssRules).
5. Update symbols for automatic merge migration by applying following command: `yarn generate:merge-symbols`.
6. Check documentation (\*.md) for any required changes.
7. Migrate examples from showcase to src/components-examples, by running the following command: `yarn migrate:example --module name-of-module`.
   Sort examples according to the existing order on https://angular.app.sbb.ch by changing the `@order` number in example class docs.
   Remove any CSS classes in the html template that are not part of the component or typography (e.g. remove `sbbsc-` CSS classes)
   and replace them with alternatives (e.g. <p> tag oder css definition in example itself)
8. Check for usages of the component in src/showcase-merge, src/components-examples and src/angular and change them to the migrated one
9. Add a test in src/angular/schematics/ng-add/test-cases/merge and run them by `yarn test src/angular/schematics`
10. Provide an automatic migration (src/angular/schematics/ng-add) for complex changes.
11. Update migration guide (migration-guide.md).

## Start Showcase Merge

`yarn dev`

## <a name="mixinVariant"></a> Variant Mixin

### Original

```ts
@Component({
  selector: 'sbb-example',
  templateUrl: './example.html'
})
export class SbbExample {
  ...
}
```

### Adapted

```ts
// Boilerplate for applying mixins to SbbExample.
/** @docs-private */
class SbbExampleBase {
  constructor(public _elementRef: ElementRef) {}
}

// tslint:disable-next-line: naming-convention
const _SbbExampleMixinBase: HasVariantCtor & typeof SbbExampleBase = mixinVariant(SbbExampleBase);

@Component({
  selector: 'sbb-example',
  templateUrl: './example.html'
})
export class SbbExample extends _SbbExampleMixinBase {
  ...
}
```

## <a name="scssRules"></a> SCSS Rules

- Use `encapsulation: ViewEncapsulation.None`
- Add CSS classes where necessary
- See [Form Field SCSS](https://github.com/sbb-design-systems/sbb-angular/blob/master/src/angular-public/form-field/form-field.scss) for reference
- Replace `@include publicOnly() {` with `html:not(.sbb-lean) &`,
  `@include businessOnly() {` with `html.sbb-lean &`
  and `if ($sbbBusiness) {` or `if($sbbBusiness, ..., ...)` similar to the previous two

  e.g.

  ```scss
  // Host element selector
  .sbb-example {
    @if ($sbbBusiness) {
      width: pxToRem(230); /* business/lean */
    } @else {
      width: pxToRem(320); /* public/standard */
    }
  }

  // Nested element selector
  .sbb-example-section {
    @include publicOnly() {
      padding-top: pxToRem(30);

      @include mq($from: desktop4k) {
        padding-top: pxToRem(40);
      }
      @include mq($from: desktop5k) {
        padding-top: pxToRem(50);
      }
    }
    @include businessOnly() {
      padding-top: pxToRem(10);
    }
  }

  // replace with

  // Host element selector
  .sbb-example {
    width: pxToRem(320); /* public/standard */

    html.sbb-lean & {
      width: pxToRem(230); /* business/lean */
    }
  }

  // Nested element selector
  .sbb-example-section {
    padding-top: pxToRem(30);

    html:not(.sbb-lean) & {
      @include mq($from: desktop4k) {
        padding-top: pxToRem(40);
      }
      @include mq($from: desktop5k) {
        padding-top: pxToRem(50);
      }
    }
    html.sbb-lean & {
      padding-top: pxToRem(10);
    }
  }
  ```

  or

  ```scss
  .sbb-example {
    width: if($sbbBusiness, pxToRem(230) /* business/lean */, pxToRem(320) /* public/standard */);
  }

  // replace with

  .sbb-example {
    width: pxToRem(320); /* public/standard */

    html.sbb-lean & {
      width: pxToRem(230); /* business/lean */
    }
  }
  ```

- Note that mediaqueries for 4k and 5k (`@include mq($from: desktop4k) { ... }` or `@include mq($from: desktop5k) { ... }`)
  should always be contained in `html:not(.sbb-lean) & {`
  e.g.

  ```scss
  @include mq($from: desktop4k) {
    margin-bottom: pxToRem(5 * $scalingFactor4k);
    padding-left: pxToRem(10 * $scalingFactor4k);
  }

  @include mq($from: desktop5k) {
    margin-bottom: pxToRem(5 * $scalingFactor5k);
    padding-left: pxToRem(10 * $scalingFactor5k);
  }

  // replace with

  html:not(.sbb-lean) & {
    @include mq($from: desktop4k) {
      margin-bottom: pxToRem(5 * $scalingFactor4k);
      padding-left: pxToRem(10 * $scalingFactor4k);
    }

    @include mq($from: desktop5k) {
      margin-bottom: pxToRem(5 * $scalingFactor5k);
      padding-left: pxToRem(10 * $scalingFactor5k);
    }
  }
  ```

### Prefer flat rules

#### Avoid

```scss
.sbb-example {
  ...

  .sbb-example-button {
    ...

    .sbb-example-button-icon {
      ...
    }
  }
}
```

#### Prefer

```scss
.sbb-example {
  ...
}

.sbb-example-button {
  ...
}

.sbb-example-button-icon {
  ...
}
```

### Use inverted selectors for variants

```scss
.sbb-example-button-icon {
  // Generic rules

  html:not(.sbb-lean) & {
    // Standard specific rules
  }

  html.sbb-lean & {
    // Lean specific rules
  }
}
```
