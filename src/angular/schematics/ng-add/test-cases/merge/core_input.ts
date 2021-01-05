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
} from '@sbb-esta/angular-core/datetime';
import { TypeRef, mixinDisabled, mixinErrorState } from '@sbb-esta/angular-core/common-behaviors';
