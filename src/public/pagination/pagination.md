This module contains two different components:

- sbb-pagination
- sbb-navigation

### The sbb-pagination component

A sbb-pagination requires a length property, which defines the amount of pages.
Optionally a pageIndex property (defaults to 0) can be set to select the displayed page.
Note that the pageIndex is Zero-based.

The pagination emits a pageChange event, when the page changes. The event contains the new
page index and the display number.

```html
<sbb-pagination (pageChange)="onPageChange($event)" [length]="length" [pageIndex]="pageIndex">
</sbb-pagination>
```

### The sbb-navigation component

This component has only two buttons labelled by a title, one for navigating to the previous page,
another to get to the next page.

When the description is too long and doesn't fit into the button/link label, it is still visible
into the native tooltip of each button.

The sbb-navigation requires either a nextPage property or a previousPage property or both.

The navigation emits a pageChange event (`'previous' | 'next'`) on click of the previous or next
button, which indicates the direction that was clicked.

```html
<sbb-navigation
  (pageChange)="onPageChangeNavigation($event)"
  [nextPage]="nextPage"
  [previousPage]="previousPage"
>
</sbb-navigation>
```

The switching logic has to be implemented into the `pageChange` callback.
