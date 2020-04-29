You can use table component to display rows of data as see below

```html
<sbb-table tableId="testID">
  <thead>
    <tr>
      <th scope="col" *ngFor="let header of headers">{{ header }}</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let row of rows">
      <th [attr.scope]="row.scope" [attr.aria-describedby]="row.describedby">
        {{ row.text1 }}
      </th>
      <td>{{ row.text2 }}</td>
      <td>{{ row.text3 }}</td>
      <td>{{ row.text4 }}</td>
      <td class="sbb-table-align-right">{{ row.text5 }}</td>
    </tr>
  </tbody>
</sbb-table>
```

### Pin Mode

The sbb-table provides a pin mode, which pins the first column the the left side.
This is not supported in IE11.

### Remove/Reset table content

You can also remove a row or more rows from the table with removeRow() function:

```ts
removeRow() {
    this.rows.splice(this.rows.length - 1, 1);
  }
```

or to reset the initial content of the table with resetRows() function:

```ts
resetRows() {
    this.rows = this._rows.slice();
  }
```

### Filter table content

It is possible to search specific content of the table using a filter function:

```ts
 filterTable(evt: any) {
    const value = evt.target.value;
    if (value !== '') {
      this.rows = this._rows.filter(row => {
        if (row.text1.indexOf(value) !== -1) { return true; }
        if (row.text2.indexOf(value) !== -1) { return true; }
        if (row.text3.indexOf(value) !== -1) { return true; }
        if (row.text4.indexOf(value) !== -1) { return true; }
        if (row.text5.indexOf(value) !== -1) { return true; }
        return false;
      });
    } else {
      this.rows = this._rows.slice();
    }
  }
```
