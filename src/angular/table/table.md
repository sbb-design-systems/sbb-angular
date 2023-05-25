The `sbb-table` provides a SBB Design styled data-table that can be used to display rows of data.
You can use a table for displaying data, but not for structuring content.

This table builds on the foundation of the CDK data-table and uses a similar interface for its
data input and template, except that its element and attribute selectors will be prefixed
with `sbb-` instead of `cdk-`. For more information on the interface and a detailed look at how
the table is implemented, see the
[guide covering the CDK data-table](https://material.angular.io/guide/cdk-table).

### Getting Started

```html
<table sbb-table [dataSource]="dataSource">
  <!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

  <!-- Position Column -->
  <ng-container sbbColumnDef="position">
    <th sbb-header-cell *sbbHeaderCellDef>No.</th>
    <td sbb-cell *sbbCellDef="let element">{{element.position}}</td>
  </ng-container>

  <!-- Name Column -->
  <ng-container sbbColumnDef="name">
    <th sbb-header-cell *sbbHeaderCellDef>Name</th>
    <td sbb-cell *sbbCellDef="let element">{{element.name}}</td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container sbbColumnDef="weight">
    <th sbb-header-cell *sbbHeaderCellDef>Weight</th>
    <td sbb-cell *sbbCellDef="let element">{{element.weight}}</td>
  </ng-container>

  <tr sbb-header-row *sbbHeaderRowDef="displayedColumns"></tr>
  <tr sbb-row *sbbRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

#### 1. Write your sbb-table and provide data

Begin by adding the `<table sbb-table>` component to your template and passing in data.

The simplest way to provide data to the table is by passing a data array to the table's `dataSource`
input. The table will take the array and render a row for each object in the data array.

```html
<table sbb-table [dataSource]="myDataArray">
  ...
</table>
```

Since the table optimizes for performance, it will not automatically check for changes to the data
array. Instead, when objects are added, removed, or moved on the data array, you can trigger an
update to the table's rendered rows by calling its `renderRows()` method.

While an array is the _simplest_ way to bind data into the data source, it is also
the most limited. For more complex applications, using a `DataSource` instance
is recommended. See the section "Advanced data sources" below for more information.

#### 2. Define the column templates

Next, write your table's column templates.

Each column definition should be given a unique name and contain the content for its header and row
cells.

Here's a simple column definition with the name `'score'`. The header cell contains the text
"Score" and each row cell will render the `score` property of each row's data.

```html
<ng-container sbbColumnDef="score">
  <th sbb-header-cell *sbbHeaderCellDef>Score</th>
  <td sbb-cell *sbbCellDef="let user">{{user.score}}</td>
</ng-container>
```

Note that the cell templates are not restricted to only showing simple string values, but are
flexible and allow you to provide any template.

If your column is only responsible for rendering a single string value for the header and cells,
you can instead define your column using the `sbb-text-column`. The following column definition is
equivalent to the one above.

```html
<sbb-text-column name="score"></sbb-text-column>
```

Check out the API docs and examples of the `sbb-text-column` to see how you can customize the header
text, text alignment, and cell data accessor. Note that this is not compatible with the flex-layout
table. Also, a data accessor should be provided if your data may have its properties minified
since the string name will no longer match after minification.

#### 3. Define the row templates

Finally, once you have defined your columns, you need to tell the table which columns will be
rendered in the header and data rows.

To start, create a variable in your component that contains the list of the columns you want to
render.

```ts
columnsToDisplay = ['userName', 'age'];
```

Then add `sbb-header-row` and `sbb-row` to the content of your `sbb-table` and provide your
column list as inputs.

```html
<tr sbb-header-row *sbbHeaderRowDef="columnsToDisplay"></tr>
<tr sbb-row *sbbRowDef="let myRowData; columns: columnsToDisplay"></tr>
```

Note that this list of columns provided to the rows can be in any order, not necessarily the order in
which you wrote the column definitions. Also, you do not necessarily have to include every column
that was defined in your template.

This means that by changing your column list provided to the rows, you can easily re-order and
include/exclude columns dynamically.

### Advanced data sources

The simplest way to provide data to your table is by passing a data array. More complex use-cases
may benefit from a more flexible approach involving an Observable stream or by encapsulating your
data source logic into a `DataSource` class.

#### Observable stream of data arrays

An alternative approach to providing data to the table is by passing an Observable stream that emits
the data array to be rendered each time it is changed. The table will listen to this stream and
automatically trigger an update to the rows each time a new data array is emitted.

#### DataSource

For most real-world applications, providing the table a `DataSource` instance will be the best way to
manage data. The `DataSource` is meant to serve as a place to encapsulate any sorting, filtering,
pagination, and data retrieval logic specific to the application.

A `DataSource` is simply a class that has at a minimum the following methods: `connect` and
`disconnect`. The `connect` method will be called by the table to provide an `Observable` that emits
the data array that should be rendered. The table will call `disconnect` when the table is destroyed,
which may be the right time to clean up any subscriptions that may have been registered in the
`connect` method.

Although SBB Angular provides a ready-made table `DataSource` class, `SbbTableDataSource`, you may
want to create your own custom `DataSource` class for more complex use cases. This can be done by
extending the abstract `DataSource` class with a custom `DataSource` class that then implements the
`connect` and `disconnect` methods. For use cases where the custom `DataSource` must also inherit
functionality by extending a different base class, the `DataSource` base class can be
implemented instead (`MyCustomDataSource extends SomeOtherBaseClass implements DataSource`) to
respect Typescript's restriction to only implement one base class.

### Styling Columns

Each table cell has an automatically generated class based on which column it appears in. The format for this
generated class is `sbb-column-NAME`. For example, cells in a column named "symbol" can be targeted with the
selector `.sbb-column-symbol`.

### Row Templates

Event handlers and property binding on the row templates will be applied to each row rendered by the table. For example,
adding a `(click)` handler to the row template will cause each individual row to call the handler when clicked.

## Features

The `SbbTable` is focused on a single responsibility: efficiently render rows of data in a
performant and accessible way.

You'll notice that the table itself doesn't come out of the box with a lot of features, but expects
that the table will be included in a composition of components that fills out its features.

For example, you can add sorting and pagination to the table by using SbbSort and SbbPaginator and
mutating the data provided to the table according to their outputs.

To simplify the use case of having a table that can sort, paginate, and filter an array of data,
the SBB Angular library comes with a `SbbTableDataSource` that has already implemented
the logic of determining what rows should be rendered according to the current table state. To add
these feature to the table, check out their respective sections below.

### Pagination

To paginate the table's data, add a `<sbb-paginator>` after the table.

If you are using the `SbbTableDataSource` for your table's data source, simply provide the
`SbbPaginator` to your data source. It will automatically listen for page changes made by the user
and send the right paged data to the table.

Otherwise if you are implementing the logic to paginate your data, you will want to listen to the
paginator's `(page)` output and pass the right slice of data to your table.

For more information on using and configuring the `<sbb-paginator>`, check out the sbb-paginator docs.

The `SbbPaginator` is one provided solution to paginating your table's data, but it is not the only
option. In fact, the table can work with any custom pagination UI or strategy since the `SbbTable`
and its interface is not tied to any one specific implementation.

```html
<table sbb-table [dataSource]="dataSource">
  ...
</table>

<sbb-paginator pageSize="5" #paginator></sbb-paginator>
```

```ts
export class TablePaginatorExampleComponent implements OnInit {
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource([]);
  @ViewChild('paginator', { static: true }) paginator: SbbPaginatorComponent;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
}
```

### Sorting

To add sorting behavior to the table, add the `sbbSort` directive to the table and add
`sbb-sort-header` to each column header cell that should trigger sorting. Note that you have to import `SbbSortModule` in order to initialize the `sbbSort` directive.

```html
<!-- Name Column -->
<ng-container sbbColumnDef="position">
  <th sbb-header-cell *sbbHeaderCellDef sbb-sort-header>Name</th>
  <td sbb-cell *sbbCellDef="let element">{{element.position}}</td>
</ng-container>
```

If you are using the `SbbTableDataSource` for your table's data source, provide the `SbbSort`
directive to the data source and it will automatically listen for sorting changes and change the
order of data rendered by the table.

By default, the `SbbTableDataSource` sorts with the assumption that the sorted column's name
matches the data property name that the column displays. For example, the following column
definition is named `position`, which matches the name of the property displayed in the row cell.

Note that if the data properties do not match the column names, or if a more complex data property
accessor is required, then a custom `sortingDataAccessor` function can be set to override the
default data accessor on the `SbbTableDataSource`.

If you are not using the `SbbTableDataSource`, but instead implementing custom logic to sort your
data, listen to the sort's `(sbbSortChange)` event and re-order your data according to the sort state.
If you are providing a data array directly to the table, don't forget to call `renderRows()` on the
table, since it will not automatically check the array for changes.

The `SbbSort` is one provided solution to sorting your table's data, but it is not the only option.
In fact, the table can work with any custom sorting UI or strategy since the `SbbTable` and
its interface is not tied to any one specific implementation.

Sorting will apply when one of the following actions takes place:

- Clicking on a table column header, sorting ascendingly.
- Clicking (a second time) on a table column header, sorting descendingly.
- Clicking (a third time) on a table column header, removing sorting.

#### Default Sorting

To achieve default sorting of a column, use `sbbSortActive` directive to define which column to sort, `sbbSortDirection` to set the direction.

```html
<table
  sbb-table
  sbbSort
  [dataSource]="dataSource"
  sbbSortActive="letter"
  sbbSortDirection="asc"
></table>
```

It's also possible to programmatically sort columns by calling `sort()` method of SbbSort directive and providing a SbbSortable.

```ts
export class SortableTableExampleComponent implements AfterViewInit {
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(['A', '1']);

  @ViewChild(SbbSort) sort: SbbSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'letter', start: 'asc', disableClear: false });
  }
}
```

#### Accessibility

When you apply `SbbSortHeader` to a header cell element, the component wraps the content of the
header cell inside a button. The text content of the header cell then becomes the accessible
label for the sort button. However, the header cell text typically describes the column and does
not indicate that interacting with the control performs a sorting action. To clearly communicate
that the header performs sorting, always use the `sortActionDescription` input to provide a
description for the button element, such as "Sort by last name".

`SbbSortHeader` applies the `aria-sort` attribute to communicate the active sort state to
assistive technology. However, most screen readers do not announce changes to the value of
`aria-sort`, meaning that screen reader users do not receive feedback that sorting occurred. To
remedy this, use the `sbbSortChange` event on the `SbbSort` directive to announce state
updates with the `LiveAnnouncer` service from `@angular/cdk/a11y`.

If your application contains many tables and sort headers, consider creating a custom
directives to consistently apply `sortActionDescription` and announce sort state changes.

#### Filtering

SBB Angular does not provide a specific component to be used for filtering the `SbbTable`
since there is no single common approach to adding a filter UI to table data.

A general strategy is to add an input where users can type in a filter string and listen to this
input to change what data is offered from the data source to the table.

If you are using the `SbbTableDataSource`, simply provide the filter string to the
`SbbTableDataSource`. The data source will reduce each row data to a serialized form and will filter
out the row if it does not contain the filter string. By default, the row data reducing function
will concatenate all the object values and convert them to lowercase.

For example, the data object `{id: 123, name: 'Mr. Smith', favoriteColor: 'blue'}` will be reduced
to `123mr. smithblue`. If your filter string was `blue` then it would be considered a match because
it is contained in the reduced string, and the row would be displayed in the table.

To override the default filtering behavior, a custom `filterPredicate` function can be set which
takes a data object and filter string and returns true if the data object is considered a match.

If you want to show a message when not data matches the filter, you can use the `*sbbNoDataRow`
directive.

#### Selection

Right now there is no formal support for adding a selection UI to the table, but SBB Angular
does offer the right components and pieces to set this up. The following steps are one solution but
it is not the only way to incorporate row selection in your table.

##### 1. Add a selection model

Get started by setting up a `SelectionModel` from `@angular/cdk/collections` that will maintain the
selection state.

```ts
const initialSelection = [];
const allowMultiSelect = true;
this.selection = new SelectionModel<MyDataType>(allowMultiSelect, initialSelection);
```

##### 2. Define a selection column

Add a column definition for displaying the row checkboxes, including a main toggle checkbox for
the header. The column name should be added to the list of displayed columns provided to the
header and data row.

```html
<ng-container sbbColumnDef="select">
  <th sbb-header-cell *sbbHeaderCellDef>
    <sbb-checkbox
      (change)="$event ? parentToggle() : null"
      [checked]="selection.hasValue() && isAllSelected()"
      [indeterminate]="selection.hasValue() && !isAllSelected()"
    >
    </sbb-checkbox>
  </th>
  <td sbb-cell *sbbCellDef="let row">
    <sbb-checkbox
      (click)="$event.stopPropagation()"
      (change)="$event ? selection.toggle(row) : null"
      [checked]="selection.isSelected(row)"
    >
    </sbb-checkbox>
  </td>
