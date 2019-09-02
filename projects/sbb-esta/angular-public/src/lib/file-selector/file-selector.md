You can use file selector component as seen below

```html
<sbb-file-selector></sbb-file-selector>
```

### What does the module do?

The main function of file selector module is upload files.

### When can you use it?

You can use it in applications that require one or more files of a user.

### Characteristics and states

1. By clicking on the "Datei hochladen" button, the file browser of the system opens.
   The uploaded files choosen by the user are displayed in a list.
2. The list entry includes the icon of the file type upload, the file name and in brackets
   the file type and the file size.
3. With the "Delete button" (as a trash icon) a single file can be removed from the list.
4. You can select more files together using the `multiple` property (by setting it at 'true' value)
   on file selector component.
5. You can set the property `multipleMode` to `persistent` in order to change the default
   input file behaviour that replace already selected files with the new selection. With
   this option later selection will add files instead replacing.

The module has two states:

- normal

- disabled

### Configuring the component globally

It is possible to define the categories and the types of file accepted globally.
You can provide them at the module-level using respectively `FILE_TYPES` and
`FILE_SELECTOR_OPTIONS` providers as see below:

```ts
const fileCategories: FileTypeCategory[] = [FileTypeCategory.IMAGE, FileTypeCategory.VIDEO];
const fileSelectorOptions: FileSelectorOptions = {
  accept: 'image/jpeg,video.mp4',
  multiple: true,
  multipleMode: 'persistent',
  capture: 'user'
};
```

Configure them in the providers section of your module:

```ts
providers: [
  { provide: FILE_TYPES, useValue: fileCategories },
  { provide: FILE_SELECTOR_OPTIONS, useValue: fileSelectorOptions }
];
```

### Examples

- Simple example (you can chose single file)

```html
<h4>Simple example (single file)</h4>
<sbb-file-selector (fileChanged)="fileChanged($event)"></sbb-file-selector>
```

- Advanced example (you can chose multiple files)

```html
<h4>Example multiple files allowed and ngModel attached</h4>
<sbb-file-selector multiple="true" [(ngModel)]="filesList2"></sbb-file-selector>
```

- Advanced example (you can chose multiple files and allow adding new files to the collection instead replacing)

```html
<h4>Example multiple files allowed and ngModel attached</h4>
<sbb-file-selector
  multiple="true"
  multipleMode="persistent"
  [(ngModel)]="filesList2"
></sbb-file-selector>
```

- Advanced example (disable status)

```html
<h4>Example with disable status</h4>
<sbb-file-selector multiple="true" [(ngModel)]="filesList2" [disabled]="true"></sbb-file-selector>
```
