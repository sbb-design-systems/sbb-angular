declare module '*/package.json' {
  export const version: string;
  export const dependencies: any;
}
declare function require(path: string): any;