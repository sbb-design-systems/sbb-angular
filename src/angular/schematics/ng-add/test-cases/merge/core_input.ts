import { resourceAccess as rA, Breakpoints as Br } from '@sbb-esta/angular-core';
import { createFakeEvent, typeInElement, JAN } from '@sbb-esta/angular-core/testing';
import { ModifierKeys } from '@sbb-esta/angular-core/testing';
import { SBB_SSO_IDP_AZURE_AD, resourceAccess } from '@sbb-esta/angular-core/oauth';
import {
  SbbErrorStateMatcher,
  SbbShowOnDirtyErrorStateMatcher,
} from '@sbb-esta/angular-core/error';
import {
  SbbDateAdapter,
  SBB_DATE_PIPE_DATE_FORMATS,
  SbbBusinessDateAdapter,
  SBB_BUSINESS_DATE_ADAPTER
} from '@sbb-esta/angular-core/datetime';
import { TypeRef, mixinDisabled, mixinErrorState } from '@sbb-esta/angular-core/common-behaviors';
import {
  Breakpoints,
  SCALING_FACTOR_4K,
  SCALING_FACTOR_5K,
} from '@sbb-esta/angular-core/breakpoints';
import { SbbIconDirectiveModule, SbbIconDirective } from '@sbb-esta/angular-core/icon-directive';
import { SbbOptionGroup, SbbOptionModule } from '@sbb-esta/angular-public/option';
import { Component, NgModule, ViewChild } from '@angular/core';

@Component({
  selector: 'sbb-optgroup-test',
  template: `<sbb-option-group></sbb-option-group>`,
})
export class SbbOptgroupTestComponent {
  @ViewChild(SbbOptionGroup) optionGroup: SbbOptionGroup;
}

@NgModule({
  declarations: [SbbOptgroupTestComponent],
  imports: [SbbOptionModule],
})
export class SbbOptgroupTestModule {}
