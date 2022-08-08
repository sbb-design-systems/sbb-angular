// Due to the way ts_library works, scoped types packages (e.g. @mapbox/point-geometry => @types/mapbox__point-geometry)
// do not resolve properly. Details: https://github.com/bazelbuild/rules_nodejs/issues/1033#issuecomment-601138246
// The workaround from this ticket seems to break our build (https://github.com/angular/angular/issues/46965)
// Therefore, the type definitions are copied from here: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mapbox

declare class Point {
  x: number;
  y: number;

  constructor(x: number, y: number);

  clone(): Point;

  add(p: Point): Point;

  _add(p: Point): Point;

  sub(p: Point): Point;

  _sub(p: Point): Point;

  multiByPoint(p: Point): Point;

  divByPoint(p: Point): Point;

  mult(k: number): Point;

  _mult(k: number): Point;

  div(k: number): Point;

  _div(k: number): Point;

  rotate(k: number): Point;

  _rotate(k: number): Point;

  rotateAround(k: number, p: Point): Point;

  _rotateAround(k: number, p: Point): Point;

  matMult(m: number[]): Point;

  _matMult(m: number[]): Point;

  unit(): Point;

  _unit(): Point;

  perp(): Point;

  _perp(): Point;

  round(): Point;

  _round(): Point;

  mag(): number;

  equals(other: Point): boolean;

  dist(p: Point): number;

  distSqr(p: Point): number;

  angle(): number;

  angleTo(b: Point): number;

  angleWith(b: Point): number;

  angleWithSep(x: number, y: number): number;

  static convert<T extends unknown>(a: T): T extends number[] ? Point : T extends Point ? Point : T;
}

declare module '@mapbox/point-geometry' {
  export = Point;
}