</ng-container>
```

##### 3. Add event handling logic

Implement the behavior in your component's logic to handle the header's main toggle and checking
if all rows are selected.

```ts
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
parentToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
```

### Sticky Rows and Columns

By using `position: sticky` styling, the table's rows and columns can be fixed so that they do not
leave the viewport even when scrolled. The table provides inputs that will automatically apply the
correct CSS styling so that the rows and columns become sticky.

To display scroll shadows after/before sticky columns, wrap the `<table sbb-table>` with the
`<sbb-table-wrapper>` element.

In order to fix the header row to the top of the scrolling viewport containing the table, you can
add a `sticky` input to the `sbbHeaderRowDef`.

```html
<sbb-table-wrapper>
  <table sbb-table [dataSource]="dataSource">
    <!-- Column definitions... -->
    <tr sbb-header-row *sbbHeaderRowDef="displayedColumns; sticky: true"></tr>
    <tr sbb-row *sbbRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</sbb-table-wrapper>
```

Similarly, this can also be applied to the table's footer row. Note that if you are using the native
`<table>` and using Safari, then the footer will only stick if `sticky` is applied to all the
rendered footer rows.

```html
<sbb-table-wrapper>
  <table sbb-table [dataSource]="dataSource">
    <!-- Column definitions... -->
    <tr sbb-header-row *sbbHeaderRowDef="displayedColumns"></tr>
    <tr sbb-row *sbbRowDef="let row; columns: displayedColumns;"></tr>
    <tr sbb-footer-row *sbbFooterRowDef="displayedColumns; sticky: true"></tr>
  </table>
