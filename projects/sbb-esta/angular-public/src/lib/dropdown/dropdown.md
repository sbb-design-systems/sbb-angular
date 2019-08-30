This module contains the component:

- sbb-dropdown

and the directives:

- sbb-dropdown-trigger
- sbb-dropdown-origin
- sbb-dropdown-item

### How to use

The sbb-dropdown uses `a, button, hr` elements to build its items list.
That being said, you have to use the `sbbDropdownItem` directive on every
link/button you want to be listed and properly used into the dropdown.

You need also to add a dropdown trigger, using the `sbbDropdownTrigger` directive
on a separate element (maybe a button, a div, or what you prefer).

In the case below, a button has been used:

```html
<button sbbButton type="button" [sbbDropdown]="dropdown">Open dropdown</button>

<sbb-dropdown #dropdown="sbbDropdown">
  <a
    sbbDropdownItem
    [routerLink]="['.']"
    [queryParams]="{ page : 1}"
    routerLinkActive="sbb-selected"
    >Test</a
  >
  <a
    sbbDropdownItem
    [routerLink]="['.']"
    [queryParams]="{ page : 2}"
    routerLinkActive="sbb-selected"
    >Test 2</a
  >
  <a
    sbbDropdownItem
    [routerLink]="['.']"
    [queryParams]="{ page : 3}"
    routerLinkActive="sbb-selected"
    >Test 3</a
  >
  <hr />
  <button sbbDropdownItem type="button" (click)="onClick()">Logout</button>
</sbb-dropdown>
```

More details are available in the `Examples` page.
