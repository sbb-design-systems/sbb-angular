The captcha module provides a query to make sure that a webpage interacts with a real user.
It is intended to be used with forms that are accessible without a login.

```html
<sbb-captcha (resolved)="resolved($event)"></sbb-captcha>
```

### Characteristics and input options

The captcha component offers the following options:

1. siteKey: the siteKey of the user.
2. theme: the color theme of the widget.
3. type: the type of the widget.
4. size: the size of the widget.
5. tabIndex: the tabindex of the widget and challenge.
6. badge: the badge of the widget.

### Configuring the component globally

Some properties as `siteKey`, `size` and others are globals. You can provide them at the module-level using the RECAPTCHA_SETTINGS provider as seen below:

```ts
const globalSetting: RecaptchaSettings = { siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' };
```

and set it in the providers section of your module:

```ts
providers: [{ provide: RECAPTCHA_SETTINGS, useValue: globalSetting }];
```

### Specifying a different language

Captcha supports various languages. By default, recaptcha will guess the user's language itself.
You can override this behavior and provide a specific language to use.
You can set a specific language in your module in the providers section:

```ts
providers: [{ provide: RECAPTCHA_LANGUAGE, useValue: 'fr' }];
```
