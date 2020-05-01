The `scrolling` module wraps the [ngx-perfect-scrollbar](https://www.npmjs.com/package/ngx-perfect-scrollbar)
package. The wrapper fixes an issue with the [CDK Overlay](https://material.angular.io/cdk/overlay/overview)
integration.

### Deprecation Notice

Since we ran into a few problems when using the perfect-scrollbar, we have decided to deprecate this module
and replace the internal perfect-scrollbar usage with a pure CSS solution.

The .sbb-scrollbar CSS class provides a thin scrollbar with SBB colors. This is supported on WebKit Browsers
(Chrome, Safari, Opera, New Microsoft Edge) and Firefox.

### Usage

The dependency to [ngx-perfect-scrollbar](https://www.npmjs.com/package/ngx-perfect-scrollbar) needs
to be installed manually.

```
npm install --save ngx-perfect-scrollbar
```

See the documentation for [ngx-perfect-scrollbar](https://www.npmjs.com/package/ngx-perfect-scrollbar)
on how to use the `perfect-scrollbar`.

```ts
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';

@NgModule({
  ...
  imports: [
    ...
    ScrollingModule,
    ...
  ]
})
export class AppModule {}
```

```html
<perfect-scrollbar style="max-width: 600px; max-height: 400px;" [config]="config">
  <div>Scrollable content</div>
</perfect-scrollbar>
```
