import { Breakpoints as Br, SbbErrorStateMatcher, SbbShowOnDirtyErrorStateMatcher, SbbDateAdapter, SBB_DATE_PIPE_DATE_FORMATS, SbbLeanDateAdapter, SBB_LEAN_DATE_ADAPTER, TypeRef, mixinDisabled, mixinErrorState, Breakpoints, SCALING_FACTOR_4K, SCALING_FACTOR_5K, SbbIconDirectiveModule, SbbIconDirective, SbbOptgroup, SbbOptionModule } from '@sbb-esta/angular/core';
import { createFakeEvent, typeInElement, JAN, ModifierKeys } from '@sbb-esta/angular/core/testing';
import { resourceAccess as rA, SBB_SSO_IDP_AZURE_AD, resourceAccess } from '@sbb-esta/angular/oauth';
import { Component, NgModule, ViewChild } from '@angular/core';

@Component({
  selector: 'sbb-optgroup-test',
  template: `<sbb-optgroup></sbb-optgroup>`,
})
export class SbbOptgroupTestComponent {
  @ViewChild(SbbOptgroup) optionGroup: SbbOptgroup;
}

@NgModule({
  declarations: [SbbOptgroupTestComponent],
  imports: [SbbOptionModule],
})
export class SbbOptgroupTestModule {}
