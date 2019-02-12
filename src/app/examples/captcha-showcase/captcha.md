# Captcha Overview

Import captcha module into your application

```ts
import { CaptchaModule } from 'sbb-angular';
```

and you can use captcha component as see below.

<br>

### What does captcha do?

Provides a query to make sure that a webpage interacts with a real user.
<br>
<br>

### When can you use it?

For forms that are accessible without login.
<br>
<br>

<h4>Basic Example</h4>

```html
<h4 class="sbbsc-block">Basic example</h4>
<sbb-captcha (resolved)="resolved($event)"></sbb-captcha>
```
<br>

### Characteristics, states and input options

The captcha element has two states:
* checked
* unchecked

The captcha component also supports the following options:
1. siteKey: the siteKey of the user.
2. theme: the color theme of the widget.
3. type: the type of the widget.
4. size: the size of the widget.
5. tabIndex: the tabindex of the widget and challenge.
6. badge: the badge of the widget.
<br>

### Events

* resolved(captchaResponse: string). Occurs when the captcha resolution value changed. When user resolves captcha, use ```response``` parameter to send to the server for verification. If the captcha has expired prior to submitting its value to the server, the component will reset the captcha, and trigger the resolved event with response === null.

### Methods

* reset() : Performs a manual captcha reset. This method might be useful if your form validation failed, and you need the user to re-enter the captcha.

* execute() : Executes the invisible recaptcha. Does nothing if component's size is not set to "invisible". 

### Configuring the component globally

Some properties as ```siteKey```, ```size``` and others are globals. You can provide them at the module-level using the RECAPTCHA_SETTINGS provider as see below:

```ts
const globalSetting : RecaptchaSettings = { siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' }
```
and set it in the providers section of your module:
```ts
 providers: [{provide: RECAPTCHA_SETTINGS, useValue: globalSetting }]
```
<br>

### Specifing a different language

Captcha supports various languages. By default recaptcha will guess the user's language itself. But you can override this behavior and provide a specific language to use. 
You can set a specific language in your module in the providers section:
```ts
providers: [{provide: RECAPTCHA_LANGUAGE, useValue: 'fr',}]
```
<br>

### Advanced Examples

* Captcha with ```[(ngModel)]``` directive 

```html
<form #captchaProtectedForm="ngForm">
    <sbb-captcha [(ngModel)]="formModel.captcha"
                 name="captcha"
                 required
                 [siteKey]="testSiteKey"
                 #captchaControl="ngModel">
    </sbb-captcha>
</form>
```

* Captcha with ```reactiveForm```

```html
<form [formGroup]="formCaptcha">
    <sbb-captcha formControlName="captcha"
                 name="captcha"
                 [siteKey]="testSiteKey">
    </sbb-captcha>
</form>
```