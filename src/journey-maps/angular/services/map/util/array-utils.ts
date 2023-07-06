export const groupBy = <T>(
  array: T[],
  groupKeyAccessor: (element: T) => any,
): { [key in any]: T[] } =>
  array.reduce(
    (res: any, curr: T) => ({
      ...res,
      [groupKeyAccessor(curr)]: [...(res[groupKeyAccessor(curr)] || []), curr],
    }),
    {},
  );
