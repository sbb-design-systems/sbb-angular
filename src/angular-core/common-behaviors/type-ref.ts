/**
 * This is used to wrap types in a decorator context in order for the wrapped
 * type to not be in the meta data. This is necessary for type imports (e.g.
 * import type { ... } from '...') and global types, which are not available
 * in NodeJS (e.g. Event, MouseEvent, ...).
 *
 * e.g.
 *
 *   import type { ClassDependency1 } from '...';
 *
 *   @Component({ ... })
 *   class ExampleComponent {
 *     // Meta data contains ClassDependency1, which breaks consumers
 *     constructor(@Inject(DEPENDENCY) private dep1: ClassDependency1) {}
 *
 *     // Meta data contains Event, which breaks SSR with NodeJS
 *     onEvent(event: Event) { ... }
 *   }
 *
 *   @Component({ ... })
 *   class ExampleComponent {
 *     // Meta data contains undefined instead of ClassDependency1
 *     constructor(@Inject(DEPENDENCY) private dep1: TypeRef<ClassDependency1>) {}
 *
 *     // Meta data contains undefined instead of Event
 *     onEvent(event: TypeRef<Event>) { ... }
 *   }
 */
export type TypeRef<T> = T;
