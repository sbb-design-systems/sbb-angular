# File Selector Overview

Import file selector module in your application 

```ts
import { FileSelectorModule } from 'sbb-angular';
```

and you can use file selector component as see below.
<br>
<br>

### What does the module do?

The main function of file selector module is upload files.
<br>
<br>

### When can you use it?

You can use it in applications that require one or more files of a user.
<br>
<br>

### Characteristics and states

1. By clicking on the "Datei hochladen" button, the file browser of the system opens. The uploaded files choosen by the user are displayed in a list.
2. The list entry includes the icon of the file type upload, the file name and in brackets the file type and the file size.
3. With the "Delete button" (as a trash icon) a single file can be removed from the list. 
4. You can select more files together using the ```multiple``` property (by setting it at 'true' value) on file selector component.  

The module has two states:

* normal

* disabled

### Examples

* Simple example (you can chose single file)

```html
<h4>Simple example (single file)</h4>
<sbb-file-selector (fileChanged)="fileChanged($event)"></sbb-file-selector>
```

* Advanced example (you can chose multiple files)

```html
<h4>Example multiple files allowed and ngModel attached</h4>
<sbb-file-selector multiple="true" [(ngModel)]="filesList2"></sbb-file-selector>
```

* Advanced example (disable status)

```html
<h4>Example with disable status</h4>
<sbb-file-selector multiple="true" [(ngModel)]="filesList2" [disabled]="true"></sbb-file-selector>
```
