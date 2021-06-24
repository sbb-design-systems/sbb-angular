export * from './pagination.module';
export * from './navigation/navigation';

// To avoid colliding name exports in bundles, don't use star export here
export {
  SbbPageEvent,
  SbbPaginator,
  SBB_PAGINATOR_DEFAULT_OPTIONS,
  SbbPaginatorDefaultOptions,
} from './paginator/paginator';
