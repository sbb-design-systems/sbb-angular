You can use the time input directive as seen below

```html
<form>
  <input sbbTimeInput />
</form>
```

The time input field accepts any numeric values and one character
(for example a "." or "," or "-") but automatically formats them in the correct format "hh:mm".

**Attention, the time input doesn't apply any validation. This is up to the consumer.**

To understand how the time input works, see the following cases:

| Input | Output |
| ----- | ------ |
| 16:30 | 16:30  |
| 1     | 01:00  |
| 12    | 12:00  |
| 123   | 12:30  |
| 1234  | 12:34  |
| 13567 | 13:56  |
| 3.56  | 03:56  |
| 23,40 | 23:40  |

### Use with `@angular/forms`

`sbbTimeInput` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.
