import { InjectionToken } from '@angular/core';

export interface Header {
  opened: boolean;
}

export const SBB_HEADER = new InjectionToken<Header>('SBB_HEADER');
