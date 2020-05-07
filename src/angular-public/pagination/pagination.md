This module contains two different components:

- sbb-paginator
- sbb-navigation

### The sbb-paginator component

A sbb-paginator requires a length property, which defines the length of the data.
Optionally a pageIndex property (defaults to 0) to select the displayed page, and a pageSize property (defaults to 50) which defines how many entries are on a page, can be set.
Note that the pageIndex is Zero-based.

The paginator emits a PageEvent, when the page changes. The event contains the new
page index, the previous page index, the page size and the length property.

If you like to define the amount of pages manually, just set pageSize to 1 and length to the count of pages.

```html
<sbb-paginator
  (page)="onPageChange($event)"
  [pageSize]="pageSize"
  [length]="length"
  [pageIndex]="pageIndex"
>
</sbb-paginator>
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
