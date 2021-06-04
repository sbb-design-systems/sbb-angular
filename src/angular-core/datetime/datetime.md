The `datetime` module contains functionality related to date formatting, parsing and validating.

The `Datepicker` uses the `DateAdapter` internally. The default implementation for the `DateAdapter`
is the `NativeDateAdapter`, which uses the JavaScript `Date` object.

### BusinessDateAdapter

For business applications you have the ability to use `BusinessDateAdapter` which extends `NativeDateAdapter`
and additionally allows parsing dates like '01012020'.

```ts
...
import { SBB_BUSINESS_DATE_ADAPTER } from '@sbb-esta/angular-core/datetime';
...
@NgModule({
  ...
  providers: [SBB_BUSINESS_DATE_ADAPTER]
})
export class AppModule {}
```

### Custom DateAdapter

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
