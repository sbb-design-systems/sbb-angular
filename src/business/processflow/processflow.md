You can use process flow component as a workflow divided into step as seen below

```html
<sbb-processflow>
  <sbb-processflow-step title="Schritt 1">
    <div>
      Schrittinhalt 1
    </div>
  </sbb-processflow-step>
  <sbb-processflow-step title="Schritt 2">
    <div>
      Schrittinhalt 2
    </div>
  </sbb-processflow-step>
  <sbb-processflow-step title="Schritt 3">
    <div>
      Schrittinhalt 3
    </div>
  </sbb-processflow-step>
</sbb-processflow>
```

### Move between steps in a process flow

You can also use prevStep() and nextStep() functions to move respectively between previous and next step:

```ts
 prevStep() {
  const activeStepIndex = this.findActiveStepIndex(this.steps.toArray());
  if (activeStepIndex > 0) {
    this.disableStep(activeStepIndex);
    this.changeStep(activeStepIndex - 1);
  }
}
```

```ts
nextStep() {
  const activeStepIndex = this.findActiveStepIndex(this.steps.toArray());
  let activatedStep = false;
  if (activeStepIndex < this.steps.length - 1) {
    this.steps.forEach((s, i) => {
      if (i > activeStepIndex && !activatedStep) {
        s.active = true;
        s.disabled = false;
        activatedStep = true;
      } else {
        s.active = false;
      }
    });
    this.changeDetectorRef.markForCheck();
    this.stepChange.emit(this.steps.toArray()[activeStepIndex + 1]);
  }
}
```

or to reset the entire process flow with reset() function:

```ts
reset() {
    this.processflow.reset();
}
```

### Skippable step configuration

The processflow can be configured to have skippable/non skippable steps. By default it will have non skippable steps.
In case the desired behaviour is to have skippable steps, the `skippable` flag can be used as in the following example:

```html
<sbb-processflow skippable="true">
  <sbb-processflow-step title="Schritt 1">
    <div>
      Schrittinhalt 1
    </div>
  </sbb-processflow-step>
  <sbb-processflow-step title="Schritt 2">
    <div>
      Schrittinhalt 2
    </div>
  </sbb-processflow-step>
  <sbb-processflow-step title="Schritt 3">
    <div>
      Schrittinhalt 3
    </div>
  </sbb-processflow-step>
</sbb-processflow>
```

Please refer to the example page to see a working demo.
