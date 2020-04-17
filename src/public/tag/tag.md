A tag represents a solution to categorize a large amount of information.

### When can you use it?

You can use tags component to filter results with many categories.

### Characteristics and states

Every tag always has a number that indicates how many results are behind it.

You can insert a lot of text in a tag label but if tag becomes too long (exceeds the max width) the text will be truncated with ellipsis.

The element has two states

- Active
- Inactive

So the tags are active or inactive in the filter. This means that clicking on a tag the respective state change and influences the filter result.
Within the filter, an additional tag called "Alle" is always inserted. If this filter tag is clicked, it changes the status of all tags in the filter to inactive.

```html
<sbb-tags>
  <sbb-tag
    *ngFor="let tag of tagItems"
    [(ngModel)]="tag.selected"
    (change)="change($event)"
    [label]="tag.label"
    [id]="tag.id"
    [amount]="tag.amount"
  ></sbb-tag>
</sbb-tags>
```

### Linktag

You can use linktag to navigate at the corresponding category page.

```html
<h4>Link Tag</h4>
<a routerLink="/home">
  <sbb-tag label="Link tag" amount="5"></sbb-tag>
</a>
```

Linktags has only the active state.
