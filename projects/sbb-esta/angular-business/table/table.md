The `sbbTable` provides a SBB Design styled data-table that can be used to display rows of data.

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

### Usage

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

1. Write your `sbbTable` and provide data

   Begin by adding the `<table sbbTable>` component to your template and passing in data.
   The simplest way to provide data to the table is by passing a data array to the table's dataSource input.
   The table will take the array and render a row for each object in the data array.

   ```html
   <table sbbTable [dataSource]="myDataArray" aria-describedby="my-table-name">
     ...
   </table>
   ```

   Since the table optimizes for performance, it will not automatically check for changes to the data array.
   Instead, when objects are added, removed, or moved on the data array, you can trigger an update to the table's rendered rows by calling its `renderRows()` method.

   While an array is the simplest way to bind data into the data source, it is also the most limited.
   For more complex applications, using a DataSource instance is recommended. See the section "Advanced data sources" below for more information.

2. Define the column templates

   Next, write your table's column templates.
   Each column definition should be given a unique name and contain the content for its header and row cells.
   Here's a simple column definition with the name 'example'.
   The header cell contains the text "example" and each row cell will render the `example` property of each row's data.

   ```html
   <ng-container sbbColumnDef="example">
     <th sbbHeaderCell *sbbHeaderCellDef id="example">example</th>
     <td sbbCell *sbbCellDef="let element">{{ element.example }}</td>
   </ng-container>
   ```

   Note that the cell templates are not restricted to only showing simple string values, but are flexible and allow you to provide any template.
   If your column is only responsible for rendering a single string value for the header and cells, you can instead define your column using the sbb-text-column.
   The following column definition is equivalent to the one above.

   ```html
   <sbb-text-column name="example"></sbb-text-column>
   ```

3. Define the row templates

   Finally, once you have defined your columns, you need to tell the table which columns will be rendered in the header and data rows.
   To start, create a variable in your component that contains the list of the columns you want to render.

   columnsToDisplay = ['example', 'result'];
   Then add `sbbHeaderRow` and `sbbRow` to the content of your `sbbTable` and provide your column list as inputs.

   ```html
   <tr sbbHeaderRow *sbbHeaderRowDef="columnsToDisplay"></tr>
   <tr sbbRow *sbbRowDef="let row; columns: columnsToDisplay"></tr>
   ```

   Note that this list of columns provided to the rows can be in any order, not necessarily the order in which you wrote the column definitions.
   Also, you do not necessarily have to include every column that was defined in your template.

This means that by changing your column list provided to the rows, you can easily re-order and include/exclude columns dynamically.

### Advanced data sources

The simplest way to provide data to your table is by passing a data array.
More complex use-cases may benefit from a more flexible approach involving an Observable stream or by encapsulating your data source logic into a DataSource class.

#### Observable stream of data arrays

An alternative approach to providing data to the table is by passing an Observable stream that emits the data array to be rendered each time it is changed.
The table will listen to this stream and automatically trigger an update to the rows each time a new data array is emitted.

#### DataSource

For most real-world applications, providing the table a DataSource instance will be the best way to manage data.
The DataSource is meant to serve a place to encapsulate any sorting, filtering, pagination, and data retrieval logic specific to the application.
  
A DataSource is simply a base class that has two functions: connect and disconnect.
The connect function will be called by the table to receive a stream that emits the data array that should be rendered.
The table will call disconnect when the table is destroyed, which may be the right time to clean up any subscriptions that may have been registered during the connect process.

### Sorting

To add sorting behavior to the table, add the `sbbSort` directive to the table and add `sbbSortHeader` to each column header cell that should trigger sorting.

```html
<ng-container sbbColumnDef="letter">
  <th sbbHeaderCell sbbSortHeader="letter" *sbbHeaderCellDef id="letter">Letter</th>
  <td sbbCell *sbbCellDef="let element">{{ element.letter }}</td>
</ng-container>
```

If you are using the `SbbTableDataSource` for your table's data source, provide the `sbbSort` directive to the data source and it will automatically listen for sorting changes and change the order of data rendered by the table.

By default, the `SbbTableDataSource` sorts with the assumption that the sorted column's name matches the data property name that the column displays.
Note that if the data properties do not match the column names, or if a more complex data property accessor is required, then a custom `sortingDataAccessor` function can be set to override the default data accessor on the `SbbTableDataSource`.

If you are not using the `SbbTableDataSource`, but instead implementing custom logic to sort your data, listen to the sort's `(sbbSortChange)` event and re-order your data according to the sort state.
If you are providing a data array directly to the table, don't forget to call `renderRows()` on the table, since it will not automatically check the array for changes.

Sorting will apply when one of the following actions takes place:

- Clicking on a table column header, sorting ascendingly.
- Clicking (a second time) on a table column header, sorting descendingly.
- Clicking (a third time) on a table column header, removing sorting.

### Action buttons

Action buttons should always get displayed in the last column.
When hovering a row, the action buttons replace the content of the last column cell.

You can implement action buttons by adding icons with click behaviour to the content of the last column's cell.

```html
<ng-container sbbColumnDef="date">
  <th sbbHeaderCell *sbbHeaderCellDef id="date">Date</th>
  <td sbbCell *sbbCellDef="let element">
    <div class="sbb-table-row-action-text">{{ element.date }}</div>
    <div class="sbb-table-row-action">
      <sbb-icon-trash size="fixed" (click)="deleteItem(element)"></sbb-icon-trash>
    </div>
  </td>
</ng-container>
```
