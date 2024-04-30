Badges are small status descriptors for UI elements. A badge consists of a small circle,
typically containing a number or other short set of characters, that appears in proximity to
another object.

### Badge position

By default, the badge will be placed `above`. Alternatively `after` can be used.
For `SbbIcon` components, the badge will always be placed in the top right corner of the icon,
independent of the value of the position attribute.

### Badge visibility

The badge visibility can be toggled programmatically by defining `sbbBadgeHidden`.

### Accessibility

Badges should be given a meaningful description via `sbbBadgeDescription`. This description will be
applied, via `aria-describedby` to the element decorated by `sbbBadge`.
