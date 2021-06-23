Angular Material's stepper provides a wizard-like workflow by dividing content into logical steps.

Material stepper builds on the foundation of the CDK stepper that is responsible for the logic
that drives a stepped workflow. Material stepper extends the CDK stepper and has Material Design
styling.

### Stepper variants

There are two stepper variants: `horizontal` and `vertical`. You can switch between the two using
the `orientation` attribute.

<!-- example(stepper-overview) -->

<!-- example(stepper-vertical) -->

### Labels

If a step's label is only text, then the `label` attribute can be used.

<!-- example({"example": "stepper-overview",
              "file": "stepper-overview-example.html",
              "region": "label"}) -->

For more complex labels, add a template with the `sbbStepLabel` directive inside the
`sbb-step`.

<!-- example({"example": "stepper-editable",
              "file": "stepper-editable-example.html",
              "region": "step-label"}) -->

#### Label position

For a horizontal `sbb-processflow` it's possible to define the position of the label. `end` is the
default value, while `bottom` will place it under the step icon instead of at its side.
This behaviour is controlled by `labelPosition` property.

<!-- example({"example": "stepper-label-position-bottom",
              "file": "stepper-label-position-bottom-example.html",
              "region": "label-position"}) -->

### Stepper buttons

There are two button directives to support navigation between different steps:
`sbbProcessflowPrevious` and `sbbProcessflowNext`.

<!-- example({"example": "stepper-label-position-bottom",
              "file": "stepper-label-position-bottom-example.html",
              "region": "buttons"}) -->

### Linear stepper

The `linear` attribute can be set on `sbb-processflow` to create a linear stepper that requires the
user to complete previous steps before proceeding to following steps. For each `sbb-step`, the
`stepControl` attribute can be set to the top level `AbstractControl` that is used to check the
validity of the step.

There are two possible approaches. One is using a single form for stepper, and the other is
using a different form for each step.

Alternatively, if you don't want to use the Angular forms, you can pass in the `completed` property
to each of the steps which won't allow the user to continue until it becomes `true`. Note that if
both `completed` and `stepControl` are set, the `stepControl` will take precedence.

#### Using a single form

When using a single form for the stepper, `sbbProcessflowPrevious` and `sbbProcessflowNext` have to be
set to `type="button"` in order to prevent submission of the form before all steps
are completed.

```html
<form [formGroup]="formGroup">
  <sbb-processflow formArrayName="formArray" linear>
    <sbb-step formGroupName="0" [stepControl]="formArray.get([0])">
      ...
      <div>
        <button sbb-button sbbProcessflowNext type="button">Next</button>
      </div>
    </sbb-step>
    <sbb-step formGroupName="1" [stepControl]="formArray.get([1])">
      ...
      <div>
        <button sbb-button sbbProcessflowPrevious type="button">Back</button>
        <button sbb-button sbbProcessflowNext type="button">Next</button>
      </div>
    </sbb-step>
    ...
  </sbb-processflow>
</form>
```

#### Using a different form for each step

```html
<sbb-processflow orientation="vertical" linear>
  <sbb-step [stepControl]="formGroup1">
    <form [formGroup]="formGroup1">...</form>
  </sbb-step>
  <sbb-step [stepControl]="formGroup2">
    <form [formGroup]="formGroup2">...</form>
  </sbb-step>
</sbb-processflow>
```

### Types of steps

#### Optional step

If completion of a step in linear stepper is not required, then the `optional` attribute can be set
on `sbb-step`.

<!-- example({"example": "stepper-optional",
              "file": "stepper-optional-example.html",
              "region": "optional"}) -->

#### Editable step

By default, steps are editable, which means users can return to previously completed steps and
edit their responses. `editable="false"` can be set on `sbb-step` to change the default.

<!-- example({"example": "stepper-editable",
              "file": "stepper-editable-example.html",
              "region": "editable"}) -->

#### Completed step

By default, the `completed` attribute of a step returns `true` if the step is valid (in case of
linear stepper) and the user has interacted with the step. The user, however, can also override
this default `completed` behavior by setting the `completed` attribute as needed.

#### Overriding icons

By default, the step headers will use the `create` and `done` icons from the Material design icon
set via `<sbb-icon>` elements. If you want to provide a different set of icons, you can do so
by placing a `sbbProcessflowIcon` for each of the icons that you want to override. The `index`,
`active`, and `optional` values of the individual steps are available through template variables:

<!-- example({"example": "stepper-states",
              "file": "stepper-states-example.html",
              "region": "override-icons"}) -->

Note that you aren't limited to using the `sbb-icon` component when providing custom icons.

#### Step States

You can set the state of a step to whatever you want. The given state by default maps to an icon.
However, it can be overridden the same way as mentioned above.

<!-- example({"example": "stepper-states",
              "file": "stepper-states-example.html",
              "region": "states"}) -->

In order to use the custom step states, you must add the `displayDefaultIndicatorType` option to
the global default stepper options which can be specified by providing a value for
`STEPPER_GLOBAL_OPTIONS` in your application's root module.

```ts
@NgModule({
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
```

<!-- example(stepper-states) -->

### Error State

If you want to show an error when the user moved past a step that hasn't been filled out correctly,
you can set the error message through the `errorMessage` input and configure the stepper to show
errors via the `showError` option in the `STEPPER_GLOBAL_OPTIONS` injection token. Note that since
`linear` steppers prevent a user from advancing past an invalid step to begin with, this setting
will not affect steppers marked as `linear`.

```ts
@NgModule({
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
```

<!-- example(stepper-errors) -->

### Lazy rendering

By default, the stepper will render all of it's content when it's initialized. If you have some
content that you want to defer until the particular step is opened, you can put it inside
an `ng-template` with the `sbbStepContent` attribute.

<!-- example(stepper-lazy-content) -->

### Responsive stepper

If your app supports a wide variety of screens and a stepper's layout doesn't fit a particular
screen size, you can control its `orientation` dynamically to change the layout based on the
viewport.

<!-- example(stepper-responsive) -->

### Keyboard interaction

- <kbd>LEFT_ARROW</kbd>: Focuses the previous step header
- <kbd>RIGHT_ARROW</kbd>: Focuses the next step header
- <kbd>HOME</kbd>: Focuses the first step header
- <kbd>END</kbd>: Focuses the last step header
- <kbd>ENTER</kbd>, <kbd>SPACE</kbd>: Selects the step that the focus is currently on
- <kbd>TAB</kbd>: Focuses the next tabbable element
- <kbd>SHIFT</kbd>+<kbd>TAB</kbd>: Focuses the previous tabbable element

### Localizing labels

Labels used by the stepper are provided through `SbbProcessflowIntl`. Localization of these messages
can be done by providing a subclass with translated values in your application root module.

```ts
@NgModule({
  imports: [SbbProcessflowModule],
  providers: [{ provide: SbbProcessflowIntl, useClass: MyIntl }],
})
export class MyApp {}
```

<!-- example(stepper-intl) -->

### Accessibility

The stepper is treated as a tabbed view for accessibility purposes, so it is given
`role="tablist"` by default. The header of step that can be clicked to select the step
is given `role="tab"`, and the content that can be expanded upon selection is given
`role="tabpanel"`. `aria-selected` attribute of step header and `aria-expanded` attribute of
step content is automatically set based on step selection change.

The stepper and each step should be given a meaningful label via `aria-label` or `aria-labelledby`.
