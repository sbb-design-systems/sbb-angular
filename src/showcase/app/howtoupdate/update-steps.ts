export interface UpdateStep {
  from: number;
  to: number;
  actions: string[];
}

const getGeneralActions = (version: number): string[] => [
  `Update your Angular dependencies to version ${version}.x.x with "--force" flag (due to unmet peer ependencies).<br/>
        See <a href='https://update.angular.io'>update.angular.io</a> for a step-by-step guide for updating Angular.<br/>
        <pre>npx @angular/cli@${version} update @angular/core@${version} @angular/cli@${version} --force</pre>`,

  `Update Angular CDK in a separate step to avoid dependency version resolving problems.<br/>
        <pre>npx @angular/cli@${version} update @angular/cdk@${version} --force</pre>`,
];

export const UPDATE_STEPS: UpdateStep[] = [
  {
    from: 1200,
    to: 1300,
    actions: [
      ...getGeneralActions(13),

      `Use <code>ng add</code> to add <code>@sbb-esta/angular</code> package. Our automatic
       migration takes care of most of the changes and also sets up your typography design variant (standard or lean).
        <pre>ng add @sbb-esta/angular</pre>`,

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
      ...getGeneralActions(14),
      `Update SBB Angular. Our automatic migration takes care of the changes.
        <pre>ng update @sbb-esta/angular@14</pre>`,
      `If your sass files contain any <code>@import</code> to our mixins or sass variables, you have to manually migrate to <code>@use</code>.
      Example: <p><code>@import '@sbb-esta/angular/styles.scss';</code> becomes <code>@use '@sbb-esta/angular' as sbb;</code>.</p>
      <p>Additionally, you have to prefix all imported symbols: e.g. <code>pxToRem(5)</code> becomes <code>sbb.pxToRem(5)</code></p>
      <p>Read more at <a href="https://sass-lang.com/documentation/at-rules/use">https://sass-lang.com/documentation/at-rules/use</a>.</p>`,
    ],
  },
];
