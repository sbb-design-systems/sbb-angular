You can use the tab component as seen below
(in this simple example you can navigate between tabs with left and right arrow)

```html
<h4>Basic Example</h4>
<sbb-tabs>
  <sbb-tab label="Tab 1" id="content1-tab" labelId="content1">
    <h4>Content 1</h4>
    <p>Here comes the content for tab 1 ...</p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </sbb-tab>

  <sbb-tab label="Tab 2" id="content2-tab" labelId="content2">
    <h4>Content 2</h4>
    <p>Here comes the content for tab 2 ...</p>
  </sbb-tab>
</sbb-tabs>
```

### Lazy rendering

By default, the tab contents will be initialized even when the tab is closed.
To instead defer initialization until the tab is open, the content should be provided as an ng-template:

```html
<sbb-tabs>
  <sbb-tab label="Tab 1" id="content1-tab" labelId="content1">
    <ng-template sbbTabContent>
      <h4>Lazy rendered tab content for tab 1</h4>
    </ng-template>
  </sbb-tab>

  <sbb-tab label="Tab 2" id="content2-tab" labelId="content2">
    <ng-template sbbTabContent>
      <h4>Lazy rendered tab content for tab 2</h4>
    </ng-template>
  </sbb-tab>
</sbb-tabs>
```
