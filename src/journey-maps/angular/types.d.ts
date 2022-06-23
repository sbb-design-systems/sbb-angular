// Due to the way ts_library works, scoped types packages (e.g. @mapbox/point-geometry => @types/mapbox__point-geometry)
// do not resolve properly.
// Workaround from : https://github.com/bazelbuild/rules_nodejs/issues/1033#issuecomment-601138246

declare module '@mapbox/point-geometry' {
  export { default } from '@types/mapbox__point-geometry';
}
