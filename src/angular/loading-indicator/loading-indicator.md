The loading component is used as a progress bar to indicate progress and activity, as shown below

```html
<sbb-loading-indicator mode="medium" aria-label="Loading, please wait"></sbb-loading-indicator>
```

The loading indicator supports four modes `tiny`, `small`, `medium` (default), `big` and
a mode for covering the parent element `fullbox`,
and a text `inline` mode, which allows to use the loading indicator within a text and adjust the size to the font size.

As an additional note; If you want to use the `fullbox` mode and it should cover the entire parent element space, it is
required to add the `position: relative;` CSS rule to the parent.

### Accessibility

If the loading state should be announced by screen readers, wrap the `sbb-loading-indicator` in an
element with `aria-live` and add an `aria-label` attribute to the loading indicator.

```angular
<div aria-live="polite">
  @if (isLoading) {
    <sbb-loading-indicator mode="medium" aria-label="Loading, please wait" />
  }
</div>
```
