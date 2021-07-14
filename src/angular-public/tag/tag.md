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
  <sbb-tag label="Trains" amount="23" formControlName="trains"></sbb-tag>
  <sbb-tag label="Cars" amount="2" formControlName="cars"></sbb-tag>
</sbb-tags>
```

#### Total Amount in "All" Tag

By default, the amount badge in the "All" tag is calculated by summing up all amounts of every child tag component.
If you like to set the total amount manually (e.g. if the amounts in the tag components are not exclusively)
then you have to set the `totalAmount` property of `<sbb-tags>`.

```html
<sbb-tags [totalAmount]="100">
  <sbb-tag label="Trains" [amount]="10" [(ngModel)]="tag"></sbb-tag>
</sbb-tags>
```

### Link tag

You can use a link tag to navigate to the corresponding category page.

```html
<a routerLink="/home">
  <sbb-tag label="Link tag" amount="5"></sbb-tag>
</a>
```

Link tags can only receive the active state.
