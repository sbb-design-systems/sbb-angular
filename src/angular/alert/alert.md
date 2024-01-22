The Alert should only be used at the top of the page to inform about major interruptions,
disturbances or other incidents.

```html
<sbb-alert>A major incident is currently happening.</sbb-alert>
```

If you want to link to another page or another website, use the attribute selector for the
Alert.

```html
<a sbbAlert [routerLink]="['/details']">A major incident is currently happening.</a>
<a sbbAlert href="https://sbb.ch/details">A major incident is currently happening.</a>
```

### Custom icon

To provide a custom icon, use the `svgIcon` input.

```html
<sbb-alert svgIcon="fpl:disruption">A major incident is currently happening.</sbb-alert>
<sbb-alert [svgIcon]="icon">A major incident is currently happening.</sbb-alert>
```

### Dismissed event

You can subscribe to the `dismissed` event to get notified when the alert is being dismissed/closed.

```html
<sbb-alert (dismissed)="handleDismissed($event)">
  A major incident is currently happening.
</sbb-alert>
```

### Alert service

The Alert module provides a `SbbAlertService` to dynamically add Alert instances.
In order to do that, a `<sbb-alert-outlet>` has to be placed where you want to display
the Alert instances.

```html
<sbb-alert-outlet></sbb-alert-outlet>
```

You can use the `SbbAlertService` to add Alert instances or dismiss all existing.

```ts
constructor(alertService: SbbAlertService) {
  alertService.add('A major incident is currently happening.');
}
```

It is also possible to define a custom icon via the `SbbAlertService`.

```ts
alertService.add('A major incident is currently happening.', { icon: 'fpl:disruption' });
```

To use the link variants with the service, an optional paramter can be provided.

```ts
// External link
alertService.add('A major incident is currently happening.', {
  link: 'https://sbb.ch/details',
});
// Router link
alertService.add('A major incident is currently happening.', { routerLink: '/details' });
```

To programmatically dismiss a Alert instance from the outlet, use the `SbbAlertRef` returned
by the add method.

```ts
const ref = alertService.add('A major incident is currently happening.');
ref.dismiss();
```

Also, to react to the dismissal of a Alert instance from the outlet, the `SbbAlertRef`
provides an observable via method.

```ts
const ref = alertService.add('A major incident is currently happening.');
ref.afterDismissed().subscribe(() => {
  ...
});
```
