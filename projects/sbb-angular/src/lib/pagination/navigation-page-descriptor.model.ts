import { LinkGeneratorResult } from './page-descriptor.model';

export interface NavigationPageDescriptor {
  index: number;
  title: string;
  link?: LinkGeneratorResult;
}

export type NavigationPageChangeEvent = 'next' | 'previous';
