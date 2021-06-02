export * from './pagination.module';
// To avoid colliding name exports in bundles, don't use star export here
export { SbbPagination, SbbPageChangeEvent } from './pagination/pagination.component';
export * from './navigation/navigation.component';

// To avoid colliding name exports in bundles, don't use star export here
export {
  SbbPageEvent,
  SbbPaginatorComponent,
  SBB_PAGINATOR_DEFAULT_OPTIONS,
  SbbPaginatorDefaultOptions,
} from './paginator/paginator.component';
