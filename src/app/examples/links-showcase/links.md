# Link Overview

Import link module into your application

```ts
import {
   IconCommonModule,
   LinksModule
} from 'sbb-angular';
```

and then you can use the link component in two modality as seen below:

* Icon Links

```html
<h4>Icon Links</h4>
<a href="#" sbbLink >Bezeichnung</a>
```

* Social Links

```html
<h4>Social Links</h4>
<a sbbSocialLink [icon]="socialLinkIcon"></a>
```