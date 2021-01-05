import { createFakeEvent, typeInElement, JAN } from '@sbb-esta/angular/core/testing';
import { ModifierKeys } from '@sbb-esta/angular/core/testing';
import { SBB_SSO_IDP_AZURE_AD, resourceAccess } from '@sbb-esta/angular/core/oauth';
import { SbbErrorStateMatcher, SbbShowOnDirtyErrorStateMatcher } from '@sbb-esta/angular/core';
import { SbbDateAdapter, SBB_DATE_PIPE_DATE_FORMATS, SbbBusinessDateAdapter } from '@sbb-esta/angular/core';
import { TypeRef, mixinDisabled, mixinErrorState } from '@sbb-esta/angular/core';
import { Breakpoints, SCALING_FACTOR_4K, SCALING_FACTOR_5K } from '@sbb-esta/angular/core';
import { SbbIconDirectiveModule, SbbIconDirective } from '@sbb-esta/angular/core';
