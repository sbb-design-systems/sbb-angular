# Pagination Overview

Import pagination module into your application

```ts
import { PaginationModule } from 'sbb-angular';
```

This module contains two different components:

* sbb-pagination
* sbb-navigation

Each of them can be used in two ways:

* as links (using router links)
* as buttons

## The sbb-pagination component
  
### Buttons configuration

Each sbb-pagination instance requires:

* The max number of pages (a maximum of 5 pages are displayed)
* The initial page
* An optional pageChange function

as see below:

```html
<sbb-pagination
   (pageChange)="onPageChange($event)"
   [maxPage]="maxPage"
   [initialPage]="initialPage">
</sbb-pagination>
```

When the user interacts with the paginator, a ```PageEvent``` will be fired that can be used to update the status of pagination (current page selected, previous and next pages and the pages displayed).  

### Links configuration

In order to use this component with router links, you must define a ```linkGenerator``` function to be applied on every page in input. The ```initialPage``` input is not needed.

```html
<sbb-pagination
  (pageChange)="onPageChange($event)"
  [maxPage]="maxPage"
  [linkGenerator]="linkGenerator">
</sbb-pagination>
```

The ```linkGenerator``` method has this kind of declaration:

```ts
  linkGenerator?: (page: { index: number, displayNumber: number }) => LinkGeneratorResult
```

## The sbb-navigation component

This component has only two buttons/links labelled by a title, one for navigating to the previous page, another to get to the next page.

When the description is too long and doesn't fit into the button/link label, it is still visible into the native tooltip of each button.

Input needed:

* nextPage: a string representing the title of the next page
* previousPage: a string representing the title of the previous page
* pageChange: callback called when a button/link is clicked
* linkGenerator: input function to be used to enable the link mode

The pageChange callback argument is a ```{direction: 'previous' | 'next'}``` object.  

### Navigation buttons configuration

If no ```linkGenerator``` function is passed as input to the component, this renders two buttons.

```html
<sbb-navigation 
    (pageChange)="onPageChangeNavigation($event)"
    [nextPage]="nextPage"
    [previousPage]="previousPage">
</sbb-navigation>
```

The switching logic has to be implemented into the ```pageChange``` callback.  

### Navigation links configuration

If you want to use Angular routing to change pages, you have to implement and pass into the component a ```linkGenerator``` function.

```html
<sbb-navigation 
    [linkGenerator]="linkGeneratorNavigation"
    (pageChange)="onPageChangeNavigation($event)"
    [nextPage]="nextPage"
    [previousPage]="previousPage">
</sbb-navigation>
```

The ```linkGenerator``` method declaration is the following one:

```ts
linkGenerator?: (direction: 'previous' | 'next') => LinkGeneratorResult;
```
