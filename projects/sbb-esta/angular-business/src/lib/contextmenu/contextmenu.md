### Basic Usage

```html
<sbb-contextmenu>
  <sbb-dropdown>
    <button sbbDropdownItem type="button" (click)="action1()">Action 1</button>
    <button sbbDropdownItem type="button" (click)="action2()">Action 2</button>
    <button sbbDropdownItem type="button" (click)="action3()">Action 3</button>
  </sbb-dropdown>
</sbb-contextmenu>
```

<br>

### Requirement to use the contextmenu module

Should be used with a dropdown element as a child.
The dropdown should follow its rule in order to work properly.

<br>

### Characteristics

The contextmenu contains the `<sbb-icon-context-menu>` icon.
When hovered with the mouse the icon's color becomes red. Once clicked
the icon the dropdown will open on the bottom left. The contextmenu will be
opened on the top left in case there is not enough space to display the content
of itself at the bottom of the icon.
