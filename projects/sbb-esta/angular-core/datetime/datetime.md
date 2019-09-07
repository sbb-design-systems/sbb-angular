The `datetime` module contains functionality related to date formatting, parsing and validating.

The `Datepicker` uses the `DateAdapter` internally. The default implementation for the `DateAdapter`
is the `NativeDateAdapter`, which uses the JavaScript `Date` object.

It is possible to implement your own `DateAdapter` and register it globally:

```ts
@NgModule({
  ...
  providers: [
    ...
    { provide: DateAdapter, useClass: MyDateAdapter }
    ...
  ]
})
export class AppModule {}
```
