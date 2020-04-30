## Standalone Ghettobox

### Simple Ghettobox

```html
<sbb-ghettobox> This is a simple message with a simple <a href="#">Link</a> inside. </sbb-ghettobox>
```

### Ghettobox with `routerLink` set and custom icon

```html
<sbb-ghettobox
  (afterDelete)="afterDelete($event)"
  [routerLink]="['.', 'test']"
  [queryParams]="{debug: false}"
  fragment="test"
>
  <sbb-icon-him-disruption *sbbIcon></sbb-icon-him-disruption>
  This is a Link ghettobox with custom icon.
</sbb-ghettobox>
```

You can subscribe to the `afterDelete` stream to get notified when the ghettobox is being deleted.

```ts
afterDelete(evt: GhettoboxDeletedEvent) {
  // Do something with evt.ghettoboxState and evt.ghettoboxId
}
```

## Ghettobox within a Ghettobox container (operable by `GhettoboxService`)

```html
<sbb-ghettobox-container>
  <sbb-ghettobox [routerLink]="['.', 'test']" [queryParams]="{debug: true}" fragment="test">
    <sbb-icon-him-disruption *sbbIcon></sbb-icon-him-disruption>
    This is an initial ghettobox into a container.
  </sbb-ghettobox>
</sbb-ghettobox-container>
```

You can use the `GhettoboxService` API to add | delete | clear and more. For instance.

```ts
addGhettobox(message: string) {
  const ghettobox: Ghettobox = { message: 'message', link: LinkGeneratorResult, icon: TemplateRef }
  const ghettoboxRef = this._ghettoboxService.add(ghettobox);

  ghettoboxRef.afterDelete.pipe(first()).subscribe(
    (evt: GhettoboxDeletedEvent) => {
      // Do something with evt.ghettoboxState and evt.ghettoboxId
    }
  );
}
```

```ts
deleteById(id: string) {
  this._ghettoboxService.deleteById(id);
}
```

```ts
deleteByIndex(index: number) {
  this._ghettoboxService.deleteByIndex(index);
}
```

```ts
deleteByRef() {
  const ghettoboxRef: GhettoboxRef = this._ghettoboxService.attachedGhettoboxes[0];
  ghettoboxRef.delete();
}
```

```ts
clear() {
  this._ghettoboxService.clearAll();
}
```

You can also subscribe on `containerReady` Observable if you want to do something at page load. For Instance.

```ts
constructor(private _ghettoboxService: GhettoboxService) {
  this._ghettoboxService.containerReady.subscribe(
    () => {
      this._ghettoboxService.add({ message: 'This ghettobox is loaded at page load' });
    }
  );
}
```
