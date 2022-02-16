`<sbb-expansion-panel>` provides an expandable details-summary view.

`<sbb-accordion>` acts as a container for multiple expansion panels.

### Expansion-panel content

#### Header

The `<sbb-expansion-panel-header>` shows a summary of the panel content and acts
as the control for expanding and collapsing.

```html
<sbb-expansion-panel>
  <sbb-expansion-panel-header> This is the expansion title </sbb-expansion-panel-header>
  <p>This is the primary content of the panel.</p>
</sbb-expansion-panel>
```

By default, the expansion panel header includes a toggle icon at the end of the
header to indicate the expansion state. This icon can be hidden via the
`hideToggle` property.

```html
<sbb-expansion-panel hideToggle>...</sbb-expansion-panel>
```

#### Disabling a panel

Expansion panels can be disabled using the `disabled` attribute. A disabled expansion panel can't
be toggled by the user, but can still be manipulated programmatically.

```html
<sbb-expansion-panel disabled>...</sbb-expansion-panel>
```

### Accordion (Multiple Expansion Panels)

Multiple expansion panels can be combined into an accordion. The `multi="true"` input allows the
expansions state to be set independently of each other. When `multi="false"` (default) just one
panel can be expanded at a given time:

```html
<sbb-accordion [multi]="true">
  <sbb-expansion-panel>
    <sbb-expansion-panel-header> Header 1 </sbb-expansion-panel-header>
    Content 1
  </sbb-expansion-panel>
  <sbb-expansion-panel>
    <sbb-expansion-panel-header> Header 2 </sbb-expansion-panel-header>
    Content 2
  </sbb-expansion-panel>
</sbb-accordion>
```

### Lazy rendering

By default, the expansion panel content will be initialized even when the panel is closed.
To instead defer initialization until the panel is open, the content should be provided as
an `ng-template`:

```html
<sbb-expansion-panel>
  <sbb-expansion-panel-header> This is the expansion title </sbb-expansion-panel-header>

  <ng-template sbbExpansionPanelContent> Some deferred content </ng-template>
</sbb-expansion-panel>
```

### Full Width Styles

For mobile and tablet views the accordion can be displayed with full width
by applying the css class `sbb-expansion-panel-full-width`.

```html
<sbb-expansion-panel class="sbb-expansion-panel-full-width">
  <sbb-expansion-panel-header> This is the expansion title </sbb-expansion-panel-header>
</sbb-expansion-panel>
```

### Accessibility

`SbbExpansionPanel` imitates the experience of the native `<details>` and `<summary>` elements.
The expansion panel header applies `role="button"` and the `aria-controls` attribute with the
content element's ID.

The expansion panel headers are buttons. Users can use the keyboard to activate the expansion panel
header to switch between expanded state and collapsed state. Because the header acts as a button,
additional interactive elements should carefully be placed inside the header.
