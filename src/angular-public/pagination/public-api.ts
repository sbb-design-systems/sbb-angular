export * from './pagination.module';
export * from './pagination/pagination.component';
export * from './navigation/navigation.component';
export * from './paginator/paginator.component';
/** @deprecated Remove with v12 */
export { SbbPaginationModule as PaginationModule } from './pagination.module';
/** @deprecated Remove with v12 */
export {
  SbbNavigationPageChangeEvent as NavigationPageChangeEvent,
  SbbNavigation as NavigationComponent,
} from './navigation/navigation.component';
/** @deprecated Remove with v12 */
export {
  SbbPageChangeEvent as PageChangeEvent,
  SbbPagination as PaginationComponent,
} from './pagination/pagination.component';
/** @deprecated Remove with v12 */
export { SbbPageEvent as PageEvent } from './paginator/paginator.component';