</sbb-table-wrapper>
```

It is also possible to fix cell columns to the start or end of the horizontally scrolling viewport.
To do this, add the `sticky` or `stickyEnd` directive to the `ng-container` column definition.

```html
<sbb-table-wrapper>
  <table sbb-table [dataSource]="dataSource">
    <!-- Name Column -->
    <ng-container sbbColumnDef="name" sticky>
      <th sbb-header-cell *sbbHeaderCellDef>Name</th>
      <td sbb-cell *sbbCellDef="let element">{{element.name}}</td>
    </ng-container>

    <!-- Star Column -->
    <ng-container sbbColumnDef="star" stickyEnd>
      <th sbb-header-cell *sbbHeaderCellDef>Star</th>
      <td sbb-cell *sbbCellDef="let element">{{element.star}}</td>
    </ng-container>
  </table>
</sbb-table-wrapper>
```

This feature is supported by Chrome, Firefox, Safari, and Edge. It is not supported in IE, but
it does fail gracefully so that the rows simply do not stick.

Note that on Safari mobile when using the flex-based table, a cell stuck in more than one direction
will struggle to stay in the correct position as you scroll. For example, if a header row is stuck
to the top and the first column is stuck, then the top-left-most cell will appear jittery as you
scroll.

### Accessibility

By default, `SbbTable` applies `role="table"`, assuming the table's contains primarily static
content. You can change the role by explicitly setting `role="grid"` or `role="treegrid"` on the
table element. While changing the role will update child element roles, such as changing
`role="cell"` to `role="gridcell"`, this does _not_ apply additional keyboard input handling or
focus management to the table.

Always provide an accessible label for your tables via `aria-label` or `aria-labelledby` on the
table element.

### Column Grouping

To visually group columns you can use the `groupWithNext` flag of `sbbColumnDef` or `sbb-text-column`.
The flag affects the sequence at runtime, not at definition time.

```html
<ng-container sbbColumnDef="groupedOne" groupWithNext>
  <th sbb-header-cell *sbbHeaderCellDef>Grouped col 1</th>
  <td sbb-cell *sbbCellDef="let element">{{ element.groupedOne }}</td>
