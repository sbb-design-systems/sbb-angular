import { LinkGeneratorResult } from './page-descriptor.model';

export interface NavigationPageDescriptor {
  index: number;
  title: string;
  link?: LinkGeneratorResult;
}

export class NavigationPageChangeEvent {
  direction: 'next' | 'previous';
}
