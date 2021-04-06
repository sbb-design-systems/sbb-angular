The file selector allows single or multiple file selections and enables integration into Angular
Forms.

```html
<sbb-file-selector (fileChanged)="fileChanged($event)"></sbb-file-selector>
```

The selected files will be displayed below the button as a list and can individually be removed
via the trash can delete button.

### Accept input

The `accept` input value is a string that defines the file types the file input should accept.
This string is a comma-separated list of unique file type specifiers. Because a given file type
may be identified in more than one manner, it's useful to provide a thorough set of type specifiers
when you need files of a given format.

```html
<sbb-file-selector accept="image/*,.pdf"></sbb-file-selector>
```

### Multiple and multiple mode input

When the `multiple` input is set, the file input allows the user to select more than one file.
Additionally the `multipleMode` input configures, whether newly selected files should be
replaced (`default`) or appended (`persistent`).

```html
<sbb-file-selector multiple multipleMode="persistent"></sbb-file-selector>
```

### Capture input

The capture attribute value is a string that specifies which camera to use for capture of image or
video data, if the `accept` attribute indicates that the input should be of one of those types. A
value of `user` indicates that the user-facing camera and/or microphone should be used. A value of
`environment` specifies that the outward-facing camera and/or microphone should be used. If this
attribute is missing, the user agent is free to decide on its own what to do. If the requested
facing mode isn't available, the user agent may fall back to its preferred default mode.

```html
<sbb-file-selector capture="user" accept="audio/*"></sbb-file-selector>
<sbb-file-selector capture="environment" accept="video/*"></sbb-file-selector>
<sbb-file-selector capture="user" accept="image/*"></sbb-file-selector>
```

### Use with `@angular/forms`

`<sbb-file-selector>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

#### Template-driven forms

```html
<sbb-file-selector [(ngModel)]="files"></sbb-file-selector>
```

#### Reactive Forms

```html
<sbb-file-selector formControlName="files"></sbb-file-selector>
```

### Global configuration

It is possible to define some options globally.

```ts
providers: [
  {
    provide: SBB_FILE_SELECTOR_OPTIONS,
    useValue: {
      accept: 'image/jpeg,video.mp4',
      multiple: true,
      multipleMode: 'persistent',
      capture: 'user',
    } as SbbFileSelectorOptions,
  },
];
```
