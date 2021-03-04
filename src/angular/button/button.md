sbb-angular buttons are native `<button>` or `<a>` elements enhanced with SBB Design
styling.

Native `<button>` and `<a>` elements are always used in order to provide the most straightforward
and accessible experience for users. A `<button>` element should be used whenever some _action_
is performed. An `<a>` element should be used whenever the user will _navigate_ to another view.

```html
<button type="button" sbb-button>Button</button>
<a routerLink="..." sbb-button>Button</button>

<button type="button" sbb-link>Link</button>
<a routerLink="..." sbb-link>Button</button>
```

There are several button variants, each applied as an attribute:

| Attribute                              | Description                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `sbb-button`                           | The primary button. Has an animation on standard.                                                                        |
| `sbb-alt-button` (lean only)           | An alternate primary button for lean.                                                                                    |
| `sbb-secondary-button`                 | The secondary button, which can be placed next to or on the same page as a primary button. Has an animation on standard. |
| `sbb-ghost-button`                     | The ghost button, which can be placed next to or on the same page as a primary button.                                   |
| `sbb-icon-button` (lean only)          | The icon button, which is intended to contain a single icon.                                                             |
| `sbb-frameless-button` (standard only) | The frameless button, which is displayed simply as text with no surrounding box.                                         |
| `sbb-link`                             | This is the link variant, which has an animation on standard and a single indicator icon on lean.                        |

### Custom indicator icon

The standard variants of `sbb-button`, `sbb-secondary-button`, `sbb-frameless-button` and
`sbb-link` and the lean variant of `sbb-link` have an indicator icon. This can be customized
by using the `indicatorIcon` input. Any registered SVG icon of the `SbbIconRegistry` can be used.

See [here](/angular/icon-overview) for our available icons.

### Link Group

Use the `.sbb-link-group` to display a list of `sbb-link` elements in a group.

```html
<div class="sbb-link-group">
  <a href="#" sbb-link>Navigation 1</a>
  <button type="button" sbb-link>Navigation 2</button>
  <a href="#" sbb-link indicatorIcon="kom:download-small">Download 1</a>
  <button type="button" sbb-link indicatorIcon="kom:download-small">Download 2</button>
</div>
```

### Accessibility

sbb-angular uses native `<button>` and `<a>` elements to ensure an accessible experience by
default. The `<button>` element should be used for any interaction that _performs an action on the
current page_. The `<a>` element should be used for any interaction that _navigates to another
view_.

Buttons or links containing only icons (such as `sbb-icon-button`)
should be given a meaningful label via `aria-label` or `aria-labelledby`.

```html
<button type="button" sbb-icon-button aria-label="See details">
  <sbb-icon svgIcon="kom:eye-small">
</button>
```
