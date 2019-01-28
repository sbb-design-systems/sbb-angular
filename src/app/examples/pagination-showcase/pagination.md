# Pagination Overview

Import pagination module into your application

```ts
import { PaginationModule } from 'sbb-angular';
```


### Basic Use

Each sbb-pagination instance requires:

   * The max number of pages (a maximum of 5 pages are displayed)
   * The initial page

as see below:

```html
<sbb-pagination 
    (pageChange)="onPageChange($event)" 
    [maxPage]="maxPage"
    [initialPage]="initialPage"></sbb-pagination>
```

When the user interacts with the paginator, a ``` PageEvent ``` will be fired that can be used to update the status of pagination (current page selected, previous and next pages and the pages displayed)

<br />

### Accessibility

The ``` aria-label ``` attribute is set for next page, previous page and current page buttons.