</ng-container>
```

### Table Cell Actions

It is possible to define up to three (recommended, more are possible) action buttons (or links) for one row.
The buttons are displayed either when hovering or when navigating with the keyboard.
See the example "Cell Actions incl. Keyboard Navigation Support" to see how keyboard
navigation can be implemented.
Please be careful when using these action buttons because the user will
not immediately see that there are actions.
We recommend for accessibility reasons to always create a click action on the whole row,
which links to a possible detail page, where all actions can be called again.
Also, the action buttons should always be provided with aria labels,
so that screen readers can output a meaningful text.

```html
<td>
  <div class="sbb-table-cell-actions" aria-label="Press tab key to access actions.">
    <a
      sbb-secondary-button
      [routerLink]="['./edit', element.id]"
      attr.aria-label="Edit {{element.vehicle}}."
    >
      <sbb-icon svgIcon="pen-small"></sbb-icon>
    </a>
    <button
      sbb-secondary-button
      attr.aria-label="Save {{element.vehicle}} as favorite."
      (click)="action()"
    >
      <sbb-icon svgIcon="star-small"></sbb-icon>
    </button>
  </div>
</td>
```

### Table Wrapper

The `<sbb-table-wrapper>` tag can be used to make a table horizontally scrollable
or vertically scrollable if a fix height is provided.
The `<sbb-table-wrapper>` also adds some accessibility improvements by making the table wrapper focusable.

If using sticky rows or columns, the `<sbb-table-wrapper>` is mandatory.

```html
<sbb-table-wrapper>
  <table sbb-table>
    ...
  </table>
