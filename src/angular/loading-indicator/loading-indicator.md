The loading component is used as a progress bar to indicate progress and activity, as shown below

```html
<sbb-loading-indicator mode="medium" aria-label="Loading, please wait"></sbb-loading-indicator>
```

The loading indicator supports four modes (tiny, small, medium (default), big),
a mode for covering the parent element (fullbox),
and a text inline mode, which allows to use the loading indicator within a text and adjust the size to the font size.

### Accessibility

If the loading state should be announced by screen readers, wrap the `sbb-loading-indicator` in an
element with `aria-live` and add an `aria-label` attribute to the loading indicator.

```html
<div aria-live="polite">
  <sbb-loading-indicator *ngIf="isLoading" mode="medium" aria-label="Loading, please wait">
  </sbb-loading-indicator>
</div>
```
