# Merge Migration

The aim of the merge migration is to migrate all modules from `@sbb-esta/angular-core`,
`@sbb-esta/angular-business` and `@sbb-esta/angular-public` to `@sbb-esta/angular`.

In order to cleanly migrate, the SCSS code has to be refactored for each module.

See also our [migration issue](https://github.com/sbb-design-systems/sbb-angular/issues/684).

## Steps

Don't forget to run `yarn generate:bazel` after each step.

1. Copy module from `src/angular-business` or `src/angular-public` to `src/angular`. If both a business and a public variant exist, use the more tolerant variant.
2. Where a template or visual difference is necessary, extend the component/directive class with the variant mixin (`mixinVariant`). See [Variant Mixin](#mixinVariant).
3. Refactor scss code according to [CODING_STANDARDS](./CODING_STANDARDS.md). Also see [SCSS Rules](#scssRules).
4. Update symbols for automatic merge migration by applying following command: `yarn generate:merge-symbols`.
5. Check documentation (\*.md) for any required changes.
6. Migrate examples from showcase to src/components-examples, by running the following command: `yarn migrate:example --module name-of-module`.
   Remove any CSS classes in the html template that are not part of the component or typography (e.g. remove `sbbsc-` CSS classes)
7. Check for usages of the component in src/showcase-merge, src/components-examples and src/angular and change them to the migrated one
8. Add a test in src/angular/schematics/ng-add/test-cases/merge and run them by `yarn test src/angular/schematics`
9. Provide an automatic migration (src/angular/schematics/ng-add) for complex changes.

## Start Showcase Merge

`yarn start:devserver:dev-app`

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

  // If this component/directive has its own ngOnInit, it must call super.ngOnInit()
  // e.g.
  ngOnInit() {
    super.ngOnInit();
    ...
  }

  // If this component/directive has its own ngOnDestroy, it must call super.ngOnDestroy()
  // e.g.
  ngOnDestroy() {
    super.ngOnDestroy();
    ...
  }
}
```

## <a name="scssRules"></a> SCSS Rules

- Use `encapsulation: ViewEncapsulation.None`
- Add CSS classes where necessary
- See [Form Field SCSS](https://github.com/sbb-design-systems/sbb-angular/blob/master/src/angular-public/form-field/form-field.scss) for reference
- Replace `@include publicOnly() {` with `&.sbb-standard` on the host selector or `.sbb-example.sbb-standard & {` on nested element selectors,
  `@include businessOnly() {` with `&.sbb-lean` on the host selector or `.sbb-example.sbb-lean & {` on nested element selectors
  and `if ($sbbBusiness) {` or `if($sbbBusiness, ..., ...)` similar to the previous two,
  where `.sbb-example` corresponds to the host element selector.

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

    &.sbb-lean {
      width: pxToRem(230); /* business/lean */
    }
  }

  // Nested element selector
  .sbb-example-section {
    .sbb-example.sbb-standard {
      padding-top: pxToRem(30);

      @include mq($from: desktop4k) {
        padding-top: pxToRem(40);
      }
      @include mq($from: desktop5k) {
        padding-top: pxToRem(50);
      }
    }
    .sbb-example.sbb-lean {
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

    &.sbb-lean {
      width: pxToRem(230); /* business/lean */
    }
  }
  ```

- Note that mediaqueries for 4k and 5k (`@include mq($from: desktop4k) { ... }` or `@include mq($from: desktop5k) { ... }`)
  should always be contained in `&.sbb-standard {` or `.sbb-example.sbb-standard & {`
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

  &.sbb-standard {
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

  .sbb-example.sbb-standard & {
    // Standard specific rules
  }

  .sbb-example.sbb-lean & {
    // Lean specific rules
  }
}
```
