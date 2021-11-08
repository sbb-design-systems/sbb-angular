import { InjectionToken } from '@angular/core';

import type { SbbChip } from './chip';
import type { SbbChipList } from './chip-list';

/**
 * Token used to provide a `SbbChipList` to `SbbChip`.
 * Used primarily to avoid circular imports between `SbbChipList` and `SbbChip`.
 */
export const SBB_CHIP_LIST = new InjectionToken<SbbChipList>('SBB_CHIP_LIST');

/**
 * Token used to provide a `SbbChip` to `SbbChipList`.
 * Used primarily to avoid circular imports between `SbbChipList` and `SbbChip`.
 */
export const SBB_CHIP = new InjectionToken<SbbChip>('SBB_CHIP');
