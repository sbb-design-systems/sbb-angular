export const distinct = <T>(vals: T[]): T[] => {
  return vals.filter((value, index, self) => self.indexOf(value) === index);
};
