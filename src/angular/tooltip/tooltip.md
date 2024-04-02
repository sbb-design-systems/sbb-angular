The tooltip module allows the user to display additional information as needed.

```html
<sbb-tooltip> Display additional information about a topic, input or something else. </sbb-tooltip>
```

By default the `sbb-tooltip` will be displayed as a circled question mark,
which can be clicked to open the tooltip.

The overlay is either displayed above or below the icon, depending on space available.

### Inline Usage

If using the tooltip in a textual context, you can add the css class `sbb-tooltip-inline` to achieve an appropriate styling.

```html
<sbb-tooltip class="sbb-tooltip-inline"></sbb-tooltip>
```

### Directive usage

Additionally, we provide a directive usage for the tooltip. This is also internally used inside
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
<span [sbbTooltip]="tooltipContent">Short description.</span>

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

Setting `disabled` to `true` on a `sbb-tooltip` element in the standard design variant will hide the trigger element.

#### Zero panel padding

To gain more control over the tooltip content styling, you can add the panel class `sbb-tooltip-zero-padding` to remove any padding.
Please note, that you have to place the close icon yourself.

```html
<sbb-tooltip sbbTooltipPanelClass="sbb-tooltip-zero-padding"></sbb-tooltip>
```

### Accessibility

`SbbTooltip` adds an `aria-describedby` description that provides a reference
to an element containing the tooltip's message. Depending on the used variant this is either
a hidden element with a copy of the message or a reference to the tooltip element itself.
This provides screenreaders the information needed to read out the tooltip's contents
when the end-user focuses on tooltip's trigger.

Avoid interactions that exclusively show a tooltip with pointer events like click and mouseenter.
Always ensure that keyboard users can perform the same set of actions available to mouse and
touch users.
