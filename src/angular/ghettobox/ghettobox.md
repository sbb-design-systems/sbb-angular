The Ghettobox should only be used at the top of the page to inform about major interruptions,
disturbences or other incidents.

```html
<sbb-ghettobox>A major incident is currently happening.</sbb-ghettobox>
```

If you want to link to another page or another website, use the attribute selector for the
Ghettobox.

```html
<a sbbGhettobox [routerLink]="['/details']">A major incident is currently happening.</a>
<a sbbGhettobox href="https://sbb.ch/details">A major incident is currently happening.</a>
```

### Custom icon

To provide a custom icon, use the `indicatorIcon` input.

```html
<sbb-ghettobox indicatorIcon="fpl:disruption"
  >A major incident is currently happening.</sbb-ghettobox
>
<sbb-ghettobox [indicatorIcon]="icon">A major incident is currently happening.</sbb-ghettobox>
```

### Dismissed event

You can subscribe to the `dismissed` event to get notified when the ghettobox is being dismissed/closed.

```html
<sbb-ghettobox (dismissed)="handleDismissed($event)"
  >A major incident is currently happening.</sbb-ghettobox
>
```

### Ghettobox service

The Ghettobox module provides a `SbbGhettoboxService` to dynamically add Ghettobox instances.
In order to do that, a `<sbb-ghettobox-outlet>` has to be placed where you want to display
the Ghettobox instances.

```html
<sbb-ghettobox-outlet></sbb-ghettobox-outlet>
```

You can use the `SbbGhettoboxService` to add Ghettobox instances or dismiss all existing.

```ts
constructor(ghettoboxService: SbbGhettoboxService) {
  ghettoboxService.add('A major incident is currently happening.');
}
```

It is also possible to define a custom icon via the `SbbGhettoboxService`.

```ts
ghettoboxService.add('A major incident is currently happening.', { icon: 'fpl:disruption' });
```

To use the link variants with the service, an optional paramter can be provided.

```ts
// External link
ghettoboxService.add('A major incident is currently happening.', {
  link: 'https://sbb.ch/details',
});
// Router link
ghettoboxService.add('A major incident is currently happening.', { routerLink: '/details' });
```

To programmatically dismiss a Ghettobox instance from the outlet, use the `SbbGhettoboxRef` returned
by the add method.

```ts
const ref = ghettoboxService.add('A major incident is currently happening.');
ref.dismiss();
```

Also to react to the dismissal of a Ghettobox instance from the outlet, the `SbbGhettoboxRef`
provides an observable via method.

```ts
const ref = ghettoboxService.add('A major incident is currently happening.');
ref.afterDismissed().subscribe(() => {
  ...
});
```
