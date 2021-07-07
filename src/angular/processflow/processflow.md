The `<sbb-processflow>` provides a wizard-like workflow by dividing content into logical steps.

The `SbbProcessflow` builds on the foundation of the CDK stepper that is responsible for the logic
that drives a processflow.

```html
<sbb-processflow aria-label="Describe the purpose of this processflow">
  <sbb-step label="Step 1" aria-label="Brief description of Step 1">
    <p>Content for first step</p>
    <button sbb-button sbbProcessflowNext>Next</button>
  </sbb-step>
  <sbb-step aria-label="Brief description of Step 2">
    <ng-template sbbStepLabel>Step 2</ng-template>
    <ng-template sbbStepContent>
      <p>This content was rendered lazily</p>
      <button sbb-secondary-button sbbProcessflowPrevious>Back</button>
      <button sbb-button sbbProcessflowNext>Next</button>
    </ng-template>
  </sbb-step>
</sbb-processflow>
```

### Labels

If a step's label is only text, then the `label` attribute can be used.

```html
<sbb-step label="Step 1"> ... </sbb-step>
```

For more complex labels, add a template with the `sbbStepLabel` directive inside the
`sbb-step`.

```html
<sbb-step>
  <ng-template sbbStepLabel>Step 2</ng-template>
  ...
</sbb-step>
```

### Processflow buttons

There are two button directives to support navigation between different steps:
`sbbProcessflowPrevious` and `sbbProcessflowNext`.

```html
<button sbb-secondary-button sbbProcessflowPrevious>Back</button>
<button sbb-button sbbProcessflowNext>Next</button>
```

### Linear processflow

The `linear` attribute can be set on `sbb-processflow` to create a linear processflow that requires the
user to complete previous steps before proceeding to following steps. For each `sbb-step`, the
`stepControl` attribute can be set to the top level `AbstractControl` that is used to check the
validity of the step.

There are two possible approaches. One is using a single form for processflow, and the other is
using a different form for each step.

Alternatively, if you don't want to use the Angular forms, you can pass in the `completed` property
to each of the steps which won't allow the user to continue until it becomes `true`. Note that if
both `completed` and `stepControl` are set, the `stepControl` will take precedence.

#### Using a single form

When using a single form for the processflow, `sbbProcessflowPrevious` and `sbbProcessflowNext` have to be
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
        <button sbb-secondary-button sbbProcessflowPrevious type="button">Back</button>
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

#### Editable step

By default, steps are editable, which means users can return to previously completed steps and
edit their responses. `editable="false"` can be set on `sbb-step` to change the default.

```html
<sbb-step [stepControl]="firstFormGroup" [editable]="isEditable"></sbb-step>
```

#### Completed step

By default, the `completed` attribute of a step returns `true` if the step is valid (in case of
linear processflow) and the user has interacted with the step. The user, however, can also override
this default `completed` behavior by setting the `completed` attribute as needed.

### Lazy rendering

By default, the processflow will render all of it's content when it's initialized. If you have some
content that you want to defer until the particular step is opened, you can put it inside
an `ng-template` with the `sbbStepContent` attribute.

```html
<sbb-step>
  <ng-template sbbStepLabel>Step 1</ng-template>
  <ng-template sbbStepContent>
    <p>This content was rendered lazily</p>
    <button sbb-button sbbProcessflowNext>Next</button>
  </ng-template>
</sbb-step>
```

### Keyboard interaction

- <kbd>LEFT_ARROW</kbd>: Focuses the previous step header
- <kbd>RIGHT_ARROW</kbd>: Focuses the next step header
- <kbd>HOME</kbd>: Focuses the first step header
- <kbd>END</kbd>: Focuses the last step header
- <kbd>ENTER</kbd>, <kbd>SPACE</kbd>: Selects the step that the focus is currently on
- <kbd>TAB</kbd>: Focuses the next tabbable element
- <kbd>SHIFT</kbd>+<kbd>TAB</kbd>: Focuses the previous tabbable element

### Accessibility

The processflow is treated as a tabbed view for accessibility purposes, so it is given
`role="tablist"` by default. The header of step that can be clicked to select the step
is given `role="tab"`, and the content that can be expanded upon selection is given
`role="tabpanel"`. `aria-selected` attribute of step header and `aria-expanded` attribute of
step content is automatically set based on step selection change.

The processflow and each step should be given a meaningful label via `aria-label` or `aria-labelledby`.
