The `scrolling` module wraps the [ngx-perfect-scrollbar](https://www.npmjs.com/package/ngx-perfect-scrollbar)
package. The wrapper fixes an issue with the [CDK Overlay](https://material.angular.io/cdk/overlay/overview)
integration.

### Usage

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
