At first, you can define a simple panel (without accordion) as see below

```html
<sbb-expansion-panel>
  <sbb-expansion-panel-header>
    A single orphan (no accordion) panel
  </sbb-expansion-panel-header>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat.
</sbb-expansion-panel>
```

or define a simple accordion (made up of more panels) where each expansion panel must include a header:

```html
<sbb-accordion>
  <sbb-expansion-panel>
    <sbb-expansion-panel-header>
      Some generic content accordion panel
    </sbb-expansion-panel-header>
    Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin blandit, justo eget
    pellentesque fermentum, risus tellus varius mi, rutrum tempor augue sem eu urna.
  </sbb-expansion-panel>
  <sbb-expansion-panel
    (opened)="panelOpenState = true; log('opened called')"
    (closed)="panelOpenState = false; log('closed called')"
    (expandedChange)="log('expandedChange called', $event)"
  >
    <sbb-expansion-panel-header>
      Panel with table
      <p style="margin: 0 2em;">Currently I am {{panelOpenState ? 'open' : 'closed'}}</p>
    </sbb-expansion-panel-header>
    <div class="docs-api">
      <h2>Persons Table</h2>
      <table class="docs-api-properties-table">
        <tbody>
          <tr class="docs-api-properties-header-row">
            <th class="docs-api-properties-th">Name</th>
            <th class="docs-api-properties-th">Surname</th>
          </tr>
          <tr class="docs-api-properties-row">
            <td class="docs-api-properties-name-cell">
              <p class="docs-api-property-name">
                <code>Mario</code>
              </p>
            </td>
            <td class="docs-api-property-description">
              <p class="docs-api-property-name">
                <code>Rossi</code>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </sbb-expansion-panel>
</sbb-accordion>
```

### Disabling a panel

Expansion panels can be disabled using the disabled attribute. A disabled expansion panel can't be toggled by the user, but can be used

```html
<sbb-expansion-panel [disabled]="disabled">
  <sbb-expansion-panel-header>
    I can disable this panel
  </sbb-expansion-panel-header>
  <p>
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
    mollit anim id est laborum.
  </p>
</sbb-expansion-panel>
```

### Multi Expansion Panels

Multiple expansion panels can be used into an accordion. The multi="true" input allows the expansions state
to be set independently of each other. When multi="false" (default value) only one panel can be expanded at a given time:

```html
<sbb-accordion [multi]="true">
  <sbb-expansion-panel>
    <sbb-expansion-panel-header>
      Header 1
    </sbb-expansion-panel-header>
    Content 1
  </sbb-expansion-panel>
  <sbb-expansion-panel
    (opened)="panelOpenState = true; log('opened called')"
    (closed)="panelOpenState = false; log('closed called')"
    (expandedChange)="log('expandedChange called', $event)"
  >
    <sbb-expansion-panel-header>
      Header 2
      <p style="margin: 0 2em;">Currently I am {{panelOpenState ? 'open' : 'closed'}}</p>
    </sbb-expansion-panel-header>
    Content 2
  </sbb-expansion-panel>
  <sbb-expansion-panel>
    <sbb-expansion-panel-header>
      Header 3
    </sbb-expansion-panel-header>
    Content 3
  </sbb-expansion-panel>
</sbb-accordion>
```

### Lazy rendering

By default, the expansion panel content will be initialized even when the panel is closed.
To instead defer initialization until the panel is open, the content should be provided as an ng-template:

```html
<sbb-expansion-panel>
  <sbb-expansion-panel-header>
    Panel with lazy loaded content
  </sbb-expansion-panel-header>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore
  </p>
  <ng-template sbbExpansionPanelContent>
    <sbb-expansion-panel>
      <sbb-expansion-panel-header>
        Lazy loaded content initialized at the first parent open
      </sbb-expansion-panel-header>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo
      </p>
    </sbb-expansion-panel>
  </ng-template>
</sbb-expansion-panel>
```

### Advanced Accordion

You can navigate between panels of the accordion with "Next" and "Previous" buttons (step by step) as see below

```html
<sbb-accordion class="example-headers-align">
  <sbb-expansion-panel [expanded]="step === 0" (opened)="setStep(0)">
    <sbb-expansion-panel-header>
      <span>I'm a wizard like accordion</span>
      <p style="margin: 0 1em;">
        conditionally open using [expand] property<br />
        and (opened) event
      </p>
    </sbb-expansion-panel-header>
    <div class="sbbsc-block">
      <button sbbButton mode="primary" (click)="nextStep()">Next</button>
    </div>
  </sbb-expansion-panel>
  <sbb-expansion-panel [expanded]="step === 1" (opened)="setStep(1)">
    <sbb-expansion-panel-header>
      Step 1
    </sbb-expansion-panel-header>
    <div class="sbbsc-block">
      <button sbbButton mode="ghost" (click)="prevStep()">Previous</button>&nbsp;
      <button sbbButton mode="primary" (click)="nextStep()">Next</button>
    </div>
  </sbb-expansion-panel>
  <sbb-expansion-panel [expanded]="step === 2" (opened)="setStep(2)">
    <sbb-expansion-panel-header>
      Step 2
    </sbb-expansion-panel-header>
    <div class="sbbsc-block">
      <button sbbButton mode="ghost" (click)="prevStep()">Previous</button>&nbsp;
      <button sbbButton mode="primary" (click)="nextStep()">End</button>
    </div>
  </sbb-expansion-panel>
</sbb-accordion>
```
