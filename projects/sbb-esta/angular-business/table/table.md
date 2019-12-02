The table module allows the user to display structured data within a table.

### When can you use it?

You can use a table for displaying data, but not for structuring content.

### Characteristics and states

The table consists of a grid of columns and rows. Each column has a header.

The table has got the following characteristics:

- It can display data in grouped columns.
- It can display data in grouped rows.
- It can display a set of action buttons on row hover.
- It can sort data with the following rules:
  - Ascending
  - Descending
  - No sorting

An example of the table component is shown below:

```html
<table sbbTable [dataSource]="dataSource" aria-describedby="sbb-table">
  <ng-container sbbColumnDef="column-one">
    <th sbbHeaderCell *sbbHeaderCellDef id="column-one">column-one</th>
    <td sbbCell *sbbCellDef="let element">{{ element.property1 }}</td>
  </ng-container>

  <ng-container sbbColumnDef="column-two">
    <th sbbHeaderCell *sbbHeaderCellDef id="column-two">column-two</th>
    <td sbbCell *sbbCellDef="let element">{{ element.property2 }}</td>
  </ng-container>

  <tr sbbHeaderRow *sbbHeaderRowDef="displayedColumns"></tr>
  <tr sbbRow *sbbRowDef="let row; columns: displayedColumns"></tr>
</table>
```

The table will be sorted due to any of the following actions:

- Clicking on a table column header, sorting ascendingly.
- Clicking (a second time) on a table column header, sorting descendingly.
- Clicking (a third time) on a table column header, removing sorting.

### Hover

When a row is hovered, it is displayed with a gray background color.

#### Action button position

The action buttons should always get displayed in the last column.
When hovering a row, the action buttons replace the content of the last column cell.