</sbb-table-wrapper>
```

To define the table wrapper as not focusable, set the `focusable` property to false.

```html
<sbb-table-wrapper focusable="false">
  <table sbb-table>
    ...
  </table>
</sbb-table-wrapper>
```

## Styles

### Alignments

To align the text in a cell, the following css classes can be used on your desired tag (table, row or cell level).

- `sbb-table-align-left`
- `sbb-table-align-center`
- `sbb-table-align-right`

### Horizontal Divider With Title

If using horizontal dividers to group content, use the
css class `sbb-table-divider-title` to style the title correctly.

```html
<ng-container sbbColumnDef="horizontalTableDivider">
  <td [attr.colspan]="displayedColumns.length" sbb-cell *sbbCellDef="let groupBy">
    <span class="sbb-table-divider-title">{{ groupBy.title }}</span>
  </td>
</ng-container>
<tr sbb-row *sbbRowDef="let row; columns: ['horizontalTableDivider']; when: isGroup"></tr>
```

### Style of a selected row

If your table allows to select a row, you can conditionally apply the css class `sbb-table-row-selected`
to a `<tr>`-tag to achieve the selected style.

If using `SelectionModel`, it could look like the following example.
Please also consult the working example in the examples section.

```ts
export class SelectableTableExample {
  ...
  selection = new SelectionModel<ItemModel>(true, []);
  ...
}
```

```html
<table sbb-table>
  ...
  <tr
    sbb-row
    *sbbRowDef="let row; columns: displayedColumns"
    (click)="selection.toggle(row)"
    [class.sbb-table-row-selected]="selection.isSelected(row)"
  ></tr>
  ...
</table>
```
