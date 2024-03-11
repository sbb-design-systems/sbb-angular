A tag represents a solution to categorize a large amount of information.
You can use tag components to filter results with many categories.

### Tag

A tag always has a number that indicates how many results are behind it.
Each tag is either active or inactive, what means that clicking on a tag, the respective
state changes and should influence the filter result.

Within `sbb-tags`, an additional "All" tag is automatically inserted. If the "All" tag is clicked,
it changes the status of each tag in the filter to inactive.

```html
<sbb-tags>
  <sbb-tag amount="23" formControlName="trains">Trains</sbb-tag>
  <sbb-tag amount="2" formControlName="cars">Cars</sbb-tag>
</sbb-tags>
```

#### Total Amount in "All" Tag

By default, the amount badge in the "All" tag is calculated by summing up all amounts of every child tag component.
If you like to set the total amount manually (e.g. if the amounts in the tag components are not exclusively)
then you have to set the `totalAmount` property of `<sbb-tags>`.

```html
<sbb-tags [totalAmount]="100">
  <sbb-tag [amount]="10" [(ngModel)]="tag">Trains</sbb-tag>
</sbb-tags>
```

### Tag Link

You can use a tag link to navigate to the corresponding category page.

```html
<a sbb-tag-link amount="5" routerLink="/home">Trains</a>
```

Tag links are always active.

### Accessibility

When using a tag with an icon but without a label, it's important to provide an `aria-label` so that screen readers can
announce the purpose of the tag.

```html
<sbb-tag svgIcon="trains-small" [amount]="3" aria-label="Trains">Trains</sbb-tag>
```

To provide more precise aria descriptions for the badge label,
it's possible to set the `sbbBadgeDescription` property on `<sbb-tag>` or `tag-link`.

```html
<sbb-tag [amount]="amount" [(ngModel)]="tag" sbbBadgeDescription="{{ amount }} trains available"
  >Trains</sbb-tag
>
```

```html
<a
  sbb-tag-link
  [amount]="amount"
  routerLink="/home"
  sbbBadgeDescription="{{ amount }} trains available"
  >Trains</a
>
```
