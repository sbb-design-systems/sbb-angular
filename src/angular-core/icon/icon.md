`sbb-icon` makes it easy to use _vector-based_ icons in your app and is basically meant to use with sbb icons. This directive supports both
icon fonts and SVG icons, but not bitmap-based formats (png, jpg, etc.).

### Available Sbb Icons

See [Icon Overview](TODO)

## Usage

#### Simple usage from Icon CDN

In most use cases it is recommended to use the pre-registered icons as shown below.
The browser loads and caches the icons from the [SBB Icon CDN](https://icons.app.sbb.ch) at runtime.

1. Add `SBB_ICON_REGISTRY_PROVIDER` to your providers list of the AppModule (or any other NgModule you like).

   ```ts
   import { SBB_ICON_REGISTRY_PROVIDER } from '@sbb-esta/angular-core/icon';

   @NgModule({
     ...
     providers: [
       ...
       SBB_ICON_REGISTRY_PROVIDER
     ],
   })
   export class AppModule {
     ...
   }
   ```

2. Include `<sbb-icon>` in your template and add your icon name to the `svgIcon` attribute.

```html
<sbb-icon svgIcon="kom:cloud-small" aria-label="Cloudy weather" aria-hidden="false"></sbb-icon>
```

##### Decrease icon registry size

If you like to decrease the size of the icon registry, run `ng generate @sbb-esta/angular-core:icon-cdn-provider`
to create our own registry and remove all icons you don't need. Don't forget to include the registry in your AppModule's providers.

#### Self-Hosting

You can also self-host the CDN icons, by downloading the icons from the [SBB Icon CDN](https://icons.app.sbb.ch)
or from (https://github.com/sbb-design-systems/icon-library/tree/master/icons/svg) and adding them to your assets.
Instead of using our pre-defined `SBB_ICON_REGISTRY_PROVIDER` constant, you have to create your own registry provider and provider factory.
Run `ng generate @sbb-esta/angular-core:icon-cdn-provider` to create your own icon-cdn-provider and adapt the urls of the icon list.
Don't forget to include the registry in your AppModule's providers.

E.g. replace

```ts
... ['fpl', 'sa-1', 'https://icons.app.sbb.ch/fpl/sa-1.svg'], ...
```

by

```ts
... ['fpl', 'sa-1', '/assets/path/to/sa-1.svg'], ...
```

\*Make sure, that the namespace of 'fpl' remains, because these icons need a special handling regarding the styling.

#### Fit parent's element size

If you like to have the icon size fitted to your parent element size, then add the `sbb-icon-fit` css class to your `<sbb-icon>` tag.

```html
<sbb-icon svgIcon="kom:cloud-small" class="sbb-icon-fit"></sbb-icon>
```

## Accessibility

Similar to an `<img>` element, an icon alone does not convey any useful information for a
screen-reader user. The user of `<sbb-icon>` must provide additional information pertaining to how
the icon is used. Based on the use-cases described below, `sbb-icon` is marked as
`aria-hidden="true"` by default, but this can be overridden by adding `aria-hidden="false"` to the
element.

In thinking about accessibility, it is useful to place icon use into one of three categories:

1. **Decorative**: the icon conveys no real semantic meaning and is purely cosmetic.
2. **Interactive**: a user will click or otherwise interact with the icon to perform some action.
3. **Indicator**: the icon is not interactive, but it conveys some information, such as a status.
   This includes using the icon in place of text inside of a larger message.

#### Decorative icons

When the icon is purely cosmetic and conveys no real semantic meaning, the `<sbb-icon>` element
is marked with `aria-hidden="true"`.

#### Interactive icons

Icons alone are not interactive elements for screen-reader users; when the user would interact with
some icon on the page, a more appropriate element should "own" the interaction:

- The `<sbb-icon>` element should be a child of a `<button>` or `<a>` element.
- The parent `<button>` or `<a>` should either have a meaningful label provided either through
  direct text content, `aria-label`, or `aria-labelledby`.

#### Indicator icons

When the presence of an icon communicates some information to the user whether as an indicator or
by being inlined into a block of text, that information must also be made available to
screen-readers. The most straightforward way to do this is to

1. Add a `<span>` as an adjacent sibling to the `<sbb-icon>` element with text that conveys the same
   information as the icon.
2. Add the `cdk-visually-hidden` class to the `<span>`. This will make the message invisible
   on-screen but still available to screen-reader users.

## Use your own icons

`sbb-icon` is designed very neutral and therefore allows you to use it with your own icons.

### Registering icons

`SbbIconRegistry` is an injectable service that allows you to associate icon names with SVG URLs,
HTML strings and to define aliases for CSS font classes. Its methods are discussed below and listed
in the API summary.

#### Named icons

To associate a name with an icon URL, use the `addSvgIcon`, `addSvgIconInNamespace`,
`addSvgIconLiteral` or `addSvgIconLiteralInNamespace` methods of `SbbIconRegistry`. After
registering an icon, it can be displayed by setting the `svgIcon` input. For an icon in the
default namespace, use the name directly. For a non-default namespace, use the format
`[namespace]:[name]`.

### SVG icons

`<sbb-icon>` displays SVG icons by directly inlining the SVG content into the DOM
as a child of itself. This approach offers an advantage over an `<img>` tag or a CSS
`background-image` because it allows styling the SVG with CSS. For example, the default color of the
SVG content is the CSS
[currentColor](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentColor_keyword)
value. This makes SVG icons by default have the same color as surrounding text, and allows you to
change the color by setting the `color` style on the `sbb-icon` element.

In order to guard against XSS vulnerabilities, any SVG URLs and HTML strings passed to the
`SbbIconRegistry` must be marked as trusted by using Angular's `DomSanitizer` service.

`SbbIconRegistry` fetches all remote SVG icons via Angular's `HttpClient` service. If you haven't
included [`HttpClientModule` from the `@angular/common/http` package](https://angular.io/guide/http)
in your `NgModule` imports, you will get an error at runtime.

Note that `HttpClient` fetches SVG icons registered with a URL via `XmlHttpRequest`, subject to the
[Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). This
means that icon URLs must have the same origin as the containing page or that the application's
server must be configured to allow cross-origin requests.

Examples of registering your own icon:

```ts
.addSvgIconInNamespace(
  'my-icons',
  'lego',
  sanitizer.bypassSecurityTrustResourceUrl('/assets/path/to/your/icon/in/assets/directory.svg')
)
```

```html
<sbb-icon svgIcon="my-icons:lego"></sbb-icon>;
```

or without namespace

```ts
.addSvgIcon(
  'lego',
  sanitizer.bypassSecurityTrustResourceUrl('/assets/path/to/your/icon/in/assets/directory.svg')
)
```

```html
<sbb-icon svgIcon="lego"></sbb-icon>;
```

### Font icons with CSS

Additionally, you can use the `sbb-icon` component with an icon font and svg sets.

Fonts can also display icons by defining a CSS class for each icon glyph, which typically uses a
`:before` selector to cause the icon to appear.
[FontAwesome](https://fortawesome.github.io/Font-Awesome/examples/) uses this approach to display
its icons. To use such a font, set the `fontSet` input to the font's CSS class (either the class
itself or an alias registered with `SbbIconRegistry.registerFontClassAlias`), and set the `fontIcon`
input to the class for the specific icon to show.

For both types of font icons, you can specify the default font class to use when `fontSet` is not
explicitly set by calling `SbbIconRegistry.setDefaultFontSetClass`.

### Font icons with ligatures

Some fonts are designed to show icons by using
[ligatures](https://en.wikipedia.org/wiki/Typographic_ligature), for example by rendering the text
"home" as a home image. To use a ligature icon, put its text in the content of the `sbb-icon`
component.

You can specify a different font by setting the `fontSet` input to either the CSS class to apply to
use the desired font, or to an alias previously registered with
`SbbIconRegistry.registerFontClassAlias`.

### SVG Icon sets

Icon sets allow grouping multiple icons into a single SVG file. This is done by creating a single
root `<svg>` tag that contains multiple nested `<svg>` tags in its `<defs>` section. Each of these
nested tags is identified with an `id` attribute. This `id` is used as the name of the icon.

Icon sets are registered using the `addSvgIconSet`, `addSvgIconSetInNamespace`,
`addSvgIconSetLiteral` or `addSvgIconSetLiteralInNamespace` methods of `SbbIconRegistry`.
After an icon set is registered, each of its embedded icons can be accessed by their `id`
attributes. To display an icon from an icon set, use the `svgIcon` input in the same way
as for individually registered icons.

Multiple icon sets can be registered in the same namespace. Requesting an icon whose id appears in
more than one icon set, the icon from the most recently registered set will be used.
