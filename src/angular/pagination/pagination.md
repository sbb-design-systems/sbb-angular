This module contains two different components: `<sbb-paginator>` and `<sbb-navigation>`

### Pagination

Each paginator instance requires:

- The number of items per page (default set to 50)
- The total number of items being paged (length property)

The current page index defaults to 0, but can be explicitly set via pageIndex. Note that the pageIndex is Zero-based.

When the page changes, a `PageEvent` will be fired that can be used to update any associated data view.

If you like to define the amount of pages manually, just set pageSize to 1 and length to the count of pages.

```html
<sbb-paginator
  aria-label="Select page"
  (page)="onPageChange($event)"
  [pageSize]="pageSize"
  [length]="length"
  [pageIndex]="pageIndex"
>
</sbb-paginator>
```

#### Accessibility

The paginator uses `role="group"` to semantically group its child controls. You must add an
`aria-label` or `aria-labelledby` attribute to `<sbb-paginator>` with a label that describes
the content controlled by the pagination control.

### Navigation

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
