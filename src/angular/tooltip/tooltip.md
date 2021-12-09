The tooltip module allows the user to display additional information as needed.

```html
<sbb-tooltip> Display additional information about a topic, input or something else. </sbb-tooltip>
```

By default the `sbb-tooltip` will be displayed as a circled question mark,
which can be clicked to open the tooltip.

The overlay is either displayed above or below the icon, depending on space available.

### Directive usage

Additionally we provide a directive usage for the tooltip. This is also internally used inside
`sbb-tooltip`.

```html
<span sbbTooltip="Display additional information about a topic, input or something else."
  >Short description.</span
>
```

By default the `sbbTooltip` will be shown on hover.

#### Template usage

It is also possible to use a `TemplateRef` as a tooltip content.

```html
<span sbbTooltip="tooltipContent">Short description.</span>

<ng-template #tooltipContent>
  Display additional information about a topic, input or something else.
</ng-template>
```

#### Show and hide delays

To add a delay before showing or hiding the tooltip, you can use the inputs `hoverShowDelay` and
`hoverHideDelay` for `sbb-tooltip` element with `hover` trigger usage and `sbbTooltipShowDelay` and
`sbbTooltipHideDelay` for `sbbTooltip` attribute usage to provide a delay time in milliseconds.

#### Disabling the tooltip from showing

To completely disable a tooltip, set `disabled` on `sbb-tooltip` or `sbbTooltipDisabled` on
`sbbTooltip`. While disabled, a tooltip will never be shown.

### Accessibility

Elements with the `sbbTooltip` will add an `aria-describedby` label that provides a reference
to an element containing the tooltip's message. Depending on the used variant this is either a
hidden element with a copy of the message or a reference to the tooltip element itself.

If a tooltip will only be shown manually via click, keypress, etc., then extra care should be taken
such that the action behaves similarly for screen-reader users. One possible approach would be
to use the `LiveAnnouncer` from the `cdk/a11y` package to announce the tooltip content on such
an interaction.
