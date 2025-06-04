export interface UpdateStep {
  from: number;
  to: number;
  actions: string[];
}

export const UPDATE_STEPS: UpdateStep[] = [
  {
    from: 1200,
    to: 1300,
    actions: [
      `Update your Angular dependencies to version 13.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@13 update @angular/core@13 @angular/cli@13 --force</pre>`,

      `Update Angular CDK and <code>angular-devkit/build-angular</code> in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@13 update @angular-devkit/build-angular@13 @angular/cdk@13 --force</pre>`,

      `Use <code>ng add</code> to add <code>@sbb-esta/angular</code> package. Our automatic
       migration takes care of most of the changes and also sets up your typography design variant (standard or lean).
        <pre>ng add @sbb-esta/angular@13</pre>`,

      `Check console output, added TODOs in your code and consult <a href="/angular/guides/migration-guide">migration guide</a> for more explanations on changes.`,

      `(Optional) if possible, remove deprecated dependencies <code>@sbb-esta/angular-public</code>, <code>@sbb-esta/angular-business</code>
        <code>@sbb-esta/angular-core</code>, <code>@sbb-esta/angular-icons</code> and <code>@sbb-esta/angular-keycloak</code> from your project.`,

      `(Optional) run <code>npx @angular/cli@13 update @sbb-esta/maps</code> if you are using maps package.`,

      `Clear angular cache (<code>.angular</code> folder) to avoid caching problems.`,
    ],
  },
  {
    from: 1300,
    to: 1400,
    actions: [
      `Update your Angular dependencies to version 14.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@14 update @angular/core@14 @angular/cli@14 --force</pre>`,

      `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@14 update @angular/cdk@14 --force</pre>`,

      `Update SBB Angular. Our automatic migration takes care of the changes.
        <pre>ng update @sbb-esta/angular@14</pre>`,

      `If your sass files contain any <code>@import</code> to our mixins or sass variables, you have to manually migrate to <code>@use</code>.
      Example: <p><code>@import '@sbb-esta/angular/styles.scss';</code> becomes <code>@use '@sbb-esta/angular' as sbb;</code>.</p>
      <p>Additionally, you have to prefix all imported symbols: e.g. <code>pxToRem(5)</code> becomes <code>sbb.pxToRem(5)</code></p>
      <p>Read more at <a href="https://sass-lang.com/documentation/at-rules/use">https://sass-lang.com/documentation/at-rules/use</a>.</p>`,
    ],
  },
  {
    from: 1400,
    to: 1500,
    actions: [
      `Update your Angular dependencies to version 15.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@15 update @angular/core@15 @angular/cli@15 --force</pre>`,

      `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@15 update @angular/cdk@15 --force</pre>`,

      `Finally, update SBB Angular.
        <pre>ng update @sbb-esta/angular@15</pre>`,
    ],
  },
  {
    from: 1500,
    to: 1600,
    actions: [
      `Update your Angular dependencies to version 16.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@16 update @angular/core@16 @angular/cli@16 --force</pre>`,

      `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@16 update @angular/cdk@16 --force</pre>`,

      `Finally, update SBB Angular.
        <pre>ng update @sbb-esta/angular@16</pre>`,
    ],
  },
  {
    from: 1600,
    to: 1700,
    actions: [
      `Update your Angular dependencies to version 17.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@17 update @angular/core@17 @angular/cli@17 --force</pre>`,

      `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@17 update @angular/cdk@17 --force</pre>`,

      `Finally, update SBB Angular.
        <pre>ng update @sbb-esta/angular@17</pre>`,
    ],
  },
  {
    from: 1700,
    to: 1800,
    actions: [
      `Update your Angular dependencies to version 18.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@18 update @angular/core@18 @angular/cli@18 --force</pre>`,

      `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@18 update @angular/cdk@18 --force</pre>`,

      `Finally, update SBB Angular.
        <pre>ng update @sbb-esta/angular@18</pre>`,
    ],
  },
  {
    from: 1800,
    to: 1900,
    actions: [
      `Update your Angular dependencies to version 19.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@19 update @angular/core@19 @angular/cli@19 --force</pre>`,

      `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@19 update @angular/cdk@19 --force</pre>`,

      `Finally, update SBB Angular.
        <pre>ng update @sbb-esta/angular@19</pre>`,
    ],
  },
  {
    from: 1900,
    to: 2000,
    actions: [
      `Update your Angular dependencies to version 20.x.x with "--force" flag (due to unmet peer dependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@20 update @angular/core@20 @angular/cli@20 --force</pre>`,

      `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@20 update @angular/cdk@20 --force</pre>`,

      `Finally, update SBB Angular.
        <pre>ng update @sbb-esta/angular@20</pre>`,
    ],
  },
];
