# Merge Migration

The aim of the merge migration is to migrate all modules from `@sbb-esta/angular-core`,
`@sbb-esta/angular-business` and `@sbb-esta/angular-public` to `@sbb-esta/angular`.

In order to cleanly migrate, the SCSS code has to be refactored for each module.

See also our [migration issue](https://github.com/sbb-design-systems/sbb-angular/issues/684).

## Steps

1. Copy module from `src/angular-business` or `src/angular-public` to `src/angular`. If both a business and a public variant exist, use the more tolerant variant.
2. Where a template or visual difference is necessary, extend the component/directive class with the variant mixin (`mixinVariant`). See [Variant Mixin](#mixinVariant).
3. Refactor scss code according to [CODING_STANDARDS](./CODING_STANDARDS.md). Also see [SCSS Rules](#scssRules).
4. Update symbols for automatic merge migration by applying following command: `yarn generate:merge-symbols`.
5. Check documentation (\*.md) for any required changes.
6. Migrate examples from showcase to src/components-examples.
7. Check for usages of the component in src/showcase-merge, src/components-examples in src/angular and change them to the migrated one
8. Provide an automatic migration (src/angular/schematics/ng-add) for complex changes.

Don't forget to run `yarn generate:bazel` after each step.

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
}
```

## <a name="scssRules"></a> SCSS Rules

- Use `encapsulation: ViewEncapsulation.None`
- Add CSS classes where necessary
- See [Form Field SCSS](https://github.com/sbb-design-systems/sbb-angular/blob/master/src/angular-public/form-field/form-field.scss) for reference

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

  .sbb-example.sbb-website & {
    // Website specific rules
  }

  .sbb-example.sbb-webapp & {
    // Webapp specific rules
  }
}
```
