You can use the textarea component as seen below

```html
<h4 class="sbbsc-block">Textarea</h4>
<sbb-textarea [(ngModel)]="textArea1" [minlength]="minlength" [maxlength]="maxlength">
</sbb-textarea>
```

If a `maxlength` is defined, a counter is displayed in the right bottom corner.
The counter is hidden, if the `sbb-textarea` is disabled.
