import { groupBy } from './array-utils';

describe('groupBy()', () => {
  it('returns the expected result', () => {
    const a1 = { key1: { key2: 'a' } };
    const b1 = { key1: { key2: 'b' } };
    const c1 = { key1: { key2: 'c' } };
    const a2 = { key1: { key2: 'a' } };
    const array = [a1, b1, c1, a2];
    const result = groupBy(array, (o) => o.key1.key2);
    expect(result).toEqual({
      a: [a1, a2],
      b: [b1],
      c: [c1],
    });
  });
});
