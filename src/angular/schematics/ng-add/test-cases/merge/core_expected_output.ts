import { Breakpoints as Br } from '@sbb-esta/angular/core';
import { resourceAccess as rA } from '@sbb-esta/angular/oauth';
import { createFakeEvent, typeInElement, JAN } from '@sbb-esta/angular/core/testing';
import { ModifierKeys } from '@sbb-esta/angular/core/testing';
import { SBB_SSO_IDP_AZURE_AD, resourceAccess } from '@sbb-esta/angular/oauth';
import { SbbErrorStateMatcher, SbbShowOnDirtyErrorStateMatcher } from '@sbb-esta/angular/core';
import { SbbDateAdapter, SBB_DATE_PIPE_DATE_FORMATS, SbbLeanDateAdapter, SBB_LEAN_DATE_ADAPTER } from '@sbb-esta/angular/core';
import { TypeRef, mixinDisabled, mixinErrorState } from '@sbb-esta/angular/core';
import { Breakpoints, SCALING_FACTOR_4K, SCALING_FACTOR_5K } from '@sbb-esta/angular/core';
import { SbbIconDirectiveModule, SbbIconDirective } from '@sbb-esta/angular/core';
import { SbbOptgroup, SbbOptionModule } from '@sbb-esta/angular/core';
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
